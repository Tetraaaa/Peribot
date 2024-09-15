module.exports =  function Hi(message)
{
    const possibleQuotes = 
    [
        "Hey hi " + message.author.username +" !",
        "Hello there " + message.author.username + " !",
        "Hello, you silly human.", 
        "Yeah yeah, hello",
        "Hi " + message.author.username + ", how are you today ? No, I'm just asking because I have to, don't bother answering.",
        "Hello " + message.author.username + ", nyeheheh."
    ]; 

    if(!Hi.i) Hi.i = 0;

    message.channel.send(possibleQuotes[Hi.i%possibleQuotes.length]);

    Hi.i ++;
}

