import { Client, Message } from "discord.js";

export interface PeribotCommand {
  allowedUsers?: string[];
  description: string;
  execute: (
    message: Message,
    dialogIndex: number,
    peribot: Client,
    ...args: any
  ) => Promise<void>;
}

export interface SouvenirCacheData {
  expiresAt: number;
  item: Record<string, string[]>;
}
