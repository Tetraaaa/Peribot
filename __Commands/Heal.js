module.exports =  function Heal(message)
{
    const possibleQuotes = 
    [
        "It's dangerous to go alone, take this."
    ]; 

    const possibleErrQuotes = 
    [
        "Hey, I can't find you anywhere !",
        "But where are you ?",
        "I can't see you from where I am !",
        "Who ? Where ?"
    ]; 

    let voiceChannel = message.member.voice.channel;

    if(!Heal.i) Heal.i = 0;

    voiceChannel.join().then(connection => {
        connection.play("Audio/heal.mp3").on("finish", () => {
            connection.disconnect();
            message.channel.send("❤❤❤❤❤❤❤❤❤❤");
        });
    })
    .catch(error => {
        message.channel.send(possibleErrQuotes[Heal.i%possibleErrQuotes.length]);
    });

    message.channel.send(possibleQuotes[Heal.i%possibleQuotes.length]);
    
    Heal.i ++;
}

