const { print } = require('./functions');
const admin = require('firebase-admin');
const DataBase = admin.firestore();


/** @param FetchData Fetch data for a user @argument `user` */
/**
 * @param CreateUser Fetch user data from a profile
 * @argument `user`
 * @example
 * const { FetchData } = require('../../api/DataService');
 *
 * let FetchedUser = message.mentions.users.first() || client.users.cache.get(args[1]) || message.author;
 * const UserStats = await FetchData(FetchedUser);
 *
 * @returns JSON User Data
*/
async function FetchData(user) {
    let Fetched = user;
    if (Fetched.user) Fetched = user.user;

    const UD = DataBase.collection('Users').doc(Fetched.id);
    let UserData = await UD.get();

    if (!UserData.exists) CreateUser(Fetched);

    while (!UserData.exists) {
        UserData = await UD.get();
    }

    const UserStats = UserData.data();
    return UserStats;
}

async function CreateUser({ id, tag }) {
    DataBase.collection('Users').doc(id).set({
        LocalUser: {
            user: tag,
            userID: id,
            Banner: "DefaultBanner.png"
        },

        Stats: {
            Fluffs: 0,
            Pats: 0,
            Steps: 0,
            Hugs: 0,
            Sleeps: 0,
            Drinks: 0,
            Smiles: 0
        },

        Currency: {
            Yen: 0,
            Tofu: 0
        },

        RateLimits: {
            Fluff_Rate: 0,
            Pat_Rate: 0,
            Step_Rate: 0,
            Hug_Rate: 0,
            Drink_Rate: 0,
            Sleep_Rate: 0,
            Smile_Rate: 0
        },

        Inventory: [],
        Achievements: [],
        Rewards: {
            Daily: false,
            Weekly: false
        }
    });
}

async function UpdateData(User, Data) {
    let Fetched = User;
    if (Fetched.user) Fetched = user.user;
    await FetchData(Fetched);
    await DataBase.collection('Users').doc(Fetched.id).set(Data, { merge: true });
    return true;
}


async function UpdateGuild(Guild, NewData) {
    await FetchGuild(Guild);
    await DataBase.collection('Guilds').doc(Guild.id).set(NewData, { merge: true });
    return true;
}

async function CreateGuild(GUILD_) {
    print(`New guild`);

    DataBase.collection('Guilds').doc(GUILD_.id).set({
        OwnerID: GUILD_.ownerID,
        GID: GUILD_.id,
        Members: GUILD_.memberCount,
        prefix: '?'
    }).then(
        print(`Created Guild!`)
    ).catch( e =>{
        print(`[ GUILD ERROR ]: ${e}`);
    });

    return;
}

/**
 * @param FetchGuild Guild (NOT ID)
 */
async function FetchGuild(Guild) {
    if (!Guild) return print(`No Guild Given!`);

    const GD = DataBase.collection('Guilds').doc(Guild.id);
    let GuildData = await GD.get();

    if (GuildData.exists) return GuildData.data();
    await CreateGuild(Guild);

    while (!GuildData.exists) {
        GuildData = await GD.get();
    }

    return GuildData.data();
}

module.exports = { CreateUser, FetchData, UpdateData, UpdateGuild, CreateGuild, FetchGuild };