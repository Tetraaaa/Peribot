import { Client, Message, TextChannel } from "discord.js";
import { PeribotCommand } from "../types";
import { getRandomArrayValue } from "../Tools/random";
import { SouvenirCache } from "../Tools/cache";

let possibleQuotes = (message: Message) => [
  "Hey hey hey ! Did you remember this ?",
  "Wow you'll never guess what I found in those old carboard boxes in the back.",
  "Ta-da ! Does this bring back good old memories ? No ? Maybe decent ones at least ?",
  "I'm tidying up the place. Did you still need this ?",
  "Hello human, I'd like an explanation for this.",
  "I just shattered spacetime to bring you this, I hope it was worth it.",
];

const command: PeribotCommand = {
  execute: (message, dialogIndex, peribot) => {
    getRandomChannelMessageWithAttachment(
      message.channel as TextChannel,
      peribot.user?.id || ""
    ).then((messagePicked) => {
      messagePicked.reply({
        content:
          possibleQuotes(message)[dialogIndex % possibleQuotes(message).length],
        files: [messagePicked.attachments.at(0)!],
      });
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
    return channel.messages.fetch(messageIdPicked);
  } else {
    return getRandomArrayValue(
      await getAllChannelMessagesWithAttachments(channel, peribotId)
    );
  }
}

export async function getAllChannelMessagesWithAttachments(
  channel: TextChannel,
  peribotId: string
): Promise<Message[]> {
  const messagesWithAttachments: Message[] = [];

  let cycles = 0;
  let earliestMessageIdFetched: string | undefined = undefined;
  do {
    const messages = await channel.messages.fetch({
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

  SouvenirCache.set(
    channel.id,
    messagesWithAttachments.map((m) => m.id)
  );
  return messagesWithAttachments;
}
