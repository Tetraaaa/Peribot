//Imports
const {Client, GatewayIntentBits, Events} = require("discord.js");
const commands = require("./commands");
const _private = require("./_private");

//Nouvelle instance du bot
const peribot = new Client({
    intents: [
        GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates
    ]
    
});
//Nombre de phrases prononcées par le bot depuis son lancement
var i;
//Confidentiel : Token privé du bot
peribot.login(_private.token);

//Fonction appelée une fois que le bot est correctement initialisé
peribot.on("ready", function()
{
    console.log("Peribot démarré, bip boup");
    peribot.user.setStatus("C L O D S. E X E");
    i = 0;

});
//Fonction appelée lors d'un message dans le chat
peribot.on(Events.MessageCreate, function(message)
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
    let text = message.content.substring(1);
    let parsedCommand = "";

    let currentlyInString = false;
    [...text].forEach(character => {
        if(character === " ")
        {
            if(currentlyInString)
            {
                parsedCommand = parsedCommand+=character;
            }
            else
            {
                parsedCommand = parsedCommand += "[argumentSeparator]";
            }
        }
        else if(character === '"')
        {
            currentlyInString = !currentlyInString;
        }
        else
        {
            parsedCommand = parsedCommand+=character;
        }
    })

    let args = parsedCommand.split("[argumentSeparator]");
    let command = args[0];
    args.shift();
    
    if(typeof commands[command] === "function")
    {
        commands[command](message, ...args)
    }
    else
    {
        commands.unknown(message);
    }
}
