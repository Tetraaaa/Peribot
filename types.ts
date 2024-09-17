import { Client, Message } from "discord.js";

export interface PeribotCommand {
  execute: (
    message: Message,
    dialogIndex: number,
    peribot: Client,
    ...args
  ) => void;
}

export interface SouvenirCacheData {
  expiresAt: number;
  item: Record<string, string[]>;
}