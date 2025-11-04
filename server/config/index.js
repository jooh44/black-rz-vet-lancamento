"use strict";

const path = require("path");

require("dotenv").config();

const defaultWorksheetName = "Leads";

function normalizePrivateKey(rawValue) {
  if (typeof rawValue !== "string" || !rawValue.trim()) {
    return null;
  }
  let normalized = rawValue.trim();
  if (normalized.startsWith('"') && normalized.endsWith('"')) {
    normalized = normalized.slice(1, -1);
  }
  if (normalized.includes("\\n")) {
    normalized = normalized.replace(/\\n/g, "\n");
  }
  return normalized;
}

function resolveOrigins(rawOrigin) {
  if (!rawOrigin) return [];
  return rawOrigin
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function loadConfig() {
  const projectRoot = path.join(__dirname, "..", "..");
  const dataDir = path.join(projectRoot, "data");

  const rawPrivateKey = process.env.GOOGLE_PRIVATE_KEY;
  const normalizedPrivateKey = normalizePrivateKey(rawPrivateKey);

  const config = {
    env: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT) || 8788,
    data: {
      dir: dataDir,
      leadsFile: path.join(dataDir, "leads.json"),
      sheetsLog: path.join(dataDir, "sheets-debug.log"),
      sheetsErrors: path.join(dataDir, "sheets-errors.log")
    },
    cors: {
      allowedOrigins: resolveOrigins(process.env.ALLOWED_ORIGIN)
    },
    sheets: {
      spreadsheetId: process.env.GOOGLE_SHEETS_ID || "",
      worksheetName: process.env.GOOGLE_SHEETS_TAB_NAME || defaultWorksheetName,
      serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "",
      serviceAccountKey: normalizedPrivateKey,
      appsScriptUrl: process.env.GOOGLE_APPS_SCRIPT_URL || ""
    }
  };

  return config;
}

function validateConfig(config) {
  const issues = [];
  const { spreadsheetId, worksheetName, serviceAccountEmail, serviceAccountKey } = config.sheets;

  const hasSpreadsheet = Boolean(spreadsheetId);
  const hasCredentials = Boolean(serviceAccountEmail && serviceAccountKey);

  if (hasSpreadsheet && !hasCredentials) {
    issues.push(
      "Planilha configurada sem credenciais completas da service account. Defina GOOGLE_SERVICE_ACCOUNT_EMAIL e GOOGLE_PRIVATE_KEY."
    );
  }

  if (!hasSpreadsheet && hasCredentials) {
    issues.push("Credenciais da service account informadas, mas GOOGLE_SHEETS_ID esta vazio.");
  }

  if (spreadsheetId && !worksheetName) {
    issues.push("GOOGLE_SHEETS_TAB_NAME invalido.");
  }

  return {
    isSheetsEnabled: hasSpreadsheet && hasCredentials,
    issues
  };
}

module.exports = {
  loadConfig,
  validateConfig,
  normalizePrivateKey
};
