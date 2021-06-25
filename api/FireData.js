const { print } = require('./functions');
const admin = require('firebase-admin');
const DataBase = admin.firestore();


/**
 * @param FetchData Fetch a user profile.
 * @argument `user` - Must be the user, not an ID
 * @returns UserData
*/
async function FetchData(user) {
    let Fetched = user;

    const UserData = await DataBase.collection('Users').doc(Fetched.id).get();

    if (!UserData.exists) await CreateUser(Fetched);

    return UserData.data();
}

/**
 * @param CreateUser Fetch user data from a profile
 * @argument `user` - Must be the user, not an ID
 * @returns UserData
*/
async function CreateUser({ id, tag }) {
    DataBase.collection('Users').doc(id).set({
        LocalUser: {
            user: tag,
            userID: id
        },

        Currency: {
            Yen: 0,
            Tofu: 0
        }
    });
}


async function UpdateData(User, Data, type) {
    let Fetched = User;

    await FetchData(Fetched);

    if (type === 1) {
        await DataBase.collection('Users').doc(Fetched.id).update(Data);
    } else {
        await DataBase.collection('Users').doc(Fetched.id).set(Data, { merge: true });
    }

    return true;
}


async function UpdateGuild(Guild, NewData, type) {
    await FetchGuild(Guild);

    if (type === 1) {
        await DataBase.collection('Guilds').doc(Guild.id).update(NewData);
    } else {
        await DataBase.collection('Guilds').doc(Guild.id).set(NewData, { merge: true });
    }

    return true;
}

async function CreateGuild(GUILD_) {
    DataBase.collection('Guilds').doc(GUILD_.id).set({
        OwnerID: GUILD_.ownerID,
        GID: GUILD_.id,
        Members: GUILD_.memberCount,
        prefix: '?'
    }).catch(error => {
        console.error(error);

        return false;
    });

    return true;
}

/**
 * @param FetchGuild Guild - NOT ID
 */
async function FetchGuild(Guild) {
    if (!Guild) return print(`No Guild Given!`);

    const GuildData = DataBase.collection('Guilds').doc(Guild.id).get();

    if (GuildData.exists) return GuildData.data();

    let FreshData = await CreateGuild(Guild);

    return FreshData;
}

module.exports = { CreateUser, FetchData, UpdateData, UpdateGuild, CreateGuild, FetchGuild };