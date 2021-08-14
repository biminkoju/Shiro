const { MessageEmbed } = require('discord.js');
const Pagination = require('discord-paginationembed');
const { readdirSync } = require('fs');
const { channelerror } = require('../../api/FireData');
const { selfPerm } = require('../../api/Permissions');

module.exports = {
	Name: 'help',
	description: 'View a list of available commands',
	Usage: 'help [optional command]',
	cat: ['commands', 'cmds'],

	run: async (client, message, args) => {
		const prefix = 's?';

		if (await selfPerm(message, 'MANAGE_MESSAGES') != true) {
			return channelerror({
				channel: message.channel,
				description: 'Please make sure I am able to Manage Messages, It will allow me to Paginate the command\'s!',
				message: message,
			});
		}

		if (args[1]) {
			readdirSync('./Commands/').forEach(dir => {
				const Found = readdirSync(`./Commands/${dir}/`).filter(file => file.endsWith('.js'));

				for (let file of Found) {
					const pull = require(`../${dir}/${file}`);

					if (pull.Name === args[1].toLowerCase()) {
						message.channel.send(
							new MessageEmbed()
								.setTitle(pull.Name)
								.setDescription(`
                                ${pull.description || 'No description Given.'}

                                > Aliases: ${pull.aliases || 'None'}
                                > Categories: ${pull.cat.toString().replace(',', ', ') || 'None'}

                                Usage: ${prefix}${pull.Usage || pull.Name}
                                Hidden: \`${pull.hidden || 'false'}\`
                                Disabled: \`${pull.disabled || 'false'}\`
                            `)
								.setColor('GREEN'),
						);
					}
				}
			});

			return;
		}

		const CmdArray = [];

		readdirSync('./Commands/').forEach(dir => {
			const Found = readdirSync(`./Commands/${dir}/`).filter(file => file.endsWith('.js'));

			for (let file of Found) {
				const pull = require(`../${dir}/${file}`);

				if (!pull.disabled && !pull.hidden) {
					CmdArray.push({ word: `> ${pull.Name}
                        ${pull.description || 'No description Given.'}

                        > Aliases: ${pull.aliases || 'None'}
                        > Categories: ${pull.cat || 'None'}
                        Usage: ${prefix}${pull.Usage || pull.Name}
                    ` });
				}
			}
		});


		let FEmbed = new Pagination.FieldsEmbed()
			.setArray(CmdArray)
			.setAuthorizedUsers([message.author.id])
			.setChannel(message.channel)
			.setElementsPerPage(4)
			.setPageIndicator(true)
			.formatField('Hope you find everything', el => el.word);

		FEmbed.embed.setColor('BLUE')
			.setDescription(`
            Here is a list of the commands I have!
            Use \`${prefix}help [command]\` to view additional info about a certain command!
        `);

		FEmbed.build();
	},
};
