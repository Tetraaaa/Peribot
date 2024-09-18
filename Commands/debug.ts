import { Client, Message, TextChannel } from "discord.js";
import { PeribotCommand } from "../types";
import CONFIG from "../config";
import { getAllChannelMessagesWithAttachments } from "./souvenir";

const command: PeribotCommand = {
  allowedUsers: CONFIG.ADMINISTRATOR_IDS,

  execute: (message, dialogIndex, peribot, ...rest) => {
    if (rest[0] === "cacheSize") {
      cacheSize(message.channel as TextChannel);
    }
    if (rest[0] === "warmup-souvenir") {
      warmupSouvenirCache(message.channel as TextChannel, peribot);
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
  console.log(response);
}

async function warmupSouvenirCache(channel: TextChannel, peribot: Client) {
  let response = `\`Warming up cache for the souvenir command. This might take a while...\``;
  channel.send(response);
  console.log(response);
  let start = new Date().getTime();
  let messages = await getAllChannelMessagesWithAttachments(
    channel,
    peribot.user?.id || ""
  );
  let timeTakenInSeconds = Math.floor((new Date().getTime() - start) / 1000);
  response = `\`${messages.length} messages cached in ${timeTakenInSeconds}s.\``;
  channel.send(response);
  console.log(response);
}
