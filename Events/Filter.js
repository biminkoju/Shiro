const { strike } = require('../api/Moderation');
const { MessageEmbed } = require('discord.js');
const { print } = require('../api/functions');
const config = require('../Data/config');
const admin = require('firebase-admin');
//const leet = require('l33tsp34k');
const DataBase = admin.firestore();

function CleanMessage(Content) {
    if (typeof Content === 'string') {
        Content = Content
            .replace(/`/g, `\`${String.fromCharCode(8203)}`)
            .replace(/@/g, `@${String.fromCharCode(8203)}`);
    }
    return Content;
}

let Characters = ['\'','"','\\','/','!','~','`','_','-','|','{','}','[',']',';',':','>','<',',','.','=','+'];

function strip(Content) {
    if (typeof Content === 'string') {
        for (var char of Characters) {
            Content = Content.replaceAll(char, ``);
        }
    }
    return Content;
}


module.exports ={
    Start: async (client) => {
        let RawData = await DataBase.collection('config').doc('filter').get();
        let Data = RawData.data();

        async function filter(message) {
            if (message.author.bot || !message.guild || message.system) return;

            if (message.member.roles.cache.has(config.bypass)) return;
            let Message = strip(message.content.toLowerCase().replaceAll(' ', ''));
            //let JoinedMessage = Message.replaceAll(' ', '');

            // Blocked Words
            for (var word of Data.blocked_words) {
                let Matched = Message.match(new RegExp(word));
                if (Matched) {

                    if (Data.allowed_words.includes(Message)) return print(`Word Included`);

                    message.delete();

                    //let Striked = await strike(message.author);

                    message.channel.send(message.author, new MessageEmbed({
                        title: `Please don't do that!`,
                        description: `We try to keep the server clean and it would be nice if you didn't send stuff like that. Thanks!`,//\n\nYou now have ${Striked} strikes.`,
                        color: `RED`
                    })).then(m=>{m.delete({timeout:5000});});

                    return client.channels.cache.get(config.logs).send({
                        embed: {
                            title: `Message Removed`,

                            description: `
                                Author: ${message.author}
                                Author ID: ${message.author.id}

                                Channel: ${message.channel}
                                Message ID: ${message.id}

                                Original Message: \`\`\`${CleanMessage(message.content)}\`\`\`
                                String: \`\`\`${CleanMessage(Message)}\`\`\`
                                Matched Word: \`\`\`${CleanMessage(word)}\`\`\`
                            `,
                            color: `RED`
                        }
                    });
                }
            }

            // Banned Words

            for (var _word of Data.banned_words) {
                let Matched = Message.match(new RegExp(_word));

                if (Matched) {
                    message.delete();

                    client.channels.cache.get(config.logs).send({
                        embed: {
                            title: `Member Banned`,

                            description: `
                                Member: ${message.author}
                                Member ID: ${message.author.id}

                                Channel: ${message.channel}
                                Message ID: ${message.id}

                                Original Message: \`\`\`${CleanMessage(message.content)}\`\`\`
                                String: \`\`\`${CleanMessage(Message)}\`\`\`
                                Matched Word: \`\`\`${CleanMessage(_word)}\`\`\`
                            `,
                            color: `RED`
                        }
                    });

                    await message.author.send(
                        new MessageEmbed()
                        .setTitle(`You have been banned from ${message.guild.name}!`)
                        .setDescription(`
                            Banned by: AutoMod
                            Reason: Forbidden Text. You will not get an unban.

                            If this is a false flag then please [join here and create a ticket](https://discord.gg/G6GyR2zA)
                        `)
                        .setColor("RED")
                    ).catch();

                    return message.member.ban({ days: 1, reason: `Banned by: AutoMod\nReason: Forbidden Text` }).catch();
                }
            }
        }


        client.on('message', async (message) => {
            filter(message);
        });

        client.on('messageUpdate', async (_OldMessage, NewMessage)  => {
            filter(NewMessage);
        });
    }
};