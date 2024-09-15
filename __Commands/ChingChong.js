const say = require("say");

module.exports =  function ChingChong(message)
{
    const possibleQuotes = 
    [
        ""
    ]; 

    if(!ChingChong.i) ChingChong.i = 0;

    let voiceChannel = message.member.voice.channel;

    message.channel.send(possibleQuotes[ChingChong.i%possibleQuotes.length]);

    say.export("help me please")




    ChingChong.i ++;
}

