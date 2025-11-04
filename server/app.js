"use strict";

const path = require("path");
const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const logger = require("./utils/logger");
const { loadConfig, validateConfig } = require("./config");
const { createLocalLeadStorage } = require("./services/localStorage");
const { createGoogleSheetsService } = require("./services/googleSheets");
const { createAppsScriptForwarder } = require("./services/appsScript");
const { createLeadsRouter } = require("./routes/leads");
const { getSaoPauloTimestamp } = require("./utils/timezone");

async function ensureDataFolder(dir) {
  await fs.mkdir(dir, { recursive: true });
}

function buildCorsConfig(allowedOrigins) {
  if (!allowedOrigins?.length) {
    return { origin: true };
  }
  return {
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origem nao autorizada pelo CORS"));
    }
  };
}

function createServerApp() {
  const config = loadConfig();
  const validation = validateConfig(config);

  if (validation.issues.length) {
    validation.issues.forEach((issue) => logger.warn(issue));
  }

  const app = express();
  app.locals.configValidation = validation;
  const publicDir = path.join(__dirname, "..", "public");

  ensureDataFolder(config.data.dir).catch((error) => {
    logger.error({ err: error }, "Falha ao garantir diretorio de dados.");
  });

  app.use(cors(buildCorsConfig(config.cors.allowedOrigins)));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(publicDir));

  const leadStorage = createLocalLeadStorage({ leadsFile: config.data.leadsFile });
  const sheetsService = createGoogleSheetsService({
    config: config.sheets,
    logFiles: { debug: config.data.sheetsLog, error: config.data.sheetsErrors }
  });
  const appsScriptForwarder = createAppsScriptForwarder({
    url: config.sheets.appsScriptUrl
  });

  if (sheetsService.enabled) {
    sheetsService.initialize().catch((error) => {
      logger.error({ err: error }, "Erro durante inicializacao do Google Sheets.");
    });
  }

  app.get("/api/health", (req, res) => {
    const sheetsStatus = sheetsService.getStatus();
    res.json({
      status: "ok",
      timestamp: getSaoPauloTimestamp(),
      sheets: sheetsStatus,
      config: {
        issues: app.locals.configValidation.issues,
        sheetsEnabled: sheetsStatus.enabled
      }
    });
  });

  app.use(
    "/api/leads",
    createLeadsRouter({
      leadStorage,
      sheetsService,
      appsScriptForwarder
    })
  );

  app.use((req, res) => {
    if (req.path.startsWith("/api")) {
      res.status(404).json({ message: "Rota nao encontrada" });
    } else {
      res.sendFile(path.join(publicDir, "index.html"));
    }
  });

  return {
    app,
    config,
    services: {
      leadStorage,
      sheetsService,
      appsScriptForwarder
    },
    validation
  };
}

module.exports = {
  createServerApp
};
