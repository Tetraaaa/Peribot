import CONFIG from "config";
import express from "express";
import { peribot } from "peribot";
import process, { memoryUsage } from "node:process";
import logger from "./logger";

function shutDownExpressServer(server) {
  logger.info("Shutting down express server...");
  server.close();
}

export function runExpressServer() {
  logger.info("Démarrage du serveur express...");

  const app = express();

  app.get("/", async (_, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");

    const cache = await import("../cache/souvenir.json");
    let cachedChannels = 0;
    let totalAttachments = 0;
    for (const [key, value] of Object.entries(cache.default.item)) {
      cachedChannels++;
      totalAttachments += value.length;
    }

    res.json({
      status: "running",
      uptime: Math.floor(peribot.uptime / 1000),
      memoryUsed: memoryUsage().rss,
      cachedChannels,
      totalAttachments,
    });
  });

  const server = app.listen(CONFIG.EXPRESS_SERVER_PORT);
  process.on("beforeExit", () => shutDownExpressServer(server));
}
