import {Client, RichEmbed} from 'discord.js';
import {Task}              from '../index';

const guildID  = '574709755772141569';
const packs    = [
    'continuum',
    'ftb presents direwolf20',
    'ftb presents skyfactory 3',
    'ftb presents stoneblock 2',
    'infinity evolved',
    'interactions',
    'pyramid reborn',
    'revelation',
    'sky adventures',
    'sky odyssey',
    'ultimate reloaded',
    'builders paradise',
    'other ftb mod packs'
];
const channels = {
    'IMPORTANT':     ['announcements', 'rules'],
    'TEXT CHANNELS': ['general', 'support', 'server-operators'],
    ...packs.reduce((map: any, pack: string) => {
        map[pack.toUpperCase()] = ['general', 'media', 'servers'];
        return map;
    }, {})
};

export default {
    name:            'Create Channels',
    allowConcurrent: false,
    autoStart:       false,
    description:     'Populates the channel list to mimic FTB.',
    runningCount:    0,
    start:           async (client: Client) => {
        this.runningCount++;
        const start = Date.now();
        const guild = client.guilds.get(guildID);
        let count   = 0;
        if (guild === null) {
            this.runningCount--;
            return new RichEmbed().setColor('ORANGE').setDescription(`Could not find guild [${guildID}].`);
        }
        for (const [categoryName, channelNames] of Object.entries(channels)) {
            const category = await guild.createChannel(categoryName, 'category', [], 'role controller');
            for (const channelName of Object.values(channelNames)) {
                const channel = await guild.createChannel(channelName, 'text', [], 'role controller');
                await channel.setParent(category, 'role controller');
            }
        }
        this.runningCount--;
        return new RichEmbed().setDescription(`Created ${count} channels in ${(Date.now() - start) / 1000} seconds.`);
    },
} as Task;