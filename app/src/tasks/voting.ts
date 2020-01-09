import {Message, MessageAttachment, MessageEmbed} from 'discord.js';
import * as logger                                from '../logger';
import {ListenerTask}                             from '../tasks';
import {Task}                                     from '../index';

export const state = {
    active: false,
    allowNewChoices: false,
    channelId: "",
    choices: [],
    votes: {},
}

function getInfo(message: Message) {
    return `${message.guild}\t#${'name' in message.channel && message.channel.name || 'UNKNOWN CHANNEL'}\t<@${message.author.id}> (${message.author.tag})`;
}

export default new ListenerTask({
    name:        'Voting',
    description: 'Logs voting messages.',
    listeners:   {
        'message': (message: Message) => {
            if (message.author.bot) return;
            if (message.channel.id !== state.channelId) return;
            let choice = null;
            for (const choice of state.choices) {
                if (message.content.indexOf(choice) !== -1) {
                    message.delete("Vote choice").catch(logger.error);
                    Object.keys(state.votes).forEach((key:string) => delete state.votes[key][message.author.id]);
                    if (state.votes[choice] == undefined)
                        state.votes[choice] = {};
                    state.votes[choice][message.author.id] = true;
                    return;
                }
            }
        },
    }
}) as Task;