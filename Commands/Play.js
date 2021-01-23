module.exports = function Play(message, linkOrAudioSample)
{
    if(!Play.i) Play.i = 0;

    let voiceChannel = message.member.voice.channel;
    let url = linkOrAudioSample;

    const possibleQuotes = 
    [
        "Got it ! Now playing ",
        "I found something ! ",
        "That was a pretty nice place, I brought you a souvenir. ",
        "Log date 7 15 13 : I went to the coordinates and retrieved a strange piece of music. ",
        "Is this what you humans call 'good music' ? ",
        "Hey ! I'm back ! I found something interesting. "

    ];


    if(voiceChannel)
    {
        if(typeof url =="string")
        {
            const ytdl = require('ytdl-core');
            if(ytdl.validateURL(url))
            {
                playYoutubeVideo(message, voiceChannel, Play.i, url);
            }
            else
            {
                playAudioSample(message, voiceChannel, Play.i, url);
            }
        }
        else
        {
            message.channel.send("Hey, you're supposed to put something after the $play");
        }
    }
    else
    {
        message.channel.send("Sorry, you aren't in a voice channel.");
    }



    Play.i ++;
}

function playYoutubeVideo(message, voiceChannel, i, url)
{
    const ytdl = require('ytdl-core');
    const loadingQuotes = 
    [
        "Okay, I'm going there, I'll call if I find something.",
        "Are you sure those are the good coordinates ? Oh fine, I'll go check myself.",
        "Yeah, I'm searching.",
        "I'll try to bring back good music, or stuff to eat.",
        "I hope you're not sending me to a 404 error again."
    ];

    const possibleErrQuotes = 
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

    voiceChannel.join().then(connection => {
        message.channel.send(loadingQuotes[i%loadingQuotes.length]);
        connection.play(ytdl(url));
    })
}

function playAudioSample(message, voiceChannel, i, url)
{
    const possibleErrQuotes = 
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

    let audioFile = null;
    switch(url)
    {
        case "chasseor":
            audioFile = "Audio/chasseor.mp3"
            break;
        case "ohé":
            audioFile = "Audio/ohé.mp3"
            break;
        case "quefait":
            audioFile = "Audio/quefait.mp3"
            break;
        case "quefe":
            audioFile = "Audio/quefe.mp3"
            break;
        case "alabataille":
            audioFile = "Audio/alabataille.mp3"
            break;
        case "bastissor":
            audioFile = "Audio/bastissor.mp3"
            break;
        case "bonjoua":
            audioFile = "Audio/bonjoua.mp3"
            break;
        case "bucheron":
            audioFile = "Audio/bucheron.mp3"
            break;
        case "paris":
            audioFile = "Audio/paris.mp3"
            break;
        case "ching":
            audioFile = "Audio/ching.mp3";
            break;
        case "chong":
            audioFile = "Audio/chong.mp3";
            break;
        default:
            audioFile = null;
            break;
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
    else
    {
        message.channel.send(possibleErrQuotes[i%possibleErrQuotes.length]);
    }
}