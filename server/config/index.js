"use strict";

require("dotenv").config();

function loadConfig() {
  const config = {
    env: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT) || 8788
  };

  return config;
}

module.exports = {
  loadConfig
};
