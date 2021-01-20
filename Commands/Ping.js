module.exports =  function Ping(message)
{
    if(!Ping.i) Ping.i = 0;

    message.channel.send("Pinging...")
    .then(sentMessage => {
        ping = sentMessage.createdTimestamp - message.createdTimestamp;
        if(ping <= 500)
        {
            sentMessage.edit(possibleQuotesForLowLatency[Ping.i%possibleQuotesForLowLatency.length] + " " + ping + "ms.");
        }
        else
        {
            sentMessage.edit(possibleQuotesForHighLatency[Ping.i%possibleQuotesForHighLatency.length] + " " + ping + "ms.");
        }
    });
    Ping.i ++;
}

let possibleQuotesForLowLatency = 
[
    "Pong ! Is this some kind of game ? Did I win ?",
    "Pong ! Do I have to answer pong everytime to win the game ?",
    "Ping. Nyeheheh gotchu. ",
    "Is this an acronym or something ? "
];

let possibleQuotesForHighLatency = 
[
    "Next time I'll bring some food for the trip.",
    "Wow how long was I gone ?",
    "Phew, thought I'd never come back !",
    "Yeah you might want to upgrade your internet plan.",
    "Are you downloading...you know...human stuff ?"
];