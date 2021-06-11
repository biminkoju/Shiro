module.exports = {
    Start: async (client) => {
        var StatusStrings = [
            { "NAME": `/r/SenkosWorld`, "TYPE": "WATCHING" },
            { "NAME": `discord.gg/senko`, "TYPE": "WATCHING" },
        ];

        setInterval(() => {
            let ChosenStatus = StatusStrings[Math.floor(Math.random() * StatusStrings.length)];
            client.user.setPresence({ activity: { name: ChosenStatus.NAME }, status: ChosenStatus.STATUS });
        }, 180 * 1000);

        let ChosenStatus1 = StatusStrings[Math.floor(Math.random() * StatusStrings.length)];
        client.user.setPresence({ activity: { name: ChosenStatus1.NAME }, status: ChosenStatus1.STATUS });
    }
};
