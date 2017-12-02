module.exports = class commands
{
    static ping(peribot, message)
    {
        message.channel.send("pong ! " + peribot.ping + " ms !");
    }
    static help(message)
    {
        message.author.send
        (
            "```\n" 
            + "$ping : Gets the current latency between the server and Peribot, in milliseconds\n"
            + "$help : Sends you a private message with this list of commands you are reading right now, why are you even asking\n"
            + "\n```"
        );
        message.channel.send("No one can help you here. but i just sent you a useful list of commands, check your dms !");
    }
    static unknown(message)
    {
        message.channel.send("what, why did you call me ? I can't do anything with that.");
    }
}