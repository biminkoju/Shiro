const axios = require('axios');
const { MessageEmbed } = require('discord.js');
module.exports = {
    Name: 'cat',
    cat: ['info'],
    run: async (client, message, args) => {
        axios.get('https://api.thecatapi.com/v1/images/search')
            .then((response) => {
                const embed = new MessageEmbed()
                    .setColor('RANDOM')
                    .setImage(`${response.data[0].url}`);
                message.channel.send(embed)
            }).catch((err) => {
                return message.channel.send(err)
            })
    }
}