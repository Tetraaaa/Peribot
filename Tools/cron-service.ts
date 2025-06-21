import { refreshSouvenirCache } from "Commands/souvenir";
import logger from "./logger";
import cron from "node-cron";
import { peribot } from "peribot";

export const CronService = {
  scheduleCronJobs: () => {
    logger.info("Enregistrement des cron jobs...");
    cron.schedule("0 0 * * *", () => refreshSouvenirCache(peribot));
  },
};
