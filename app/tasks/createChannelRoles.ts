import {CategoryChannel, Channel, Client, RichEmbed, Role, RoleData} from 'discord.js';
import {Task}                                                        from '../index';

const guildID = '574709755772141569';
const blacklist = {
    '579412150657744896':true
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

        let rtn = [];

        for (const c of guild.channels.filter((c: Channel) => c.type === 'category').values()) {
            //type guard
            const category = c as unknown as CategoryChannel;
            const categoryRole = await guild.createRole({
                name: category.name
            }, 'role controller');
            count++;
            console.log(`Created role [${categoryRole.id}] '${categoryRole.name}' for category channel [${category.id}].`);
            rtn.push({
                label: `<#${category.id}>`,
                role: categoryRole.id,
                type: 'CATEGORY'
            });
            for (const channel of category.children.values()) {
                if (channel.id in blacklist)
                    continue;

                const role = await guild.createRole({
                    name: `${category.name} - ${channel.name}`
                } as RoleData, 'role controller');
                console.log(`Created role [${role.id}] '${role.name}' for channel [${channel.id}] ${channel.name}.`);
                rtn.push({
                    label: `<#${channel.id}>`,
                    role: role.id,
                    type: 'CHANNEL'
                });
                count++;

                await channel.overwritePermissions(role, {
                    READ_MESSAGES: true
                }, 'role controller');
                console.log(`Assigned role [${role.id}] to channel [${channel.id}].`);
                await channel.overwritePermissions(categoryRole, {
                    READ_MESSAGES: true
                }, 'role controller');
                console.log(`Assigned role [${categoryRole.id}] to channel [${channel.id}].`);
                await channel.overwritePermissions(everyone, {
                    READ_MESSAGES: false
                }, 'role controller');
            }
        }
        console.log(JSON.stringify(rtn));
        this.runningCount--;
        return new RichEmbed().setDescription(`Created ${count} roles in ${(Date.now()-start)/1000} seconds.`);
    },
    stop: async (client: Client) => {

    },
} as Task