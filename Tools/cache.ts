import _souvenirCacheData from "../cache/souvenir.json";
import fs from "node:fs";
import { SouvenirCacheData } from "../types";

const souvenirCacheData: SouvenirCacheData = _souvenirCacheData;

export const SouvenirCache = {
  hit: function hit(channelId: string): boolean {
    return channelId in souvenirCacheData.item;
  },
  get: function get(channelId: string): string[] | undefined {
    return souvenirCacheData.item[channelId];
  },
  set: function set(channelId: string, value: string[]) {
    souvenirCacheData.item[channelId] = value;
    fs.writeFile(
      "./cache/souvenir.json",
      JSON.stringify(souvenirCacheData, null, 2),
      (err) => {
        if (err) console.log("Error writing data to cache : ", err?.message);
      }
    );
  },
};
