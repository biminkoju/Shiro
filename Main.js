require('dotenv/config');
const { Client, Collection, Intents } = require("discord.js");
const { print, GetDate, GetTime } = require('./api/functions');
const { selfPerm } = require('./api/Permissions');
const FireAdmin = require('firebase-admin');
const { readdirSync } = require("fs");


// Data
const IsNightly = false;
let bcnf = {bName:null,SA:null};


if (IsNightly) {
    bcnf.bName = "Nightly";
    bcnf.SA = require('./Data/Accounts/Nightly.json');
} else {
    bcnf.bName = "Production";
    bcnf.SA = require('./Data/Accounts/Nightly.json');
}

//! I refuse to use MongoDB, no questions - Senko
FireAdmin.initializeApp({ credential:FireAdmin.credential.cert(bcnf.SA) });

const DataBase = FireAdmin.firestore();

// Create Client
const client = new Client({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'],
    intents: Intents.ALL
});

client.Commands = new Collection();
client.Aliases = new Collection();


client.on('ready', () => {
    readdirSync('./Events/').forEach(Event => {
        const pull = require(`./Events/${Event}`);
        if (pull.disabled == true) return;

        pull.Start(client, DataBase);
    });


    readdirSync('./Commands/').forEach(Folder => {
        const commands = readdirSync(`./Commands/${Folder}/`).filter(file => file.endsWith('.js'));

        for (let file of commands) {
            let pull = require(`./Commands/${Folder}/${file}`);

            client.Commands.set(pull.Name, pull);

            if (pull.aliases) {
                for (var _ of alias) {
                    client.Aliases.set(alias, pull.Name);
                }
            }
        }
    });

    console.table({
        Date: `${GetDate()} - ${GetTime()}`,
        Build: bcnf.bName,
        Members: client.users.cache.size,
        Guilds: client.guilds.cache.size,
        Commands: client.Commands.size
    });
});


process.on("unhandledRejection", error => {
    console.log(error);
});


client.on("message", async message => {
    var Prefix = "s?";
    var args = message.content.slice(Prefix.length).trim().split(/ +/g);
    var CommandArg = message.content.toLowerCase().slice(Prefix.length).trim().split(/ +/g);
    var commandfile = client.Commands.get(CommandArg[0]) || client.Commands.get(client.Aliases.get(CommandArg[0]));

    if (message.author.bot || !message.guild || message.system || !message.content.startsWith(Prefix) || !commandfile || commandfile.disabled) return;

    commandfile.run(client, message, args);
});


if (IsNightly) {
    return client.login(process.env.NIGHTLY_TOKEN);
} else {
    client.login(process.env.TOKEN);
}