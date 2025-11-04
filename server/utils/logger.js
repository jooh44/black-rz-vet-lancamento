"use strict";

const pino = require("pino");

const isProd = process.env.NODE_ENV === "production";

let transport;
if (!isProd) {
  try {
    require.resolve("pino-pretty");
    transport = {
      target: "pino-pretty",
      options: {
        translateTime: "SYS:standard",
        colorize: true,
        ignore: "pid,hostname"
      }
    };
  } catch (error) {
    console.warn("pino-pretty nao disponivel. Logs serao emitidos em JSON.");
  }
}

const logger = pino({
  level: process.env.LOG_LEVEL || (isProd ? "info" : "debug"),
  transport
});

module.exports = logger;
