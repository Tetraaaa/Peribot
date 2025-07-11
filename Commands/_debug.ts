import logger from "@tools/logger";
import { Peribot } from "@tools/peribot";
import { TextChannel } from "discord.js";
import CONFIG from "../config";
import { PeribotCommand } from "../types";
import {
  postRandomSouvenir,
  refreshSouvenirCache,
  warmupSouvenirCache,
} from "./souvenir";

const command: PeribotCommand = {
  description: "",
  allowedUsers: CONFIG.ADMINISTRATOR_IDS,

  execute: async (message, ...rest) => {
    if (rest[0] === "cacheSize") {
      cacheSize(message.channel as TextChannel);
    }
    if (rest[0] === "warmup-souvenir") {
      warmupSouvenirCache(message.channel.id, Peribot.instance);
    }
    if (rest[0] === "refresh-souvenir") {
      refreshSouvenirCache();
    }
    if (rest[0] === "throw") {
      throw Error("Error thrown by user");
    }
    if (rest[0] === "stop") {
      logger.info("Destroying bot instance...");
      Peribot.instance.destroy();
    }
    if (rest[0] === "random-souvenir") {
      postRandomSouvenir();
    }
  },
};
export default command;

async function cacheSize(channel: TextChannel) {
  const cache = await import("../cache/souvenir.json");
  let cachedChannels = 0;
  let totalAttachments = 0;
  for (const [key, value] of Object.entries(cache.default.item)) {
    cachedChannels++;
    totalAttachments += value.length;
  }
  let response = `\`Channels cached : ${cachedChannels}\nAttachments total: ${totalAttachments}\``;
  channel.send(response);
  logger.info(response);
}
