import { postRandomSouvenir, refreshSouvenirCache } from "Commands/souvenir";
import logger from "./logger";
import cron from "node-cron";
import { dialogIndex, peribot } from "peribot";

export const CronService = {
  souvenirOdds: 0,
  scheduleCronJobs: () => {
    logger.info("Enregistrement des cron jobs...");
    cron.schedule("0 0 * * *", () => refreshSouvenirCache(peribot));
    cron.schedule("0 14 * * *", () => postRandomSouvenir(peribot, dialogIndex));
  },
};
