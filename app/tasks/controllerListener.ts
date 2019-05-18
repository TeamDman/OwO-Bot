import {Client, Message, MessageReaction, RichEmbed, TextChannel, User} from 'discord.js';
import {Task}                                                           from '../index';
import {ListenerTask}                                                   from '../tasks';
import {warn}                                                           from '../logger';

const channelID = '579412150657744896';

const info = {
    '579433289828270083': {
        '512831921882005521': '579425818300776449',
        '512744302678376458': '579425818649034763',
        '512744301499777034': '579425823065374731',
        '512744300216582162': '579425825317847051',
        '512733235940163595': '579425828505518091',
        '512733235143507968': '579425831361970186'
    },
    '579433290637901824': {
        '512733234082218023': '579425835132649502',
        '512733232790503434': '579425835627315211'
    },
    '579433291468505109': {
        '512733231800647700': '579425839213576203',
        '512733230865186826': '579425840165552161',
        '512733229569277973': '579425844049608717'
    }
};

async function action(reaction: MessageReaction, user: User): Promise<void> {
    if (reaction.message.id in info) {
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
}

export default new ListenerTask({
    name: 'Controller Listener',
    description: 'Controls assignment of roles according to the controller.',
    autoStart: true,
    allowConcurrent: false,
    listeners: {
        'messageReactionAdd': action,
        'messageReactionRemove': action
    }
})