"use strict";

const logger = require("../utils/logger");
const { loadConfig, validateConfig } = require("../config");
const { createGoogleSheetsService } = require("../services/googleSheets");

async function run() {
  const config = loadConfig();
  const validation = validateConfig(config);

  if (validation.issues.length) {
    logger.warn("Issues encontrados na configuracao:");
    validation.issues.forEach((issue) => logger.warn(`- ${issue}`));
  }

  if (!config.sheets.spreadsheetId) {
    logger.info("GOOGLE_SHEETS_ID nao configurado. Encerrando.");
    process.exit(validation.issues.length ? 1 : 0);
  }

  const sheetsService = createGoogleSheetsService({
    config: config.sheets,
    logFiles: { debug: config.data.sheetsLog, error: config.data.sheetsErrors }
  });

  if (!sheetsService.enabled) {
    logger.warn("Servico Google Sheets desativado. Verifique as credenciais.");
    process.exit(1);
  }

  const result = await sheetsService.initialize();

  if (result.initialized) {
    logger.info("Conexao com Google Sheets validada com sucesso.");
    process.exit(0);
  }

  logger.error({ err: result.error }, "Falha ao validar conexao com Google Sheets.");
  process.exit(1);
}

run().catch((error) => {
  logger.error({ err: error }, "Erro inesperado ao validar integracao com Google Sheets.");
  process.exit(1);
});
