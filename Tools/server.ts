import CONFIG from "config";
import express from "express";
import { peribot } from "peribot";

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

  app.listen(CONFIG.EXPRESS_SERVER_PORT);
}
