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

  // Headers de performance para todos os arquivos estáticos
  app.use((req, res, next) => {
    // Cache para arquivos estáticos
    if (req.path.match(/\.(jpg|jpeg|png|gif|ico|webp|svg|woff|woff2|ttf|eot)$/)) {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      res.setHeader("Vary", "Accept-Encoding");
    } else if (req.path.match(/\.(css|js)$/)) {
      res.setHeader("Cache-Control", "public, max-age=2592000");
      res.setHeader("Vary", "Accept-Encoding");
    } else if (req.path.match(/\.(html|htm)$/)) {
      res.setHeader("Cache-Control", "public, max-age=3600, must-revalidate");
      res.setHeader("Vary", "Accept-Encoding");
    }
    
    // Headers de segurança e performance
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-DNS-Prefetch-Control", "on");
    
    next();
  });

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
