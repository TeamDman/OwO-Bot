'use strict';
const discord = require('discord.js');
const utils = {};
let client = null;

module.exports = utils;

utils.init = cl => {
    client = cl;
};

utils.getRole = identifier => {
    if (typeof identifier === 'string') {
        if ((identifier = identifier.replace(/\s+/g, '_').toLowerCase()).match(/\d+/g)) {
            identifier = identifier.match(/\d+/g);
        }
    }
    for (let guild of client.guilds.values()) {
        for (let role of guild.roles.values()) {
            if (role.id == identifier || role.name.replace(/\s+/g, '_').toLowerCase() == identifier) {
                return role;
            }
        }
    }
    return null;
};

utils.getChannel = identifier => {
    if (typeof identifier === 'string') {
        if (identifier.match(/\d+/g)) {
            identifier = identifier.match(/\d+/g);
        }
    }
    for (let guild of client.guilds.values()) {
        for (let channel of guild.channels.values()) {
            if (channel.id == identifier || channel.name == identifier) {
                return channel;
            }
        }
    }
    return null;
};

utils.getUser = (guild, identifier) => {
    if (typeof identifier === 'string') {
        if ((identifier = identifier.replace(/\s+/g, '_').toLowerCase()).match(/\d+/g)) {
            identifier = identifier.match(/\d+/g);
        }
    }
    for (let member of guild.members.values()) {
        if (member.id == identifier || member.user.username.replace(/\s+/g, '_').toLowerCase() == identifier) {
            return member;
        }
    }
    return null;
};

utils.createPaginator = async (sourceMessage, message, next, prev) => {
    const emojinext = '▶';
    const emojiprev = '◀';
    const emojistop = '❌';
    try {
        await message.react(emojiprev);
        await message.react(emojinext);
        // await message.react(emojistop);
        let handle = (reaction, user) => {
            if (reaction.message.id !== message.id) {
                return;
            }
            if (user.id !== sourceMessage.author.id ||
                reaction.emoji.name !== emojinext &&
                reaction.emoji.name !== emojiprev &&
                reaction.emoji.name !== emojistop) {
                return;
            }
            switch (reaction.emoji.name) {
                case emojinext:
                    next();
                    break;
                case emojiprev:
                    prev();
                    break;
                case emojistop:
                    message.delete().catch(e => console.log(e));
                    sourceMessage.delete().catch(e => console.log(e));
                    break;
                default:
                    console.log('Something went processing emoji reactions.');
                    break;
            }
        };
        client.on('messageReactionAdd', handle);
        client.on('messageReactionRemove', handle);
    } catch (error) {
        console.log('Error involving reaction collector.');
    }
};

utils.task = task => {
    delete require.cache[require.resolve(`./tasks/${task}`)];
    require(`./tasks/${task}`)(client);
};
