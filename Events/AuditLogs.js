const { MessageEmbed } = require('discord.js');

function CleanMessage(Content) {
    if (typeof Content === 'string') {
        Content = Content
            .replace(/`/g, `\`${String.fromCharCode(8203)}`)
            .replace(/@/g, `@${String.fromCharCode(8203)}`);
    }
    return Content;
}

const CurrentGuild = '777251087592718336';

module.exports = {
    Start: async (client) => {
        let Channel = client.channels.cache.get(`777262625314701372`);

        client.on('messageDelete', async message  => {
            if (message.guild.id != CurrentGuild) return;
            if (!message.guild || message.system) return;

            message.guild.fetchAuditLogs({ type: 'MESSAGE_DELETE' }).then(async FetchedAudit => {
                const logs = await FetchedAudit.entries.first();

                let Executor = logs.executor;
                let Author = message.author;

                const LogEmbed = new MessageEmbed()
                .setColor('RED')
                .setTitle(`Message Deleted`)
                .addFields(
                    { name: `Author`, value: `${Author.tag} | ${Author}`, inline: true },
                    { name: `Author ID`, value: Author.id, inline: true },
                    { name: `Channel`, value: message.channel, inline: true }
                );

                if (Date.now() - logs.createdTimestamp < 5000) LogEmbed.addField(`Executor`,`${Executor.tag} | ${Executor}`, true);

                LogEmbed.addField(`Message Content`, `\`\`\`${CleanMessage(message.content || JSON.stringify(message.attachments) )}\`\`\``);
                LogEmbed.setFooter(`Message ID: ${message.id}`);

                Channel.send(LogEmbed);
            });
        });

        // --

        client.on('messageUpdate', async (OldMessage, NewMessage)  => {
            if (OldMessage.guild.id != CurrentGuild) return;
            if (!OldMessage.guild || OldMessage.system) return;

            OldMessage.guild.fetchAuditLogs({ type: 'MESSAGE_EDIT' }).then(async FetchedAudit => {
                const logs = await FetchedAudit.entries.first();
                let Author = OldMessage.author;

                if (CleanMessage(OldMessage.content) == CleanMessage(NewMessage.content)) return;

                Channel.send(
                    new MessageEmbed()
                    .setColor('YELLOW')
                    .setTitle(`Message Edited`)
                    .addFields(
                        { name: `Author`, value: `${Author.tag} | ${Author}`, inline: true },
                        { name: `Author ID`, value: Author.id, inline: true },
                        { name: `Channel`, value: OldMessage.channel, inline: true },

                        { name: `Before`, value: `\`\`\`${CleanMessage(OldMessage.content)}\`\`\`` },
                        { name: `After`, value: `\`\`\`${CleanMessage(NewMessage.content)}\`\`\`` },
                    )
                    .setFooter(`Message ID: ${OldMessage.id}`)
                );
            });
        });
    }
};
