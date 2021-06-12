const MessageEmbed = require('discord.js')
const axios = require('axios')
module.exports = {
    name: 'cat',
    run: (message) => {
        axios.get('https://api.thecatapi.com/v1/images/search').then((response) => { const embed = new MessageEmbed().setColor('RANDOM').setImage(`${response.data[0].url}`); message.channel.send(embed) }).catch((err)=>{ return message.channel.send(err) })
    }
}