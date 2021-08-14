module.exports = {
	Name: 'avatar',
	Aliases:['av'],
	description: 'View user\'s avatar',
	Usage: 'avatar [optional userid]',
	cat: ['commands', 'cmds'],

	run: async (client, message, args) => {
		let user = message.mentions.members.first() || client.users.cache.get(args[1]) || message.author;

		if (user.user) user = user.user;

		message.channel.send({
			embed: {
				title: `${user.username}'s Avatar`,
				color: 'RANDOM',

				image: {
					url: `${user.user.displayAvatarURL({ dynamic: true })}?size=4096`,
				},
			},
		});
	},
};