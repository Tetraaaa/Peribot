import { Message, TextChannel } from "discord.js";
import { PeribotCommand } from "../types";
import { getRandomArrayValue } from "../Tools/random";

let possibleQuotes = (message: Message) => [
  "Hey hey hey ! Did you remember this ?",
  "Wow you'll never guess what I found in those old carboard boxes in the back.",
  "Ta-da ! Does this bring back good old memories ? No ? Maybe decent ones at least ?",
  "I'm tidying up the place. Did you still need this ?",
  "Hello human, I'd like an explanation for this.",
];

const command: PeribotCommand = {
  execute: (message, dialogIndex) => {
    getAllChannelMessagesWithAttachments(message.channel as TextChannel).then(
      (messages) => {
        let messagePicked = getRandomArrayValue(messages);
        messagePicked.reply({
          content:
            possibleQuotes(message)[
              dialogIndex % possibleQuotes(message).length
            ],
          files: [messagePicked.attachments.at(0)!],
        });
      }
    );
  },
};
export default command;

async function getAllChannelMessagesWithAttachments(
  channel: TextChannel
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
      if (message.attachments.size) messagesWithAttachments.push(message);
    });

    earliestMessageIdFetched = messages.at(messages.size - 1)!.id;
    cycles++;
  } while (cycles < 100);

  return messagesWithAttachments;
}
