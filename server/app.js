"use strict";

const path = require("path");
const express = require("express");
const logger = require("./utils/logger");
const { loadConfig } = require("./config");
const { getSaoPauloTimestamp } = require("./utils/timezone");

function createServerApp() {
  const config = loadConfig();
  const app = express();
  const publicDir = path.join(__dirname, "..", "public");

  // Servir arquivos estáticos
  app.use(express.static(publicDir, { index: false }));

  // Rota explícita para raiz - servir página de promoções
  app.get("/", (req, res) => {
    res.sendFile(path.join(publicDir, "promocoes.html"));
  });

  // Health check simplificado
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: getSaoPauloTimestamp(),
      message: "Servidor de arquivos estáticos funcionando"
    });
  });

  // Fallback para SPA - redirecionar para página de promoções
  app.use((req, res) => {
    res.sendFile(path.join(publicDir, "promocoes.html"));
  });

  return {
    app,
    config
  };
}

module.exports = {
  createServerApp
};
