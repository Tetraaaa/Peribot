import { Client, Message } from "discord.js";

export interface PeribotCommand {
  allowedUsers?: string[];
  description: string;
  execute: (message: Message, ...args: any) => Promise<void>;
}

export interface SouvenirCacheData {
  expiresAt: number;
  item: Record<string, string[]>;
}
