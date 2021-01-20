module.exports =  function Disconnect(message)
{
    if(!Disconnect.i) Disconnect.i = 0;

    
    message.channel.send(possibleQuotes[Disconnect.i%possibleQuotes.length]);
    message.member.voice.channel.leave();

    Disconnect.i ++;
}

const possibleQuotes = [
    "Okay, I'm going ! Bye !", 
    "Damn that's too bad, those bytes were delicious",
    "Sure, but you won't get rid of me that easily you know.", 
    "See ya !",
    "Yeah, I'll let you do your...human things.",
    "Hey, You could've asked nicely !",
    'Where are the "Please", and the "Thank you" ?'
];