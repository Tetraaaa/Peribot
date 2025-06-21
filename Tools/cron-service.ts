import { postRandomSouvenir, refreshSouvenirCache } from "Commands/souvenir";
import cron from "node-cron";
import logger from "./logger";

export const CronService = {
  souvenirOdds: 0,
  scheduleCronJobs: () => {
    logger.info("Enregistrement des cron jobs...");
    cron.schedule("0 0 * * *", () => refreshSouvenirCache());
    cron.schedule("0 14 * * *", () => postRandomSouvenir());
  },
};
