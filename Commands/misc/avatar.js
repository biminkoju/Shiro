const { MessageEmbed } = require("discord.js")

module.exports={
    Name: "avatar",
    Aliases:['av'],
    description: "View user's avatar",
    Usage: "avatar [optional userid]",
    cat: ['commands', 'cmds'],
    run: async (client, message, args) => {
        let user = message.mentions.members.first()
    
        if (args[0]) {
            message.channel.send({
                embed: {
    
                    title: `${user.user.username}'s Avatar`,
    
                    color: 'RANDOM',
    
                    image: {
                        url: `${user.user.displayAvatarURL({ dynamic: true })}` + '?size=4096'
                    },
    
                    timestamp: new Date(),
    
                    footer: {
                        text: message.guild.name,
                        icon_url: message.guild.iconURL()
                    }
                }
            })
        }
        else if (!args[0]) {
            message.channel.send({
                embed: {
    
                    title: `${user.user.username}'s Avatar`,
    
                    color: 'RANDOM',
    
                    image: {
                        url: `${user.user.displayAvatarURL({ dynamic: true })}` + '?size=4096'
                    },
    
                    timestamp: new Date(),
    
                    footer: {
                        text: message.guild.name,
                        icon_url: message.guild.iconURL()
                    }
    
                }
            })
        }
    }
}