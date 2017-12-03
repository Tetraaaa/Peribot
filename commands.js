module.exports = class commands
{
    //Classe utilitaire, correspond à toutes les commandes de base de Peribot

    /*
    Commandes

    Les commandes effectuant plusieurs actions prennent en paramètre un entier i qui correspond à la phrase que Peridot prononcera
    i est remis à zéro en cas d'exception
    */

    //Peridot répond "pong" suivi de son ping au serveur discord
    static ping(peribot, message)
    {
        message.channel.send("pong ! " + peribot.ping + " ms !");
    }
    //Peridot envoie en message privé à l'utilisateur qui a tapé la commande la liste des commandes disponibles
    static help(message, i)
    {
        let commandes =            
        "```\n" 
        + "$ping : Gets the current latency between the server and Peribot, in milliseconds\n"
        + "$help : Sends you a private message with this list of commands you are reading right now, why are you even asking\n"
        + "$ghelp : Same as $help, but the message isn't private\n"
        + "$hi : Says hi to Peribot\n"
        + "\n```";
        let possibleQuotes = 
        [
            "Help ? Yeah sure, there you go, check your DMs.",
            "Are you lost again ? Here, check your DMs.",
            "Yeah I know, it's sent already.",
            "Don't worry, Peri got your back.",
            "Gotchu, check your messages.",
            "It's okay, nobody has to know."
        ];
        message.author.send(commandes);
        message.channel.send(possibleQuotes[i%possibleQuotes.length]);
        return i;
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
        + "\n```";

        let possibleQuotes = 
        [
            "Okay, but why would you want everybody to know you're ignorant ?",
            "Hey guys, " + message.author +" just asked for help. "
        ];
        message.channel.send(possibleQuotes[i%possibleQuotes.length]);
        message.channel.send(commandes);
        return i;
    }
    //Peridot vous salue en retour
    static hi(message, i)
    {
        let possibleQuotes = 
        [
            "Hey hi " + message.author +" !",
            "Hello there " + message.author + " !",
            "Hello, you silly human.", 
            "Hi " + message.author + ", how are you today ? No, I'm just asking because I have to, don't bother answering.",
            "Hello " + message.author + ", nyeheheh."
        ];  
        message.channel.send(possibleQuotes[i%possibleQuotes.length]);
        return i;
    }
    //Peridot joue de la musique avec l'url youtube passée en paramètre
    static play(message, i, YoutubeStream)
    {
        let url = message.content.split(' ')[1];
        let title;
        let possibleErrQuotes = 
        [
            "Nah, there's nothing here.",
            "I went to " + url + " but there's no music there, only sadness.",
            "Yeah you might check your web coordinates before sending me to them.",
            "There were some pretty nice flowers there so I picked some, but no music though.",
            "You could've noticed that " + url + " wasn't a proper video id.",
            "I just came back from " + url + ", but this place is almost as empty as your soul.",
            "It shouldn't be that hard for you to press Ctrl + C, Ctrl + V, you know.",
            "I didn't find any music there, sorry. I'll sing for you if you want."
        ];
        let possibleQuotes = 
        [
            "Got it ! Now playing " + title,
            "I found something ! : " + title,
            "That was a pretty nice place, I brought you a souvenir : " + title,
            "Log date 7 15 13 : I went to the coordinates and retrieved a strange piece of music : " + title
        ]

        if(message.member.voiceChannel != null)
        {
            if(YoutubeStream.validateURL(url))
            {
                message.member.voiceChannel.join().then(
                    function(connection)
                    {
                        title = YoutubeStream.getInfo(url, function(err, info)
                    {
                        title = (info.title);
                    });
                        message.channel.send(possibleQuotes[i%possibleQuotes.length]);
                        let stream = YoutubeStream(url, "audioonly");                     
                        connection.playStream(stream).on("end",
                        function()
                        {
                            connection.disconnect();
                        });
                    })
            }
            else
            {
                message.channel.send(possibleErrQuotes[i%possibleErrQuotes.length]);
                return i;
            }
        }
        else
        {
            message.channel.send("You aren't in a voice channel, why would you want to play music.");
        }
        return i;
    }
    //En cas de commande inconnue
    static unknown(message, i)
    {
        let possibleQuotes = 
        [
            "Did you call me ? Oh nevermind, you didn't, it's okay I'll just stay here, behind, riight here.", 
            "No, I definitely don't know that.",
            "You know you are supposed to put something MEANINGFUL after the $ right ?",
            "No, I'm not doing that.", 
            "This doesn't make any sense, much like your puny existence on this planet.",
            "It's okay, we all make mistakes sometimes, you in particular.", 
            "Again, feel free to type $help so I can actually be useful",
            "I can't do that, why don't you " + message.content + " yourself ?",
            "What, why did you call me ? I can't do anything with that."
        ];
        message.channel.send(possibleQuotes[i%possibleQuotes.length]);
        return i;
    }
}