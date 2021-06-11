// Start Modules
require('dotenv/config');

const { Client, Collection, MessageEmbed, MessageAttachment, Intents, version } = require("discord.js");
const { FetchGuild } = require('./api/FireData');
const { print, GetDate, GetTime } = require('./api/functions');
const FireAdmin = require('firebase-admin');
const { readdirSync } = require("fs");


// Data
const IsNightly = true;
let bcnf = {bName:null,SA:null};


if (IsNightly) {
    bcnf.bName = "Nightly";
    bcnf.SA = require('./Data/Accounts/Nightly.json');
} else {
    bcnf.bName = "Production";
    bcnf.SA = null;
}

//! I refuse to use MongoDB, no questions - Senko
FireAdmin.initializeApp({credential:FireAdmin.credential.cert(bcnf.SA)});

const DataBase = FireAdmin.firestore();


// Create Client
const client = new Client({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_MEMBER', 'USER'],
    intents: Intents.ALL
});

client.Commands = new Collection();
client.Aliases = new Collection();

process.client = client;


// Functions

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
        Commands: client.Commands.size,
        Versions: `DJS: ${version} | NJS: ${process.version}`
    });
});

//? this really doesn't do anything, why do I have it? dunno - senko
process.on("unhandledRejection", error => {
    console.trace(`[ ERROR ]: ${error}`);
});


client.on("message", async message => {
    const GuildData = await FetchGuild(message.guild);
    var Prefix = await GuildData.prefix || "?";
    var args = message.content.slice(Prefix.length).trim().split(/ +/g);
    var CommandArg = message.content.toLowerCase().slice(Prefix.length).trim().split(/ +/g);
    var commandfile = client.Commands.get(CommandArg[0]) || client.Commands.get(client.Aliases.get(CommandArg[0]));

    if (message.mentions.users.first() === client.user && !args[1]){
        if (await selfPerm(message, 'EMBED_LINKS') != true) return;
        if (await selfPerm(message, 'ATTACH_FILES') != true) return;

        return message.reply(
            new MessageEmbed()
            .setTitle(`Hello ${message.author.username}`)
            .setDescription(`
                Your server prefix is "${Prefix}".
                Use "${Prefix}help" to view all the available commands!

                *If you can't use commands in a certain channel, use "${Prefix}channels" to view what channels your server admin has whitelisted.*

                [Invite Me!](https://senkosworld.com.invite) | [Join the Community!](https://discord.com/invite/senko)
            `)
            .setColor("ORANGE")
            .attachFiles(new MessageAttachment('images/senko/senko_hat_tip.png', 'info-san.png'))
            .setThumbnail('attachment://info-san.png')
        );
    }

    if (message.author.bot || !message.guild || message.system || !message.content.startsWith(Prefix)) return;


    let { READ_MESSAGE_HISTORY, EMBED_LINKS, ATTACH_FILES, USE_EXTERNAL_EMOJIS, ADD_REACTIONS, MANAGE_MESSAGES } = {
        READ_MESSAGE_HISTORY: await selfPerm(message, 'READ_MESSAGE_HISTORY'),
        EMBED_LINKS: await selfPerm(message, 'EMBED_LINKS'),
        ATTACH_FILES: await selfPerm(message, 'ATTACH_FILES'),
        USE_EXTERNAL_EMOJIS: await selfPerm(message, 'USE_EXTERNAL_EMOJIS'),
        ADD_REACTIONS: await selfPerm(message, 'ADD_REACTIONS'),
        MANAGE_MESSAGES: await selfPerm(message, 'MANAGE_MESSAGES')
    };



    // messy imo - Senko
    let Str = `It appears I do not have the correct permissions to perform my commands!\n\nPlease make sure I have the following:\n\n`;

    if (!READ_MESSAGE_HISTORY) Str += `**Read Message History**\n`;
    if (!EMBED_LINKS) Str += `**Embed Links**\n`;
    if (!ATTACH_FILES) Str += `**Attach Files**\n`;
    if (!USE_EXTERNAL_EMOJIS) Str += `**Use External Emojis**\n`;
    if (!ADD_REACTIONS) Str += `**Add Reactions**\n`;
    if (!MANAGE_MESSAGES) Str += `**Manage Messages**\n`;

    if (READ_MESSAGE_HISTORY != true || EMBED_LINKS != true || ATTACH_FILES != true || USE_EXTERNAL_EMOJIS != true || ADD_REACTIONS != true || MANAGE_MESSAGES != true) return message.channel.send(Str);

    if (WhitelistedCommands.includes(CommandArg[0]) ) return commandfile.run(client, message, args);


    if (message.author.id == '609097445825052701') {
        if (!commandfile || commandfile.disabled && commandfile.disabled == true) return;
        return commandfile.run(client, message, args);
    }

    if (GuildData.Channels && !GuildData.Channels.includes(message.channel.id)) return print("Blacklisted Channel (Set by Guild Admin)");
    if (!commandfile || commandfile.disabled && commandfile.disabled == true) return;

    commandfile.run(client, message, args);
});

//? yes yes I know I don't need it in a function, but I have other uses for it - Senko
function client_login() {
    if (IsNightly) return client.login(process.env.NIGHTLY_TOKEN);

    client.login(process.env.TOKEN);
}

client_login();