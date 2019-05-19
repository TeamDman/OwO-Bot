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

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

export default {
    name: "Create Roles",
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
        const emojis = shuffle(require('../../emojis.json').emojis).filter((e: any) => e.emoji.length === 1);

        for (const c of guild.channels.filter((c: Channel) => c.type === 'category').values()) {
            //type guard
            const category = c as unknown as CategoryChannel;
            const categoryRole = await guild.createRole({
                name: category.name
            }, 'role controller');
            count++;
            let emoji = emojis.pop().emoji;
            let item = {
                send: [`${emoji} __**${category.name}**__`],
                reacts: {[emoji]: categoryRole.id},
            };
            for (const channel of category.children.values()) {
                if (channel.id in blacklist)
                    continue;

                const role = await guild.createRole({
                    name: `${category.name} - ${channel.name}`
                } as RoleData, 'role controller');
                emoji = emojis.pop().emoji;
                item.send.push(`${emoji} <#${channel.id}>`);
                item.reacts[emoji] = role.id;
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