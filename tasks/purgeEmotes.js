const config = require('../config/config.json');

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

module.exports = async function (client) {
    let guilds = Object.values(config.emoteGuilds);
    let guildObjects = client.guilds.filter(g => guilds.includes(g.id));
    for (const guild of guildObjects.values()) {
        for (const emote of guild.emojis.keys()) {
            try {
                console.log(`Deleting ${emote} from ${guild}`);
                await guild.deleteEmoji(emote);
                // await sleep(1000);
                // guild.deleteEmoji(emote).catch(e => console.error(`Couldn't delete emote ${emote} from ${guild} : ${e}`));
            } catch (e) {
                console.error(`Error deleting emoji ${emote} from ${guild} : ${e}`);
            }
        }
    }
};
