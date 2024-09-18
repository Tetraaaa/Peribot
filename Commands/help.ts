import { Message, TextChannel } from "discord.js";
import { PeribotCommand } from "../types";
import fs from "node:fs";

const possibleQuotes = (message: Message) => [
  "Help ? Yeah sure, there you go, check your DMs.",
  "Are you lost again ? Here, check your DMs.",
  "Yeah I know, it's sent already.",
  "Don't worry, Peri got your back.",
  "Gotchu, check your messages.",
  "It's okay, nobody has to know.",
];

const command: PeribotCommand = {
  description:
    "Sends you a private message with this list of commands you are reading right now, why are you even asking",
  execute: (message, dialogIndex) => {
    getCommandsList().then((commandsList) => {
      message.author.send(commandsList);
    });
    (message.channel as TextChannel).send(
      possibleQuotes(message)[dialogIndex % possibleQuotes(message).length]
    );
  },
};
export default command;

async function getCommandsList() {
  const commandsPath = "./Commands";
  const commandFiles = fs.readdirSync(commandsPath);

  let response = "";
  for (const file of commandFiles) {
    let commandName = file.replace(".ts", "");
    if (commandName.startsWith("_")) continue;
    const command = await import("./" + commandName);
    response += `$${commandName}: ${command.default.description}\n`;
  }
  return "```" + response + "```";
}
