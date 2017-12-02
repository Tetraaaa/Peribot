const Discord = require("discord.js");
const peribot = new Discord.Client();

peribot.on('ready', function()
{
  console.log("Connecté ! ");  
});

peribot.on("message", message => 
{
    if(message.content === "pingz")
    {
        message.reply("pongz");
    }
})

peribot.login("TOKEN");