"use strict";

const logger = require("../utils/logger");

function createAppsScriptForwarder({ url }) {
  const enabled = Boolean(url);

  async function forward(lead) {
    if (!enabled) return { skipped: true };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead)
      });

      if (!response.ok) {
        throw new Error(`Google Apps Script respondeu com status ${response.status}`);
      }

      await response.json().catch(() => ({}));
      logger.debug({ email: lead.email }, "Lead encaminhado ao Apps Script.");
      return { success: true };
    } catch (error) {
      logger.warn(
        { email: lead.email, err: error },
        "Falha ao encaminhar lead para Google Apps Script"
      );
      return { success: false, error };
    }
  }

  return {
    enabled,
    forward
  };
}

module.exports = {
  createAppsScriptForwarder
};
