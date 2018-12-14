const config = require('../config/config.json');
const dupes = Array.from(require('../resources/purge.json'));
const emotes = Array.from(require('../resources/emotes.json'));

module.exports = async function (client) {
  let guilds = Object.values(config.emoteGuilds);
  let guildObjects = client.guilds.filter(g => guilds.includes(g.id));
  try {
    for (const emote of emotes) {
      if (dupes.includes(emote.filename)) {
        console.log(`removing ${emote.filename} with id ${emote.emoteid}`);
        await client.guilds.get(emote.guildid).deleteEmoji(emote.emoteid);
      }
    }
  } catch (e) {
    console.error(e);
  }
  // for (const guild of guildObjects.values()) {
  //   for (const emote of guild.emojis.keys()) {
  //     if (emotes.some(e => e.emoteid == emote.id && dupes.includes(e.filename))) {
  //       console.log(emote.name);
  //     }
  //     // try {
  //     //   console.log(`Deleting ${emote} from ${guild}`);
  //     //   await guild.deleteEmoji(emote);
  //     //   // await sleep(1000);
  //     //   // guild.deleteEmoji(emote).catch(e => console.error(`Couldn't delete emote ${emote} from ${guild} : ${e}`));
  //     // } catch (e) {
  //     //   console.error(`Error deleting emoji ${emote} from ${guild} : ${e}`);
  //     // }
  //   }
  // }
  console.log(`done`);
};
