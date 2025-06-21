import { CronService } from "@tools/cron-service";
import logger from "@tools/logger";
import { Peribot } from "@tools/peribot";
import { runExpressServer } from "@tools/server";
import { secrets } from "_private";
import {
  ActivityType,
  Client,
  Events,
  GatewayIntentBits,
  Message,
  User,
} from "discord.js";
import fs from "node:fs";
import { hostname } from "node:os";
import { PeribotCommand } from "./types";

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
Peribot.instance = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

//Confidentiel : Token privé du bot
Peribot.instance.login(secrets.token);

//Fonction appelée une fois que le bot est correctement initialisé
Peribot.instance.on(Events.ClientReady, function () {
  let host = hostname();
  CronService.scheduleCronJobs();
  runExpressServer();
  registerCrashListeners();
  logger.info("Peribot démarré, bip boup");
  Peribot.instance!.user?.setPresence({
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

Peribot.instance.on(Events.MessageCreate, onMessage);

async function onMessage(message: Message) {
  if (!message.content.startsWith("$")) return;

  let messageContent = message.content.substring(1);
  let [command, ...args] = parseCommand(messageContent);

  executeCommand(message.author, command, message, ...args);
  Peribot.dialogIndex++;
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
    await commandToExecute.execute(originalMessage, ...args);
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
