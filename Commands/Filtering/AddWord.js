const admin = require('firebase-admin');
const DataBase = admin.firestore();
const config = require('../../Data/config');

module.exports = {
    Name: 'block',
    description: `Block a word from being sent.`,
    cat: ['filter', 'moderation'],

    run: async (client, message, args) => {
        if (!message.member.roles.cache.has(config.manager)) return message.reply(`You cannot do this!`);
        if (!args[1]) return message.reply(`Please give me a word to be blocked.`);
        const Word = args[1].toLowerCase();

        message.delete();

        const RawData = await DataBase.collection('config').doc(`filter`).get();
        const Data = RawData.data();

        if (Data.blocked_words.includes(Word)) return message.reply(`This word is already blocked!`);

        Data.blocked_words.push(Word);

        await DataBase.collection('config').doc('filter').update({
            blocked_words: Data.blocked_words
        });

        message.channel.send(`Word has been added to the block list!\n\n${new Date().toISOString()}`)
            .then(msg => {
                msg.delete({ timeout: 5000 });
            }).catch();
    }
};