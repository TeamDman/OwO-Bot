import {Client, Message, RichEmbed, TextChannel} from 'discord.js';
import {Task}                                    from '../index';

const guildID = '574709755772141569';

export default {
    name: "Remove Channels",
    allowConcurrent: false,
    autoStart: false,
    description: "Removes all channels.",
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
        for (const channel of guild.channels.values()) {
            if (channel.id === '574709756695150604')
                continue;
            try {
                await channel.delete('role controller');
                count++
            } catch (e) {

            }
        }
        this.runningCount--;
        return new RichEmbed().setDescription(`Removed ${count} channels in ${(Date.now()-start)/1000} seconds.`);
    },
} as Task