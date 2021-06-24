// Very helpful functions

async function selfPerm(message, Permission) {
    if (message.guild.me.hasPermission(Permission)) return true;

    return false;
}

async function checkPerm(message, Permission) {
    if (message.guild.members.cache.get(message.author.id).hasPermission(Permission)) return true;
    return false;
}


module.exports = { selfPerm, checkPerm };