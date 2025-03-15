import { Client, Message, TextChannel } from "discord.js";
import { PeribotCommand } from "../types";
import CONFIG from "../config";
import {
  getAllChannelMessagesWithAttachments,
  refreshSouvenirCache,
  warmupSouvenirCache,
} from "./souvenir";
import logger from "@tools/logger";

const command: PeribotCommand = {
  description: "",
  allowedUsers: CONFIG.ADMINISTRATOR_IDS,

  execute: (message, dialogIndex, peribot, ...rest) => {
    if (rest[0] === "cacheSize") {
      cacheSize(message.channel as TextChannel);
    }
    if (rest[0] === "warmup-souvenir") {
      warmupSouvenirCache(message.channel.id, peribot);
    }
    if (rest[0] === "refresh-souvenir") {
      refreshSouvenirCache(peribot);
    }
    if (rest[0] === "throw") {
      throw Error("Error thrown by user");
    }
    if (rest[0] === "stop") {
      logger.info("Destroying bot instance...");
      peribot.destroy();
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
