import fs from "node:fs";
import pino, { multistream } from "pino";

const streams = [
  { level: "debug", stream: fs.createWriteStream("logs/debug.stream.out") },
  { level: "error", stream: fs.createWriteStream("logs/error.stream.out") },
];

var opts = {
  levels: {
    silent: Infinity,
    fatal: 60,
    error: 50,
    warn: 50,
    info: 30,
    debug: 20,
    trace: 10,
  },
  dedupe: true,
};

var logger = pino(
  {
    level: "debug",
    formatters: {
      level: (label) => {
        return { level: `[${label.toLocaleUpperCase()}]` };
      },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  multistream(streams, opts)
);

export default logger;
