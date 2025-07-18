import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import { Peribot } from "@tools/peribot";
import { TextChannel } from "discord.js";
import { PeribotCommand } from "../types";

const possibleErrQuotes = [
  "Hey, I can't find you anywhere !",
  "But where are you ?",
  "I can't see you from where I am !",
  "Who ? Where ?",
];

const command: PeribotCommand = {
  description:
    "Peridots comes and squeezes some fairy juice into your channel.",

  execute: async (message) => {
    const { guildId, guild, member } = message;

    const isVoiceChannelJoinable = Boolean(
      member?.voice.channel?.joinable &&
        member?.voice.channelId &&
        guildId &&
        guild
    );

    if (!isVoiceChannelJoinable) {
      (message.channel as TextChannel).send(
        possibleErrQuotes[Peribot.dialogIndex % possibleErrQuotes.length]
      );
      return;
    }
    const connection = joinVoiceChannel({
      channelId: member?.voice.channelId!,
      guildId: guildId!,
      adapterCreator: guild?.voiceAdapterCreator!,
    });

    const player = createAudioPlayer();
    connection.on(VoiceConnectionStatus.Ready, () => {
      connection.subscribe(player);
      const audioResource = createAudioResource("./Audio/heal.mp3");

      (message.channel as TextChannel).send(
        "It's dangerous to go alone, take this."
      );

      player.play(audioResource);
      player.on(AudioPlayerStatus.Idle, () => {
        connection.destroy();
        (message.channel as TextChannel).send(
          ":heart::heart::heart::heart::heart::heart::heart::heart::heart::heart:"
        );
      });
    });
  },
};
export default command;
