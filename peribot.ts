import { secrets } from "./_private";

import {
  ActivityType,
  Client,
  Events,
  GatewayIntentBits,
  Message,
  PresenceStatusData,
  User,
} from "discord.js";
import fs from "node:fs";
import { PeribotCommand } from "./types";
import logger from "@tools/logger";
import cron from "node-cron";
import { SouvenirCache } from "@tools/cache";
import { runExpressServer } from "@tools/server";
import { refreshSouvenirCache } from "Commands/souvenir";
import { hostname } from "node:os";

logger.info("Import des commandes...");

const commandsPath = "./Commands";
const commandFiles = fs.readdirSync(commandsPath);
const commands: Record<string, PeribotCommand> = {};

for (const file of commandFiles) {
  let commandName = file.replace(".ts", "");
  const command = await import("./Commands/" + commandName);
  commands[commandName.replace("_", "")] = command.default;
}

logger.info("Instantiation du bot...");

//Nouvelle instance du bot
export const peribot = new Client({
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
  let host = hostname();
  logger.info("Enregistrement des cron jobs...");
  scheduleCronJobs();
  runExpressServer();
  registerCrashListeners();
  logger.info("Peribot démarré, bip boup");
  peribot.user.setPresence({
    activities: [
      {
        name: "👍",
        state:
          host === "PC-DE-TON" ? "🔧 Under maintenance" : "C L O D S. E X E",
        type: ActivityType.Custom,
      },
    ],
    status: host === "PC-DE-TON" ? "idle" : "online",
  });
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

  try {
    if (
      commands[command] &&
      userHasPermissionToExecuteCommand(message.author, commands[command])
    ) {
      commands[command].execute(message, i, peribot, ...args);
    } else {
      commands.unknown.execute(message, i, peribot);
    }
  } catch (error) {
    logger.error(error, `Error when executing ${command}.`);
  } finally {
    i++;
  }
}

function userHasPermissionToExecuteCommand(
  user: User,
  command: PeribotCommand
) {
  if (command.allowedUsers?.length)
    return command.allowedUsers.includes(user.id);
  return true;
}

function scheduleCronJobs() {
  cron.schedule("0 0 * * *", () => refreshSouvenirCache(peribot));
}

function registerCrashListeners() {
  process.on("uncaughtException", (err) => {
    logger.fatal(err, "uncaught exception detected");
    process.abort();
  });

  process.on("unhandledRejection", (err) => {
    logger.fatal(err, "unhandled rejection detected");
    process.abort();
  });
}
