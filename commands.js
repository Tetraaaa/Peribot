
module.exports = class commands
{

    //Classe utilitaire, correspond à toutes les commandes de base de Peribot

    /*
    Commandes

    Les commandes effectuant plusieurs actions prennent en paramètre un entier i qui correspond à la phrase que Peridot prononcera
    i est remis à zéro en cas d'exception
    */

    //Peridot répond "pong" suivi de son ping au serveur discord
    static ping(message)
    {
        const Ping = require("./Commands/Ping");
        Ping(message);
    }
    
    //Peridot envoie en message privé à l'utilisateur qui a tapé la commande la liste des commandes disponibles
    static help(message)
    {
        const Help = require("./Commands/Help");
        Help(message);
    }
    //Peridot répond par la liste des commandes disponibles
    static ghelp(message, i)
    {
        let commandes =            
        "```\n" 
        + "$ping : Gets the current latency between the server and Peribot, in milliseconds\n"
        + "$help : Sends you a private message with this list of commands you are reading right now, why are you even asking\n"
        + "$ghelp : Same as $help, but the message isn't private\n"
        + "$hi : Says hi to Peribot\n"
        + "$play <youtube_url> : Peridot connects to your vocal channel and starts playing the audio from the url you typed.\n"
        + "$stop : Peridots stops the music and disconnects from your channel.\n"
        + "\n```";

        let possibleQuotes = 
        [
            "Okay, but why would you want everybody to know you're ignorant ?",
            "Hey guys, " + message.author +" just asked for help. ",
            "I'm not sure why, but here is some help."
        ];
        message.channel.send(possibleQuotes[i%possibleQuotes.length]);
        message.channel.send(commandes);
        return i;
    }
    //Peridot vous salue en retour
    static hi(message)
    {
        const Hi = require("./Commands/Hi");
        Hi(message);
    }

    static chingchong(message)
    {
        const ChingChong = require("./Commands/ChingChong");
        ChingChong(message);
    }

    //Peridot joue de la musique avec l'url youtube passée en paramètre
    static play(message, i, peribot)
    {
        let voiceChannel = message.member.voice.channel;
        let url = message.content.split(' ')[1];
        var title;
        let possibleErrQuotes = 
        [
            "Nah, there's nothing here.",
            "I went to " + url + " but there's no music there, only sadness.",
            "Yeah you might check your web coordinates before sending me to them.",
            "There were some pretty nice flowers there so I picked some, but no music though.",
            "You could've noticed that " + url + " wasn't a proper video id.",
            "I just came back from " + url + ", but this place is almost as empty as your soul.",
            "It shouldn't be that hard for you to press Ctrl + C, Ctrl + V, you know.",
            "I didn't find any music there, sorry. I'll sing for you if you want.",
            "So what was that thing you told me about the number '404' already ?"
        ];
        let possibleQuotes = 
        [
            "Got it ! Now playing ",
            "I found something ! ",
            "That was a pretty nice place, I brought you a souvenir. ",
            "Log date 7 15 13 : I went to the coordinates and retrieved a strange piece of music. ",
            "Is this what you humans call 'good music' ? ",
            "Hey ! I'm back ! I found something interesting. "

        ]
        let loadingQuotes = 
        [
            "Okay, I'm going there, I'll call if I find something.",
            "Are you sure those are the good coordinates ? Oh fine, I'll go check myself.",
            "Yeah, I'm searching.",
            "I'll try to bring back good music, or stuff to eat.",
            "I hope you're not sending me to a 404 error again."
        ]
        if(voiceChannel != null)
        {
            if(typeof url =="string")
            {
                const ytdl = require('ytdl-core');
                if(ytdl.validateURL(url))
                {
                    voiceChannel.join().then(
                        function(connection)
                        {
                            message.channel.send(loadingQuotes[i%loadingQuotes.length]);
                            ytdl.getInfo(url).then(info => {
                                let stream = ytdl(url);              
                                connection.play(stream).on("end",
                                function()
                                {
                                    voiceChannel.leave();
                                });
                            })
                            .catch(error => {
                                message.channel.send(possibleErrQuotes[i%possibleErrQuotes.length]);
                                return i;
                            })


                        })
                        .catch(error => console.log(error))
                }
                else
                {
                    let audioFile = null;
                    switch(url)
                    {
                        case "chasseor":
                            audioFile = "chasseor.mp3"
                            break;
                        case "ohé":
                            audioFile = "ohé.mp3"
                            break;
                        case "quefait":
                            audioFile = "quefait.mp3"
                            break;
                        case "quefe":
                            audioFile = "quefe.mp3"
                            break;
                        case "alabataille":
                            audioFile = "alabataille.mp3"
                            break;
                        case "bastissor":
                            audioFile = "bastissor.mp3"
                            break;
                        case "bonjoua":
                            audioFile = "bonjoua.mp3"
                            break;
                        case "bucheron":
                            audioFile = "bucheron.mp3"
                            break;
                        case "paris":
                            audioFile = "paris.mp3"
                            break;
                        case "ching":
                            audioFile = "ching.mp3";
                            break;
                        case "chong":
                            audioFile = "chong.mp3";
                            break;
                        default:
                            message.channel.send(possibleErrQuotes[i%possibleErrQuotes.length]);
                            return i;
                    }
                    if(audioFile)
                    {
                        voiceChannel.join().then(connection => {
                            connection.play(audioFile);
                        })
                        .catch(error => {
                            message.channel.send(possibleErrQuotes[i%possibleErrQuotes.length]);
                        })
                    }

                }
            }
            else
            {
                message.channel.send("Hey, you're supposed to put something after the $play");
            }
        }
        else
        {
            message.channel.send("You aren't in a voice channel, why would you want to play music.");
        }
        return i;
    }
    //Peridot se déconnecte du serveur vocal et arrête de jouer la musique
    static stop(message, i, peribot)
    {
        let possibleErrQuotes = 
        [
            "Stop what ?",
            "STOP WHAT ?",
            "WHAT DO I HAVE TO STOP I DO NOT UNDERSTAND",
            "You're not in a channel, you can't stop anything from here.",
            "There isn't any music, it's probably just your ears whistling",
            "You can't stop me, nyeheh. Were you talking about music ? I can't stop that either."
        ]
        let possibleQuotes =
        [
            "Okay, byebye !",
            "Sorry guys, but " + message.author + " would like you to stop having fun please.",
            "Party's over",
            "You know where to find me !",
            "It's okay, I'll just leave ! Have a great time, without me.",
            "Yeah, I didn't like the music either."
        ]
        console.log(peribot.voice)
        if(peribot.voice.channel && message.member.voice.channel != null)
        {
            peribot.voice.channel.disconnect();
            message.channel.send(possibleQuotes[i%possibleQuotes.length]);
            i++;
        }
        else
        {
            message.channel.send(possibleErrQuotes[i%possibleErrQuotes.length]);
        }
        return i;
    }

    static disconnect(message)
    {
        const Disconnect = require("./Commands/Disconnect");
        Disconnect(message);
    }


    //En cas de commande inconnue
    static unknown(message)
    {
        const NotFound = require("./Commands/NotFound");
        NotFound(message);
    }
}