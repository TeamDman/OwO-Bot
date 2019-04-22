const config = require('../config/config.json');
module.exports = async function (client) {
    client.guilds.filter(g => Object.values(config.emoteGuilds).includes(g.id)).forEach(async guild => {
        // guild = client.guilds.get(config.emoteGuilds.Teamymotes19);
        setup(client, guild);
    });
};

async function setup(client, guild) {
    if (guild.id === config.emoteGuilds['Teamymotes0']) return;
    try {
        await guild.setIcon('./icon.png');
    } catch (e) {
        console.error(`Error icon on server ${guild} ${e}`);
    }

    // guild.channels.filter(c => (c.type == 'voice' || c.type == 'category')).forEach(async channel => {
    //   console.log(`deleting ${channel}`);
    //   try {
    //     await channel.delete();
    //   } catch (e) {
    //     console.error(`${e} while deleting channels in ${guild}`);
    //   }
    // });

    // guild.channels.filter(c => c.type == 'text').forEach(async channel => {
    //   try {
    //     await channel.overwritePermissions(guild.defaultRole, {SEND_MESSAGES: false});
    //     // let invite = await channel.createInvite();
    //     // console.log(`Created an invite for ${guild.name} of ${invite.code}`);
    //   } catch (e) {
    //     console.error(`${e} while managing channel + invites in ${guild}`);
    //   }
    // });

    // try {
    //   await guild.defaultRole.setPermissions(0);
    // } catch (e) {
    //   console.error(`${e} while setting @everyone perms in ${guild}`);
    // }

    // guild.roles.filter(r => r.id != guild.defaultRole.id).forEach(async role => {
    //   try {
    //     await role.delete();
    //   } catch (e) {
    //     console.error(`${e} while deleting roles in ${guild}`);
    //   }
    // });

    try {
        let role = await guild.createRole({
            name: 'OwO',
            color: 'BLUE',
            permissions: ['ADMINISTRATOR'],
            mentionable: true,
            hoist: true
        });
        guild.members.filter(m => m.id == client.user.id || m.id == '159018622600216577').forEach(async m => {
            try {
                await m.addRole(role);
            } catch (e) {
                console.error(`${e} while assigning roles in ${guild}`);
            }
        });
    } catch (e) {
        console.error(`${e} while creating roles in ${guild}`);
    }
}
