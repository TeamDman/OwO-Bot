import {Client, GuildChannel, MessageReaction, TextChannel, User} from 'discord.js';
import {ListenerTask}                                             from '../tasks';
import {warn}                                                     from '../logger';

const channelID = '579452345486802965';

const info = {
    '579477233618518036': {
        '〰': '579476978005180426',
        '⛸': '579476978609029120',
        '✍': '579476981356167168',
        '⚛': '579476983633674240'
    },
    '579477245907959818': {'⚖': '579476986242662413'},
    '579477246994153474': {
        '⚔': '579476986565492743',
        '⛪': '579476987421130752',
        '⛽': '579476989778591794',
        '✒': '579476992366477352'
    },
    '579477259795300382': {
        '♍': '579476994786328576',
        '☸': '579476995386114049',
        '☦': '579476998137839616',
        '⌨': '579476999962099755'
    },
    '579477271858118657': {
        '➗': '579477002713694228',
        '⛵': '579477003351228436',
        '⬜': '579477006178320405',
        '♒': '579477008690446351'
    },
    '579477284956667904': {
        '⏫': '579477012373045271',
        '⛰': '579477013216362496',
        '✅': '579477015846060032',
        '♌': '579477017947537429'
    },
    '579477297581785088': {
        '⛴': '579477020430303234',
        '☄': '579477021437198346',
        '⏭': '579477023827820544',
        '⏩': '579477025916715029'
    },
    '579477309460054018': {
        '⏲': '579477028236165153',
        '⛱': '579477029087346688',
        '㊙': '579477032233336843',
        '⏱': '579477034921885707'
    },
    '579477322181378060': {
        '☁': '579477037685932062',
        '♎': '579477037912293388',
        '⛩': '579477042324832267',
        '☔': '579477044413595649'
    },
    '579477332683915283': {
        '♊': '579477046972121091',
        '♣': '579477047567450132',
        '➖': '579477050314719246',
        '♋': '579477052449619969'
    },
    '579477346336243742': {'⛅': '579477055146557462', '⚓': '579477055863783424'},
    '579477351612547072': {
        '⏹': '579477057965260802',
        '♓': '579477058657189889',
        '➰': '579477061060788234',
        '◾': '579477063506067456'
    },
    '579477363813908501': {
        '⛹': '579477065405956127',
        '⛳': '579477066207068181',
        '❔': '579477068916588565',
        '♈': '579477071172993054'
    },
    '579477376166133760': {
        '♦': '579477073752621097',
        '⚫': '579477074738413569',
        '⏯': '579477078605430784',
        '❎': '579477081033932810'
    },
    '579477389416071169': {
        '➕': '579477083655503894',
        '❌': '579477084234186763',
        '©': '579477087929368576',
        '☮': '579477090718449684'
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