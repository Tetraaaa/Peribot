import CONFIG from "config";
import express from "express";
import { peribot } from "peribot";
import process from "node:process";
import logger from "./logger";

function shutDownExpressServer(server) {
  logger.info("Shutting down express server...");
  server.close();
}

export function runExpressServer() {
  console.log("Démarrage du serveur express...");

  const app = express();

  app.get("/", (_, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json({
      status: "running",
      uptime: peribot.uptime,
    });
  });

  const server = app.listen(CONFIG.EXPRESS_SERVER_PORT);
  process.on("beforeExit", () => shutDownExpressServer(server));
}
