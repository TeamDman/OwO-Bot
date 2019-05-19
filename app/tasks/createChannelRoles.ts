import {CategoryChannel, Channel, Client, RichEmbed, Role, RoleData} from 'discord.js';
import {Task}                                                        from '../index';

const guildID = '574709755772141569';
const blacklist = {
    '574709756695150604': true,
    '579445431394762773': true,
    '579445435383676928': true,
    '579445428244971520': true,
    '579445429498806282': true,
};
export default {
    name: "Create Channel Roles",
    allowConcurrent: false,
    autoStart: false,
    description: "Creates channels for each role.",
    runningCount: 0,
    start: async (client: Client) => {
        this.runningCount++;
        const start = Date.now();
        const guild = client.guilds.get(guildID);
        let count = 0;
        if (guild === null) {
            this.runningCount--;
            return new RichEmbed().setColor('ORANGE').setDescription(`Could not find guild [${guildID}].`);
        }
        const everyone = guild.roles.find((role: Role) => role.name==='@everyone');
        if (everyone === null) {
            this.runningCount--;
            return new RichEmbed().setColor('ORANGE').setDescription(`Could not find @everyone role for guild [${guildID}].`);
        }

        const rtn = [];
        const emojis = client.emojis.array();

        for (const c of guild.channels.filter((c: Channel) => c.type === 'category').values()) {
            //type guard
            const category = c as unknown as CategoryChannel;
            const categoryRole = await guild.createRole({
                name: category.name
            }, 'role controller');
            count++;
            let emoji = emojis.pop();
            let item = {
                send: [`${emoji.toString()} __**${category.name}**__`],
                reacts: {[emoji.id]: categoryRole.id},
            };
            for (const channel of category.children.values()) {
                if (channel.id in blacklist)
                    continue;

                const role = await guild.createRole({
                    name: `${category.name} - ${channel.name}`
                } as RoleData, 'role controller');
                emoji = emojis.pop();
                item.send.push(`${emoji.toString()} <#${channel.id}>`);
                item.reacts[emoji.id] = role.id;
                count++;

                await channel.overwritePermissions(role, {
                    READ_MESSAGES: true
                }, 'role controller');
                await channel.overwritePermissions(categoryRole, {
                    READ_MESSAGES: true
                }, 'role controller');
                await channel.overwritePermissions(everyone, {
                    READ_MESSAGES: false
                }, 'role controller');
            }
            rtn.push(item);
        }
        console.log(JSON.stringify(rtn));
        this.runningCount--;
        return new RichEmbed().setDescription(`Created ${count} roles in ${(Date.now()-start)/1000} seconds.`);
    },
    stop: async (client: Client) => {

    },
} as Task