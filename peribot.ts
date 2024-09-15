import { secrets } from "./_private";

import {
  Client,
  Events,
  GatewayIntentBits,
  Message,
  PartialGroupDMChannel,
} from "discord.js";
import path from "node:path";
import fs from "node:fs";
import { PeribotCommand } from "./types";

const commandsPath = "./Commands";
const commandFiles = fs.readdirSync(commandsPath);
const commands: Record<string, PeribotCommand> = {};

for (const file of commandFiles) {
  let commandName = file.replace(".ts", "");
  const command = await import("./Commands/" + commandName);
  commands[commandName] = command.default;
}

//Nouvelle instance du bot
const peribot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});
//Nombre de phrases prononcées par le bot depuis son lancement
var i;
//Confidentiel : Token privé du bot
peribot.login(secrets.token);

//Fonction appelée une fois que le bot est correctement initialisé
peribot.on(Events.ClientReady, function () {
  console.log("Peribot démarré, bip boup");
  peribot.user?.setActivity("C L O D S. E X E");
  i = 0;
});

peribot.on(Events.MessageCreate, function (message) {
  execute(message);
});

//Prend un message destiné à Peribot en paramètre et effectue la commande correspondante
function execute(message: Message) {
  if (!message.content.startsWith("$")) return;

  let text = message.content.substring(1);
  let parsedCommand = "";

  let currentlyInString = false;
  [...text].forEach((character) => {
    if (character === " ") {
      if (currentlyInString) {
        parsedCommand = parsedCommand += character;
      } else {
        parsedCommand = parsedCommand += "[argumentSeparator]";
      }
    } else if (character === '"') {
      currentlyInString = !currentlyInString;
    } else {
      parsedCommand = parsedCommand += character;
    }
  });

  let args = parsedCommand.split("[argumentSeparator]");
  let command = args[0];
  args.shift();

  if (commands[command]) {
    commands[command].execute(message, i, peribot, ...args);
  } else {
    commands.unknown.execute(message, i, peribot);
  }
  i++;
}
