"use strict";

const express = require("express");
const logger = require("../utils/logger");
const {
  sanitizeEmail,
  mapAtuacaoValue,
  mapPossuiClinica,
  mapProdutosInteresse
} = require("../utils/leadHelpers");
const { getSaoPauloTimestamp } = require("../utils/timezone");

function createLeadsRouter({ leadStorage, sheetsService, appsScriptForwarder }) {
  const router = express.Router();

  router.get("/", async (req, res) => {
    try {
      const leads = await leadStorage.listLeads();
      res.json({ leads });
    } catch (error) {
      logger.error({ err: error }, "Falha ao listar leads");
      res.status(500).json({ message: "Falha ao carregar leads" });
    }
  });

  router.post("/", async (req, res) => {
    const {
      nome,
      email,
      telefone,
      atuacao,
      possui_clinica: possuiClinica,
      produtos_interesse: produtosInteresseInput
    } = req.body || {};

    const requiredValues = [nome, email, telefone, atuacao].map((value) =>
      String(value || "").trim()
    );

    if (requiredValues.some((value) => !value)) {
      return res.status(400).json({ message: "Campos obrigatorios ausentes" });
    }

    const atuacaoRaw = String(atuacao || "").trim();

    const produtosInteresseArray = Array.isArray(produtosInteresseInput)
      ? produtosInteresseInput
      : typeof produtosInteresseInput === "string"
        ? [produtosInteresseInput]
        : [];

    const produtosInteresse = Array.from(
      new Set(
        produtosInteresseArray
          .map((value) => String(value || "").trim())
          .filter(Boolean)
      )
    );

    const produtosInteresseLabels = mapProdutosInteresse(produtosInteresse);

    const lead = {
      nome: String(nome || "").trim(),
      email: sanitizeEmail(email),
      telefone: String(telefone || "").trim(),
      atuacao: atuacaoRaw,
      atuacao_label: mapAtuacaoValue(atuacaoRaw),
      possui_clinica: possuiClinica ?? null,
      possui_clinica_label: mapPossuiClinica(possuiClinica ?? ""),
      produtos_interesse: produtosInteresse,
      produtos_interesse_labels: produtosInteresseLabels,
      created_at: getSaoPauloTimestamp()
    };

    try {
      await leadStorage.appendLead(lead);

      const tasks = [];

      if (appsScriptForwarder?.enabled) {
        tasks.push(appsScriptForwarder.forward(lead));
      }

      if (sheetsService?.enabled) {
        tasks.push(
          sheetsService
            .appendLead(lead)
            .catch((error) => logger.error({ err: error }, "Erro ao enviar lead para Google Sheets"))
        );
      }

      await Promise.allSettled(tasks);

      logger.info({ email: lead.email }, "Lead salvo com sucesso");
      res.status(201).json({ message: "Lead salvo com sucesso", lead });
    } catch (error) {
      logger.error({ err: error }, "Falha ao salvar lead");
      res.status(500).json({ message: "Erro ao salvar lead" });
    }
  });

  return router;
}

module.exports = {
  createLeadsRouter
};
