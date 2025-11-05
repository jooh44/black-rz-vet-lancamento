"use strict";

const fs = require("fs/promises");
const path = require("path");
const { google } = require("googleapis");
const logger = require("../utils/logger");
const { getSaoPauloTimestamp } = require("../utils/timezone");

const DEFAULT_TIME_ZONE = "America/Sao_Paulo";
const SHEET_HEADERS = [
  "Timestamp",
  "Nome",
  "Email",
  "Telefone",
  "Área de atuação",
  "Possui Clínica?",
  "Produtos de interesse"
];

class AsyncQueue {
  constructor() {
    this.queue = [];
    this.processing = false;
  }

  push(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
      this.#process();
    });
  }

  get size() {
    return this.queue.length;
  }

  async #process() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length) {
      const { task, resolve, reject } = this.queue.shift();
      try {
        const result = await task();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }

    this.processing = false;
  }
}

const MAX_RETRIES = 3;
const BASE_RETRY_DELAY_MS = 1000;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function appendToFile(filePath, message) {
  if (!filePath) return;
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.appendFile(filePath, `${message}\n`, "utf8");
  } catch (error) {
    logger.warn({ err: error }, "Falha ao gravar log auxiliar do Sheets.");
  }
}

function createGoogleSheetsService({ config, logFiles }) {
  const { spreadsheetId, worksheetName, serviceAccountEmail, serviceAccountKey } = config;

  const enabled = Boolean(spreadsheetId && serviceAccountEmail && serviceAccountKey);

  const state = {
    enabled,
    initialized: false,
    lastSuccessAt: null,
    lastError: null,
    metrics: {
      successCount: 0,
      errorCount: 0,
      retries: 0
    }
  };

  let sheetsClient = null;
  const queue = new AsyncQueue();

  async function ensureClient() {
    if (!enabled) {
      return null;
    }
    if (sheetsClient) {
      return sheetsClient;
    }

    logger.info(
      {
        spreadsheetId,
        worksheetName,
        serviceAccountEmail
      },
      "Inicializando cliente Google Sheets"
    );

    const auth = await google.auth.getClient({
      credentials: {
        client_email: serviceAccountEmail,
        private_key: serviceAccountKey
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    });

    sheetsClient = google.sheets({ version: "v4", auth });
    return sheetsClient;
  }

  async function ensureWorksheetExists(client) {
    if (!client) return null;
    const sheetData = await client.spreadsheets.get({
      spreadsheetId,
      includeGridData: false
    });

    const spreadsheet = sheetData.data;
    const sheets = spreadsheet.sheets || [];
    const target = sheets.find((sheet) => sheet.properties?.title === worksheetName);
    if (target) {
      return spreadsheet;
    }

    logger.info({ worksheetName }, "Aba nao encontrada. Tentando criar.");

    await client.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: worksheetName
              }
            }
          }
        ]
      }
    });

  return spreadsheet;
}

  async function ensureHeaderRow(client) {
    if (!client) return;

    try {
      const response = await client.spreadsheets.values.get({
        spreadsheetId,
        range: `${worksheetName}!1:1`
      });

      const currentHeaders = response.data.values?.[0] || [];
      const normalizedCurrent = currentHeaders.map((header) => (header || "").trim());
      const needsUpdate =
        normalizedCurrent.length !== SHEET_HEADERS.length ||
        SHEET_HEADERS.some((header, index) => (normalizedCurrent[index] || "") !== header);

      if (needsUpdate) {
        await client.spreadsheets.values.update({
          spreadsheetId,
          range: `${worksheetName}!A1`,
          valueInputOption: "RAW",
          requestBody: {
            values: [SHEET_HEADERS]
          }
        });

        await appendToFile(
          logFiles.debug,
          `[${getSaoPauloTimestamp()}] Header da planilha sincronizado (${worksheetName}).`
        );
      }
    } catch (error) {
      logger.warn({ err: error }, "Falha ao sincronizar header da planilha.");
    }
  }

  async function ensureSpreadsheetTimezone(client, currentTimeZone) {
    if (!client) return;
    if (currentTimeZone === DEFAULT_TIME_ZONE) {
      return;
    }

    try {
      await client.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              updateSpreadsheetProperties: {
                properties: {
                  timeZone: DEFAULT_TIME_ZONE
                },
                fields: "timeZone"
              }
            }
          ]
        }
      });

      const timestamp = getSaoPauloTimestamp();
      logger.info({ from: currentTimeZone, to: DEFAULT_TIME_ZONE }, "Timezone da planilha atualizado.");
      await appendToFile(
        logFiles.debug,
        `[${timestamp}] Timezone da planilha ajustado para ${DEFAULT_TIME_ZONE}.`
      );
    } catch (error) {
      logger.warn(
        { err: error, desiredTimeZone: DEFAULT_TIME_ZONE },
        "Falha ao atualizar timezone da planilha."
      );
      await appendToFile(
        logFiles.error,
        `[${getSaoPauloTimestamp()}] Erro ao definir timezone ${DEFAULT_TIME_ZONE}: ${error.message}`
      );
    }
  }

  async function initialize() {
    if (!enabled) {
      return { enabled: false, initialized: false };
    }

    try {
      const client = await ensureClient();
      const spreadsheet = await ensureWorksheetExists(client);
      await ensureHeaderRow(client);
      const currentTimeZone = spreadsheet?.properties?.timeZone;
      await ensureSpreadsheetTimezone(client, currentTimeZone);
      state.initialized = true;
      state.lastError = null;
      const timestamp = getSaoPauloTimestamp();
      logger.info("Cliente Google Sheets pronto para uso.");
      await appendToFile(
        logFiles.debug,
        `[${timestamp}] Sheets inicializado com sucesso (aba ${worksheetName}).`
      );
      return { enabled: true, initialized: true };
    } catch (error) {
      state.lastError = {
        message: error.message,
        time: getSaoPauloTimestamp()
      };
      state.initialized = false;
      state.metrics.errorCount += 1;
      logger.error({ err: error }, "Falha ao inicializar Google Sheets");
      await appendToFile(
        logFiles.error,
        `[${getSaoPauloTimestamp()}] Erro ao inicializar Sheets: ${error.message}`
      );
      return { enabled: true, initialized: false, error };
    }
  }

  async function appendRow(lead) {
    const client = await ensureClient();
    if (!client) {
      throw new Error("Cliente Google Sheets indisponivel.");
    }

    const timestamp = getSaoPauloTimestamp();
    const atuacaoFormatada = lead.atuacao_label || lead.atuacao || "";
    const possuiClinica = lead.possui_clinica_label ?? lead.possui_clinica ?? "";
    const produtosInteresse =
      Array.isArray(lead.produtos_interesse_labels) && lead.produtos_interesse_labels.length
        ? lead.produtos_interesse_labels.join("; ")
        : Array.isArray(lead.produtos_interesse) && lead.produtos_interesse.length
        ? lead.produtos_interesse.join("; ")
        : "";

    await client.spreadsheets.values.append({
      spreadsheetId,
      range: `${worksheetName}!A1`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [
          [
            timestamp,
            lead.nome,
            lead.email,
            lead.telefone,
            atuacaoFormatada,
            possuiClinica,
            produtosInteresse
          ]
        ]
      }
    });
  }

  async function appendLead(lead) {
    if (!enabled) {
      return { skipped: true };
    }

    return queue.push(async () => {
      if (!state.initialized) {
        await initialize();
      }

      let attempt = 0;
      let lastError = null;

      while (attempt < MAX_RETRIES) {
        attempt += 1;
        try {
          await appendRow(lead);
          state.lastSuccessAt = getSaoPauloTimestamp();
          state.metrics.successCount += 1;
          if (attempt > 1) {
            state.metrics.retries += attempt - 1;
          }
          await appendToFile(
            logFiles.debug,
            `[${state.lastSuccessAt}] Lead inserido com sucesso (${lead.email})`
          );
          logger.debug({ email: lead.email, attempt }, "Lead replicado no Google Sheets");
          return { success: true };
        } catch (error) {
          lastError = error;
          state.lastError = {
            message: error.message,
            code: error?.code || error?.response?.status || null,
            time: getSaoPauloTimestamp()
          };
          state.metrics.errorCount += 1;

          const retryableStatus = [429, 500, 502, 503, 504];
          const status = error?.response?.status;

          const isRetryable =
            status === undefined || retryableStatus.includes(status) || attempt < MAX_RETRIES;

          logger.warn(
            {
              attempt,
              status,
              email: lead.email,
              err: error
            },
            "Falha ao replicar lead no Google Sheets"
          );

          await appendToFile(
            logFiles.error,
            `[${getSaoPauloTimestamp()}] Falha ao inserir lead ${lead.email}: ${error.message}`
          );

          if (attempt >= MAX_RETRIES || !isRetryable) {
            throw error;
          }

          const delay = BASE_RETRY_DELAY_MS * Math.pow(2, attempt - 1);
          logger.debug({ delay }, "Aguardando para tentar novamente.");
          await wait(delay);
        }
      }

      throw lastError || new Error("Falha desconhecida ao replicar lead.");
    });
  }

  function getStatus() {
    return {
      enabled,
      initialized: state.initialized,
      lastSuccessAt: state.lastSuccessAt,
      lastError: state.lastError,
      metrics: state.metrics,
      pendingJobs: queue.size
    };
  }

  return {
    enabled,
    initialize,
    appendLead,
    getStatus
  };
}

module.exports = {
  createGoogleSheetsService
};
