export default class commands {
  //Classe utilitaire, correspond à toutes les commandes de base de Peribot

  /*
    Commandes

    Les commandes effectuant plusieurs actions prennent en paramètre un entier i qui correspond à la phrase que Peridot prononcera
    i est remis à zéro en cas d'exception
    */

  //Peridot répond "pong" suivi de son ping au serveur discord
  static ping(message) {
    const Ping = require("./Commands/Ping");
    Ping(message);
  }

  //Peridot envoie en message privé à l'utilisateur qui a tapé la commande la liste des commandes disponibles
  static help(message) {
    const Help = require("./Commands/Help");
    Help(message);
  }
  //Peridot répond par la liste des commandes disponibles
  static ghelp(message, i) {
    let commandes =
      "```\n" +
      "$ping : Gets the current latency between the server and Peribot, in milliseconds\n" +
      "$help : Sends you a private message with this list of commands you are reading right now, why are you even asking\n" +
      "$ghelp : Same as $help, but the message isn't private\n" +
      "$hi : Says hi to Peribot\n" +
      "$play <youtube_url> : Peridot connects to your vocal channel and starts playing the audio from the url you typed.\n" +
      "$stop : Peridots stops the music and disconnects from your channel.\n" +
      "\n```";

    let possibleQuotes = [
      "Okay, but why would you want everybody to know you're ignorant ?",
      "Hey guys, " + message.author + " just asked for help. ",
      "I'm not sure why, but here is some help.",
    ];
    message.channel.send(possibleQuotes[i % possibleQuotes.length]);
    message.channel.send(commandes);
    return i;
  }
  //Peridot vous salue en retour
  static hi(message) {
    const Hi = require("./Commands/Hi");
    Hi(message);
  }

  static chingchong(message) {
    const ChingChong = require("./Commands/ChingChong");
    ChingChong(message);
  }

  //Peridot joue de la musique avec l'url youtube passée en paramètre
  static play(message, linkOrAudioSample) {
    const Play = require("./Commands/Play");
    Play(message, linkOrAudioSample);
  }
  //Peridot se déconnecte du serveur vocal et arrête de jouer la musique
  static stop(message, i, peribot) {
    let possibleErrQuotes = [
      "Stop what ?",
      "STOP WHAT ?",
      "WHAT DO I HAVE TO STOP I DO NOT UNDERSTAND",
      "You're not in a channel, you can't stop anything from here.",
      "There isn't any music, it's probably just your ears whistling",
      "You can't stop me, nyeheh. Were you talking about music ? I can't stop that either.",
    ];
    let possibleQuotes = [
      "Okay, byebye !",
      "Sorry guys, but " +
        message.author +
        " would like you to stop having fun please.",
      "Party's over",
      "You know where to find me !",
      "It's okay, I'll just leave ! Have a great time, without me.",
      "Yeah, I didn't like the music either.",
    ];
    if (peribot.voice.channel && message.member.voice.channel != null) {
      peribot.voice.channel.disconnect();
      message.channel.send(possibleQuotes[i % possibleQuotes.length]);
      i++;
    } else {
      message.channel.send(possibleErrQuotes[i % possibleErrQuotes.length]);
    }
    return i;
  }

  static disconnect(message) {
    const Disconnect = require("./Commands/Disconnect");
    Disconnect(message);
  }

  static heal(message) {
    Heal(message);
  }

  static join(message) {
    Join(message);
  }

  static lol(message, player) {
    Lol(message, player);
  }

  //En cas de commande inconnue
  static unknown(message) {
    const NotFound = require("./Commands/NotFound");
    NotFound(message);
  }
}
