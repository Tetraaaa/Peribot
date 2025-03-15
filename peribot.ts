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
import { secrets } from "_private";

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
var i = 0;
//Confidentiel : Token privé du bot
peribot.login(secrets.token);

//Fonction appelée une fois que le bot est correctement initialisé
peribot.on(Events.ClientReady, function () {
  let host = hostname();
  scheduleCronJobs();
  runExpressServer();
  registerCrashListeners();
  logger.info("Peribot démarré, bip boup");
  peribot.user?.setPresence({
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
});

peribot.on(Events.MessageCreate, onMessage);

async function onMessage(message: Message) {
  if (!message.content.startsWith("$")) return;

  let messageContent = message.content.substring(1);
  let [command, ...args] = parseCommand(messageContent);

  executeCommand(message.author, command, message, ...args);
  i++;
}

function parseCommand(commandText: string) {
  let parsedCommand = "";

  let currentlyInString = false;
  [...commandText].forEach((character) => {
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
  return [command, ...args];
}

async function executeCommand(
  user: User,
  command: string,
  originalMessage: Message<boolean>,
  ...args: any
) {
  let commandToExecute = commands[command];

  const isCommandExecutable =
    Boolean(commandToExecute) &&
    userHasPermissionToExecuteCommand(user, commandToExecute);

  if (!isCommandExecutable) commandToExecute = commands.unknown;

  try {
    await commandToExecute.execute(originalMessage, i, peribot, ...args);
  } catch (error) {
    logger.error(`Error while running command $${command}:`, error);
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
  logger.info("Enregistrement des cron jobs...");
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
