module.exports =  function NotFound(message)
{
    const possibleQuotes = 
    [
        "Did you call me ? Oh nevermind, you didn't, it's okay I'll just stay here, behind, riight here.", 
        "Am I supposed to do something with that piece of information",
        "You know you are supposed to put something MEANINGFUL after the $ right ?",
        "No, I'm not doing that.", 
        "This doesn't make any sense, much like your puny existence on this planet.",
        "It's okay, we all make mistakes sometimes, you in particular.", 
        "Again, feel free to type $help so I can actually be useful",
        "I can't do that, why don't you " + message.cleanContent + " yourself ?",
        "What, why did you call me ? I can't do anything with that.",
        "Log date 7 15 19 : The human is starting to say weird things.",
        "I'm sure there are plenty of other bots out there who would love to have their time wasted by you."
    ];

    if(!NotFound.i) NotFound.i = 0;

    message.channel.send(possibleQuotes[NotFound.i%possibleQuotes.length]);

    NotFound.i ++;
}



