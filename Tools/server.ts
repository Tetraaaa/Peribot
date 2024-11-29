import CONFIG from "config";
import express from "express";
import { peribot } from "peribot";
import process from "node:process";
import logger from "./logger";

function shutDownExpressServer(app) {
  logger.info("Shutting down express server...");
  app.close();
}

export function runExpressServer() {
  console.log("Démarrage du serveur express...");

  const app = express();

  process.on("SIGTERM", () => shutDownExpressServer(app));
  process.on("SIGINT", () => shutDownExpressServer(app));
  process.on("SIGKILL", () => shutDownExpressServer(app));

  app.get("/", (_, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json({
      status: "running",
      uptime: peribot.uptime,
    });
  });

  app.listen(CONFIG.EXPRESS_SERVER_PORT);
}
