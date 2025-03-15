import fs from "node:fs";
import pino, { multistream } from "pino";

const streams = [
  { stream: fs.createWriteStream("logs/peribot.log", { flags: "a" }) },
];

var logger = pino(
  {
    level: "info",
    formatters: {
      level: (label) => {
        return { level: `[${label.toLocaleUpperCase()}]` };
      },
      bindings: () => {
        return {};
      },
    },
    hooks: {
      logMethod(args, method) {
        console.log(...args); //Also log to console to make debugging easier
        method.apply(this, args);
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  multistream(streams)
);

export default logger;
