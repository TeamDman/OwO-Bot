import {GuildMember, Message, User} from 'discord.js';
import {ListenerTask}               from '../tasks';
import {Task}                       from '../index';

const last: { [index: string]: number } = {};

export function getLastSeen(id: string): number {
    return last[id];
}

export default new ListenerTask({
    name:        'Stalker',
    description: 'Logs user online activity.',
    listeners:   {
        'message':               (message: Message) => last[message.author.id] = Date.now(),
        'messageDelete':         (message: Message) => last[message.author.id] = Date.now(),
        'messageUpdate':         (original: Message) => last[original.author.id] = Date.now(),
        'typingStart':           (_: any, user: User) => last[user.id] = Date.now(),
        'guildMemberSpeaking':   (member: GuildMember) => last[member.id] = Date.now(),
        'messageReactionAdd':    (_: any, user: User) => last[user.id] = Date.now(),
        'messageReactionRemove': (_: any, user: User) => last[user.id] = Date.now(),
        'presenceUpdate':        (_: any, member: GuildMember) => last[member.id] = Date.now(),
        'userUpdate':            (_: any, user: User) => last[user.id] = Date.now(),
        'voiceStateUpdate':      (_: any, member: GuildMember) => last[member.id] = Date.now()
    }
}) as Task;