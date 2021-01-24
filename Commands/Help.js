module.exports =  function Help(message)
{
    const possibleQuotes = 
    [
        "Help ? Yeah sure, there you go, check your DMs.",
        "Are you lost again ? Here, check your DMs.",
        "Yeah I know, it's sent already.",
        "Don't worry, Peri got your back.",
        "Gotchu, check your messages.",
        "It's okay, nobody has to know."
    ];

    if(!Help.i) Help.i = 0;

    message.author.send(commandes);
    message.channel.send(possibleQuotes[Help.i%possibleQuotes.length]);

    Help.i ++;
}

const commandes =            
"```\n" 
+ "$ping : Gets the current latency between the server and Peribot, in milliseconds\n"
+ "$help : Sends you a private message with this list of commands you are reading right now, why are you even asking\n"
+ "$ghelp : Same as $help, but the message isn't private\n"
+ "$hi : Says hi to Peribot\n"
+ "$play <youtube_url|audioSample> : Peridot connects to your vocal channel and starts playing the audio from the url you typed.\n"
+ "$disconnect : Peridots stops the music and disconnects from your channel.\n"
+ "$join : Peridots joins your vocal channel.\n"
+ "$heal : Peridots comes and squeezes some fairy juice into your channel.\n"
+ "$lol <summoner> : Gets details about a League of Legends summoner.\n"
+ "\n```";