import { Client, Collection, Message, TextChannel } from "discord.js";
import { PeribotCommand } from "../types";
import { getRandomArrayValue } from "../Tools/random";
import { SouvenirCache } from "../Tools/cache";
import logger from "@tools/logger";

let possibleQuotes = (message: Message) => [
  "Hey hey hey ! Did you remember this ?",
  "Wow you'll never guess what I found in those old carboard boxes in the back.",
  "Ta-da ! Does this bring back good old memories ? No ? Maybe decent ones at least ?",
  "I'm tidying up the place. Did you still need this ?",
  "Hello human, I'd like an explanation for this.",
  "I just shattered spacetime to bring you this, I hope it was worth it.",
];

const command: PeribotCommand = {
  description:
    "Peribot picks a random picture from this channel and reposts it.",
  execute: async (message, dialogIndex, peribot) => {
    const messagePicked = await getRandomChannelMessageWithAttachment(
      message.channel as TextChannel,
      peribot.user?.id || ""
    );
    if (!messagePicked)
      throw "Unable to find a message with an attachment for this channel. Maybe this channel hasn't been cached yet, or does not contain any messages with attachments.";
    messagePicked.reply({
      content:
        possibleQuotes(message)[dialogIndex % possibleQuotes(message).length],
      files: [messagePicked.attachments.at(0)!],
    });
  },
};
export default command;

async function getRandomChannelMessageWithAttachment(
  channel: TextChannel,
  peribotId: string
) {
  if (SouvenirCache.hit(channel.id)) {
    const messageIdPicked = getRandomArrayValue(SouvenirCache.get(channel.id)!);
    if (messageIdPicked) return channel.messages.fetch(messageIdPicked);
  }
  return getRandomArrayValue(
    await getAllChannelMessagesWithAttachments(channel, peribotId)
  );
}

export async function getAllChannelMessagesWithAttachments(
  channel: TextChannel,
  peribotId: string
): Promise<Message[]> {
  const messagesWithAttachments: Message[] = [];

  let cycles = 0;
  let earliestMessageIdFetched: string | undefined = undefined;
  do {
    const messages: Collection<
      string,
      Message<true>
    > = await channel.messages.fetch({
      limit: 100,
      before: earliestMessageIdFetched,
    });
    if (!messages.size) break;

    messages.forEach((message) => {
      if (message.attachments.size && message.author.id !== peribotId)
        messagesWithAttachments.push(message);
    });

    earliestMessageIdFetched = messages.at(messages.size - 1)!.id;
    cycles++;
  } while (cycles < 500);

  if (messagesWithAttachments.length) {
    SouvenirCache.clear(channel.id);
    SouvenirCache.set(
      channel.id,
      messagesWithAttachments.map((m) => m.id)
    );
  }

  return messagesWithAttachments;
}

export function refreshSouvenirCache(peribot: Client) {
  logger.info("Clearing and rewarming up cache for souvenir data...");

  try {
    SouvenirCache.getAllChannels().forEach((channel) => {
      warmupSouvenirCache(channel, peribot);
    });
  } catch (error) {
    logger.error(error, "Error when warming up souvenir cache.");
  }
}

export async function warmupSouvenirCache(channelId: string, peribot: Client) {
  const channel = (await peribot.channels.fetch(channelId)) as TextChannel;
  logger.info(`[${channel.name}] warming up. This might take a while...`);
  let start = new Date().getTime();
  let messages = await getAllChannelMessagesWithAttachments(
    channel,
    peribot.user?.id || ""
  );
  let timeTakenInSeconds = Math.floor((new Date().getTime() - start) / 1000);
  logger.info(
    `[${channel.name}] ${messages.length} messages cached in ${timeTakenInSeconds}s.`
  );
}

export async function postRandomSouvenir(peribot: Client, dialogIndex: number) {
  const randomChannelId = getRandomArrayValue(SouvenirCache.getAllChannels());
  if (!randomChannelId) {
    logger.error(
      "Unable to get random channel from souvenir cache, maybe cache is empty ?"
    );
    return;
  }
  const channel = (await peribot.channels.fetch(
    randomChannelId
  )) as TextChannel;
  const messagePicked = await getRandomChannelMessageWithAttachment(
    channel,
    peribot.user?.id || ""
  );
  if (!messagePicked) return;
  messagePicked.reply({
    content:
      possibleQuotes(messagePicked)[
        dialogIndex % possibleQuotes(messagePicked).length
      ],
    files: [messagePicked.attachments.at(0)!],
  });
}
