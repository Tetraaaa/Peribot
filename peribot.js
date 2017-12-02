const Discord = require("discord.js");
const commands = require("./commands");
const peribot = new Discord.Client();

//Confidentiel : Token privé du bot
peribot.login("Mzg2NjE2MTgyOTgxMTMyMzA5.DQSjdA.zX5MbzCL0ToZN06v9Fei9MHisWg");

//Fonction appelée quand le bot est correctement initialisé
peribot.on("ready", function()
{
    console.log("Peribot démarré, bip boup");
    peribot.user.setGame("java.lang.NullPointerException");

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
    if(message.content === "$ping")
    {
        commands.ping(peribot, message);
    }
    else if(message.content === "$help")
    {
        commands.help(message);
    }
    else
    {
        commands.unknown(message);
    }
}
