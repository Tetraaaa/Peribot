import { Message, TextChannel } from "discord.js";
import { PeribotCommand } from "../types";

const possibleQuotes = (message: Message) => [
  "Hey hi " + message.author.username + " !",
  "Hello there " + message.author.username + " !",
  "Hello, you silly human.",
  "Yeah yeah, hello",
  "Hi " +
    message.author.username +
    ", how are you today ? No, I'm just asking because I have to, don't bother answering.",
  "Hello " + message.author.username + ", nyeheheh.",
];

const command: PeribotCommand = {
  execute: (message, dialogIndex) => {
    (message.channel as TextChannel).send(
      possibleQuotes(message)[dialogIndex % possibleQuotes.length]
    );
  },
};
export default command;
