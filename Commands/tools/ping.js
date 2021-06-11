const { MessageEmbed } = require('discord.js');

module.exports = {
    Name: "ping",
    cat: ['info'],

    run: async(client, message, args) => {
        const PingEmbed = new MessageEmbed()
        .setDescription(`Pinging...`)
        .setColor('#ff8e2a');

        message.channel.send(PingEmbed).then(msg => {
            PingEmbed.setTitle(`Pong!`);
            PingEmbed.setDescription(`
                Client \`${Math.round(Date.now() - message.createdTimestamp)}ms\`
                Server \`${Math.round(client.ws.ping)}ms\`
            `);

            msg.edit(PingEmbed);
        });
    },
};
