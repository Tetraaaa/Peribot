import { Message } from "discord.js";

export interface PeribotCommand {
  execute: (message: Message, dialogIndex: number, ...args) => void;
}
