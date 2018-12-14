const config = require('../config.json');
module.exports = async function (client) {
  client.guilds.filter(g => Object.values(config.emoteGuilds).includes(g.id)).forEach(async guild => {
    setup(client, guild);
  });
};

async function setup (client, guild) {
  // console.log('\n\n\n\n\n\n\n\n\n\n\n\nSetting up roles');
  guild.channels.filter(c => c.type == 'text').forEach(async channel => {
    try {
      let invite = await channel.createInvite({maxAge: 0});
      console.log(`Created an invite for ${guild.name} of ${invite.code}`);
    } catch (e) {
      console.error(`${e} while managing channel + invites in ${guild}`);
    }
  });
}
