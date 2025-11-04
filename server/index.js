"use strict";

const logger = require("./utils/logger");
const { createServerApp } = require("./app");

function start() {
  const { app, config } = createServerApp();
  const port = config.port;

  app.listen(port, () => {
    logger.info(`API de leads executando em http://localhost:${port}`);
  });
}

start();
