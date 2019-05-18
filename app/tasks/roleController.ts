import {Client, RichEmbed, TextChannel} from 'discord.js';
import {Task}                           from '../index';

const channelID = '579412150657744896';

const info = [{
    'label': '<#574709756695150603>',
    'role':  '579425818300776449',
    'type':  'CATEGORY'
}, {
    'label': '<#574709756695150604>',
    'role':  '579425818649034763',
    'type':  'CHANNEL'
}, {
    'label': '<#579404003360768025>',
    'role':  '579425823065374731',
    'type':  'CHANNEL'
}, {
    'label': '<#579404018594611218>',
    'role':  '579425825317847051',
    'type':  'CHANNEL'
}, {
    'label': '<#579404033752694855>',
    'role':  '579425828505518091',
    'type':  'CHANNEL'
}, {
    'label': '<#579404044062425090>',
    'role':  '579425831361970186',
    'type':  'CHANNEL'
}, {
    'label': '<#574709756695150605>',
    'role':  '579425835132649502',
    'type':  'CATEGORY'
}, {
    'label': '<#574709756695150606>',
    'role':  '579425835627315211',
    'type':  'CHANNEL'
}, {
    'label': '<#579405327938879488>',
    'role':  '579425839213576203',
    'type':  'CATEGORY'
}, {
    'label': '<#579405341952049172>',
    'role':  '579425840165552161',
    'type':  'CHANNEL'
}, {
    'label': '<#579405357475168256>',
    'role': '579425844049608717',
    'type': 'CHANNEL'
}];

export default {
    name:            'Role Controller',
    allowConcurrent: false,
    autoStart:       false,
    description:     'Creates and listens to the role controller message.',
    runningCount:    0,
    start:           async (client: Client) => {
        this.runningCount++;
        const channel = client.channels.get(channelID) as TextChannel;
        if (channel === null) {
            this.runningCount--;
            return new RichEmbed().setColor('ORANGE').setDescription(`Could not find channel [${channelID}].`);
        }
        let send = [];
        const pop = ()=> {
           if (send.length > 0) {
               send.push('');
               channel.send(send);
               send = [];
           }
        };
        let emojis = client.emojis.array();
        let emojiRoles = {};
        for (const data of info) {
            const emoji = emojis.pop();
            if (data.type === 'CATEGORY') {
                pop();
                send.push(`${emoji}\t__**${data.label}**__`);
            } else {
                send.push(`${emoji}\t${data.label}`);
            }
        }
        pop();
        this.runningCount--;
    },
    stop:            async (client: Client) => {

    }
} as Task;