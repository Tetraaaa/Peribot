const { Speaking } = require("discord.js");

module.exports =  function Join(message)
{
    const possibleQuotes = 
    [
        "Yeah how can I help ?"
    ]; 

    if(!Join.i) Join.i = 0;

    let voiceChannel = message.member.voice.channel;
    voiceChannel.join().then(connection => {
        connection.voice.setSelfDeaf(true);
        connection.setSpeaking(Speaking.FLAGS.SOUNDSHARE);
    })

    message.channel.send(possibleQuotes[Join.i%possibleQuotes.length]);

    Join.i ++;
}

