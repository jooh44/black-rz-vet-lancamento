"use strict";

const fs = require("fs/promises");
const path = require("path");

function parseJsonArray(rawContent) {
  if (!rawContent) return [];
  const sanitized = rawContent.replace(/^\uFEFF/, "").trim();
  if (!sanitized) return [];
  try {
    const parsed = JSON.parse(sanitized);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

async function ensureFileExists(filePath) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  try {
    await fs.access(filePath);
  } catch (error) {
    await fs.writeFile(filePath, "[]", "utf8");
  }
}

function createLocalLeadStorage({ leadsFile }) {
  if (!leadsFile) {
    throw new Error("Caminho do arquivo de leads nao configurado.");
  }

  async function listLeads() {
    await ensureFileExists(leadsFile);
    const raw = await fs.readFile(leadsFile, "utf8");
    return parseJsonArray(raw);
  }

  async function appendLead(lead) {
    await ensureFileExists(leadsFile);
    const leads = await listLeads();
    leads.push(lead);
    await fs.writeFile(leadsFile, JSON.stringify(leads, null, 2));
    return lead;
  }

  return {
    listLeads,
    appendLead
  };
}

module.exports = {
  createLocalLeadStorage
};
