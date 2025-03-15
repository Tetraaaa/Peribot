import { TextChannel } from "discord.js";
import { PeribotCommand } from "../types";

let possibleQuotesForLowLatency = [
  "Pong ! Is this some kind of game ? Did I win ?",
  "Pong ! Do I have to answer pong everytime to win the game ?",
  "Ping. Nyeheheh gotchu. ",
  "Is this an acronym or something ? ",
];

let possibleQuotesForHighLatency = [
  "Next time I'll bring some food for the trip.",
  "Wow how long was I gone ?",
  "Phew, thought I'd never come back !",
  "Yeah you might want to upgrade your internet plan.",
  "Are you downloading...you know...human stuff ?",
];

const command: PeribotCommand = {
  description:
    "Gets the current latency between the server and Peribot, in milliseconds.",
  execute: async (message, dialogIndex) => {
    (message.channel as TextChannel).send("Pinging...").then((sentMessage) => {
      let ping = sentMessage.createdTimestamp - message.createdTimestamp;
      let possibleQuotes = possibleQuotesForLowLatency;
      if (ping > 400) possibleQuotes = possibleQuotesForHighLatency;
      sentMessage.edit(
        `${possibleQuotes[dialogIndex % possibleQuotes.length]} ${ping} ms.`
      );
    });
  },
};
export default command;
