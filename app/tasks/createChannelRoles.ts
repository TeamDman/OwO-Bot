import {CategoryChannel, Channel, Client, RoleData} from 'discord.js';
import {Task}                                       from '../index';

const guildID = '574709755772141569';

export default {
    name: "Create Channel Roles",
    allowConcurrent: false,
    autoStart: false,
    description: "Creates channels for each role.",
    runningCount: 0,
    start: async (client: Client) => {
        this.runningCount++;
        const guild = client.guilds.get(guildID);
        if (guild === null) {
            this.runningCount--;
            return `Could not find guild with ID='${guildID}'.`;
        }

        for (const c of guild.channels.filter((c: Channel) => c.type === 'category').values()) {
            //type guard
            const category = c as unknown as CategoryChannel;
            for (const channel of category.children.values()) {
                await guild.createRole({
                    name: `${category.name} - ${channel.name}`
                } as RoleData, 'role controller');
            }
        }

        this.runningCount--;
    },
    stop: async (client: Client) => {

    },
} as Task