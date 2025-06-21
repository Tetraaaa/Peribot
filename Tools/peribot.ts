import { Client } from "discord.js";

type PeribotType = {
  instance: Client;
  dialogIndex: number;
};

export const Peribot: PeribotType = {
  //@ts-ignore Instance is set when the bot is started, so it cannot be undefined at runtime
  instance: undefined,
  dialogIndex: 0,
};
