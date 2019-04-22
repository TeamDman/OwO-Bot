const config = require('../config/config.json');
const emotes = Array.from(require('../resources/emotes.json'));
const glob = require('glob');
const regexName = /dump\/dump\/(\w+)/;
const regexFile = /dump\/dump\/(.*)/;

module.exports = async function (client) {
    console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n');
    let guilds = Object.values(config.emoteGuilds);
    let guildObjects = client.guilds.filter(g => guilds.includes(g.id));
    const upload = async (files, animated) => {
        const getGuild = (index) => guildObjects.get(guilds[index]);
        const getSlots = (guild) => (50 - guild.emojis.filter(e => e.animated == animated).size);

        files.forEach(async file => {
                // for (const file of files) {
                try {
                    let filename = regexFile.exec(file)[1];
                    if (emotes.some(e => e.filename == filename)) return;

                    let guildIndex = 0;
                    let name = regexName.exec(file)[1];
                    let guild = getGuild(guildIndex);
                    while (getSlots(guild) == 0) {
                        guild = getGuild(guildIndex++);
                        if (guildIndex >= guilds.length) {
                            guildIndex = 0;
                            console.error(`ERROR: RAN OUT OF GUILDS!? ${animated} for ${filename}`);
                            return;
                        }
                    }
                    try {
                        let emote = await guild.createEmoji(file, name);
                        // let emote = {id: 0};
                        console.log(`{"guild":"${guild.name}", "guildid":"${guild.id}", "emoteid":"${emote.id}", "filename":"${filename}", "name":"${name}"},`);
                    } catch (e) {
                        console.error(`Error adding emoji ${name} to ${guild.name} with guild id ${guild.id}, file ${filename}: ${e}`);
                    }
                } catch (e) {
                    console.error(`Big ol error ${e}`);
                }
            }
        );
    };

    glob('D:/User/Pictures/anime/reacts/dump/dump/*.gif', function (error, files) {
        if (error) return console.error(error);
        upload(files, true);
    });

    glob('D:/User/Pictures/anime/reacts/dump/dump/*.png', function (error, files) {
        if (error) return console.error(error);
        upload(files, false);
    });
};
