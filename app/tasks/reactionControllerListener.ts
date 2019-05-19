import {Client, GuildChannel, MessageReaction, TextChannel, User} from 'discord.js';
import {ListenerTask}                                             from '../tasks';
import {warn}                                                     from '../logger';

const channelID = '579452345486802965';

const info = {
    '579480116816510992': {
        '⏭': '579479745373405204',
        '♌': '579479745805418499',
        '☪': '579479748875386880',
        '◾': '579479751559872512'
    },
    '579480129319731226': {'⏬': '579479754202415105'},
    '579480132717117470': {
        '⛔': '579479754562863106',
        '⏩': '579479755284414476',
        '⚽': '579479758908424193',
        '☦': '579479761663819786'
    },
    '579480145312743429': {
        '♦': '579479764176338949',
        '⛹': '579479765145092096',
        '⛪': '579479768039424026',
        '⚪': '579479770715258902'
    },
    '579480157958438933': {
        '♎': '579479774016307220',
        '❌': '579479774649647134',
        '↔': '579479778755608596',
        '⌚': '579479781280841729'
    },
    '579480172051562496': {
        '⚰': '579479784636022795',
        '♐': '579479785332277248',
        '↕': '579479788389924914',
        '⛩': '579479791896363050'
    },
    '579480184995184640': {
        '✊': '579479794672992256',
        '♻': '579479795352469516',
        '⭐': '579479798200533003',
        '♊': '579479801363038229'
    },
    '579480197431164943': {
        '♥': '579479805318398003',
        '☠': '579479806350065684',
        '⛰': '579479808736755715',
        '✋': '579479811798466560'
    },
    '579480210018271233': {
        '⚖': '579479814445203456',
        '⏺': '579479815145521152',
        '⛲': '579479818249175041',
        '⏲': '579479821160153098'
    },
    '579480222911430667': {
        '⏮': '579479823794044928',
        '⚔': '579479824410869773',
        '⏹': '579479827195756545',
        '⛎': '579479830068854805'
    },
    '579480235758583808': {'⏱': '579479833046941706', '➗': '579479833705316373'},
    '579480242809471006': {
        '➕': '579479836289007629',
        '♒': '579479836935061514',
        '〰': '579479839828869131',
        '♑': '579479842291187733'
    },
    '579480252099854346': {
        '☣': '579479845155766283',
        '⏳': '579479845868666887',
        '♉': '579479848926576681',
        '⭕': '579479851933630486'
    },
    '579480264661794837': {
        '⚒': '579479854773305373',
        '➰': '579479855293530133',
        '➿': '579479858577670144',
        '♋': '579479860976812033'
    },
    '579480277773058069': {
        '✅': '579479864143380480',
        '✏': '579479864973721600',
        '⏫': '579479867993882624',
        '➡': '579479871026364426'
    }
};


async function addReacts(client: Client): Promise<void> {
    const channel = client.channels.get(channelID) as GuildChannel & TextChannel;
    if (channel === null)
        return;
    for (const [messageID, data] of Object.entries(info)) {
        try {
            const message = await channel.fetchMessage(messageID);
            for (const [emojiID, roleID] of Object.entries(data)) {
                await message.react(emojiID);
            }
        } catch (e) {
            warn(`Error starting reaction controller for message [${messageID}]: ${e}`);
        }
    }
}

async function action(reaction: MessageReaction, user: User): Promise<void> {
    console.log(`User ${user.username} reacted with ${reaction.emoji} to message ${reaction.message.content}.`);
    if (user.bot)
        return;
    if (!(reaction.message.id in info))
        return;
    if (reaction.message.guild === null)
        return;

    const member = reaction.message.guild.members.get(user.id);
    if (member === null)
        return;

    const roleID = info[reaction.message.id][reaction.emoji.id];
    if (roleID === undefined)
        return;

    try {
        if (member.roles.has(roleID))
            await member.removeRole(roleID);
        else
            await member.addRole(roleID);
    } catch (e) {
        warn(`Error in reaction controller: ${e}`);
    }
}

export default new ListenerTask({
    name:            'Reaction Controller Listener',
    description:     'Controls assignment of roles according to the controller.',
    autoStart:       true,
    allowConcurrent: false,
    start:           addReacts,
    listeners:       {
        'messageReactionAdd':    action,
        'messageReactionRemove': action
    }
});