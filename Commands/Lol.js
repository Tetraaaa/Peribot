const _private = require("../_private");
const fetch = require("node-fetch");


module.exports =  function Lol(message, joueur)
{
    const possibleQuotes = 
    [
        "Okay, I'm calling Riot Games, hold on.",
        "I'm joining the Riot Games API, hold on a minute.",
        "Reaching the League of Legends API right now. Let's hope they answer for once.",
        "Gotchu, I'm connecting to the Riot Games API.",
        "Hello @Mark yetter, we'd like some information about a certain player.",
        "Why don't you ask me directly ? I'm sure I can answer your questions better than this crappy bot they have."
    ]; 

    if(!Lol.i) Lol.i = 0;

    message.channel.send(possibleQuotes[Lol.i%possibleQuotes.length]);
    message.channel.send("\`🔧 Connexion à l'API Riot Games...\`");

    let summonerName = encodeURI(joueur);
    let urlGetSummoner = `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${_private.riotToken}`;
    fetch(urlGetSummoner).then(response => {
        if(response.ok)
        {
            return response.json();
        }
        if(response.status === 404)
        {
            message.channel.send("\`⚠ Erreur : Joueur introuvable.\`");
        }
    })
    .then(json => {
        message.channel.send(`\`Analyse heuristique du joueur ${joueur} en cours...\``);
        let summonerId = json.id;
        let summonerLevel = json.summonerLevel;
        let urlGetCurrentGame = `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}?api_key=${_private.riotToken}`
        fetch(urlGetCurrentGame).then(response => {
            if(response.ok)
            {
                return response.json();
            }
        })
        .then(json => {
            if(json.length > 0)
            {
                let firstQueue = json[0];
                message.channel.send(generateRandomMessageFromTiers(firstQueue.tier, firstQueue.rank, firstQueue.wins, firstQueue.losses, summonerId, summonerLevel));
            }
            else
            {
                message.channel.send("\`Ce joueur n'est pas classé.\`");
            }
            message.channel.send("\`🔧 Fin de la connexion à l'API Riot Games.\`");
        })

    });
    
    Lol.i ++;
}

function generateRandomMessageFromTiers(tier, rank, wins, losses, summonerId, summonerLevel)
{
    let winrate = Math.round(wins*100/(wins+losses));
    let message = `Niveau ${summonerLevel} \nWins : ${wins}, Losses: ${losses}, Winrate : ${winrate}%.\n`;

    if(tier === "IRON")
    {
        message += "Elo Actuel : Fer ???? C'est quoi ce bordel enculé";
        if(rank === "IV")
        {
            message+= "\nFer IV : ce joueur suce comme peu de gens ont jamais sucé";
        }
    }
    else if(tier === "BRONZE")
    {
        message += "Elo Actuel : Bronze. Le joueur pue sa race la probabilité d'une différence de ligne est de 100%.";
    }
    else if(tier === "SILVER")
    {
        message += "Elo Actuel : Silver. Grosse probabilité de différence de matchup en sa défaveur car forte tendance à manger sa merde."
    }
    else if(tier === "GOLD")
    {
        message += "Elo Actuel : Gold. Elo probablement arrivé par hasard, grosse probabilité que ce joueur trébuche sur la lane et crée un différentiel de voie."
        if(rank === "III")
        {
            message+="\nAutant pour moi il est Gold 3 c'est scientifiquement impossible qu'il y soit arrivé par hasard."
        }
        if(rank === "II" || rank === "I")
        {
            message+="\nIl a malheureusement dépassé Gold 3 ce qui signifie qu'il est arrivé ici par hasard."
        }
    }
    else if(tier === "PLATINUM")
    {
        message += "Elo Actuel : Platine . Le joueur est un mec un peu bg, probabilité de différentiel de lane : 50%, probabilité de pécho de la gonz : 50%";
        if(rank === "IV")
        {
            message+="\nNéanmoins il est platine 4 donc sûrement stuck."
        }
    }
    else if(tier === "DIAMOND")
    {
        message += "Elo Actuel : Diamant. Le joueur devait certainement être un bg timide au collège. Il ne peut pas perdre, le différentiel de lane vient sûrement de ses mates";
        if(rank === "IV")
        {
            message+="\nAutant pour moi il est diamant 4 c'est donc un sous humain hardstuck rempli d'ego."
        }
        if(rank === "II")
        {
            message+='\nFait partie de "ces fils de pute de diamant deux".'
        }
        if(rank === "I")
        {
            message+='\nCe joueur devrait dormir la nuit et se forger un avenir au lieu de décevoir ses parents en jouant à lol.'
        }
    }
    else
    {
        message += "Elo Actuel : Master+. t'as aucune vie trouve un travail grosse victime";
    }

    if(wins * 0.5 > losses)
    {
        message+= "Winrate : " + winrate + "%, c'est sans doute un maudit schtroumpf farceur";
    }
    if(losses * 0.5 > wins)
    {
        message+= "Winrate : " + winrate + "%, a oublié de gagner des games c'est dommage";
    }

    if(summonerId === "bd9pDz6-0OBcx1M-Jk5WT8qXFCYzyXtndiSAZainofCNTWE")
    {
        //Tetra
        message+= "\nAttendez je le connais lui.";
    }
    if(summonerId === "eeHVvkNtvm3vsDEH64fI-c2gZ1DhIqycQ5Q7KyoquClDJ4I")
    {
        //Jules
        message+= "\nPourrait jouer mieux si il remplaçait son tapis de souris par un science et vie junior.";
    }
    if(summonerId === "IErlFCEj1s_fCSrD7HUEGIOkWMV7s1HpNf20_JLgOXrhZPg")
    {
        //Feunyx
        message+= "\nAime bien faire 18/0 et livrer les double buffs au midlaner adverse.";
    }
    if(summonerId === "E1iAnzGRHJLkb1G0HdDoMstYGccfSJC5LvghcocX7RUQz0s")
    {
        //Guikss
        message+= "\nAttention : Je détecte un grand fan de Tron.";
    }
    if(summonerId === "L4Q0SmpmKewHTbuhyfMhFgNQdOPu43Vt5pZqNq9aXwBjVvdx")
    {
        //linkenparis
        message+= "\nAnomalie surnuméraire détectée sur la 21ème paire.";
    }

    return "\`" + message + "\`";
    
}

