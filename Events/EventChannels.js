module.exports = {
	Start: async (client) => {
		client.on('message', async message => {

			switch (message.channel.id) {
			case '858561898956718101': {
				let vowel = ['a', 'e', 'i', 'o', 'u'];

				for (let val of vowel) {
					if (message.content.toLowerCase.match(val)) message.delete();
				}
				break;
			}
			}
		});
	},
};
