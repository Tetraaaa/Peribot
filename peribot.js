//Imports
const Discord = require("discord.js");
const commands = require("./commands");
const YoutubeStream = require("ytdl-core");

//Nouvelle instance du bot
const peribot = new Discord.Client();
//Nombre de phrases prononcées par le bot depuis son lancement
var i;
//Confidentiel : Token privé du bot
peribot.login("Mzg2NjE2MTgyOTgxMTMyMzA5.DQSjdA.zX5MbzCL0ToZN06v9Fei9MHisWg");

//Fonction appelée une fois que le bot est correctement initialisé
peribot.on("ready", function()
{
    console.log("Peribot démarré, bip boup");
    peribot.user.setGame("C L O D S. E X E");
    i = 0;

});
//Fonction appelée lors d'un message dans le chat
peribot.on("message", function(message)
{
    match(message);
});


//Prend un message en paramètre et vérifie si il est adressé à Peribot, si oui, appelle execute
function match(message)
{
    if(message.content.startsWith('$')) execute(message);
}
//Prend un message destiné à Peribot en paramètre et effectue la commande correspondante
function execute(message)
{
    if(message.content.startsWith("$play"))
    {
        i = commands.play(message, i, YoutubeStream);
        i++;
    }
    else
    {
        switch (message.content) 
        {
            case "$ping":
                i = commands.ping(peribot, message, i);
                break;
            case "$help":
                i = commands.help(message, i);
                break;
            case "$ghelp":
                i = commands.ghelp(message, i);
                break;
            case "$hi":
                i = commands.hi(message, i);
                break;
            case "$stop":
                i = commands.stop(message, i, peribot);
                break;
            default:
                i = commands.unknown(message, i);
                break;
        }
        i++;
    }
}
