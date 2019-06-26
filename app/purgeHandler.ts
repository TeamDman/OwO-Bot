import {GuildMember, Message, TextChannel} from 'discord.js';
import config                              from './config';
import {info, report}                      from './logger';

let purging: boolean = false;

export function shouldPurge(member: GuildMember): boolean {
    if (member.user.bot)
        return false;
    let has = 0;
    let g = Object.values(config.snap['must have more roles than these to not be purged']);
    for (let role of Object.values(config.snap['must have more roles than these to not be purged']))
        if (member.roles.has(role as string))
            has++;
    // If they only have those roles, then boot 'em.
    return has === member.roles.size - 1; // Subtract one for @everyone
}

export async function startPurge(context: TextChannel, count: number): Promise<void> {
    if (purging)
        throw new Error('Already purging.');
    let toPurge    = context.guild.members
        .filter(shouldPurge)
        .array()
        .filter((_, index) => index < count);
    let startCount = toPurge.length;
    info(`Purging ${startCount} members in ${context.guild.name}`);
    let startTime       = Date.now();
    purging             = true;
    let progressMessage = await context.send('Purging...') as Message;
    let reportText      = '';
    await report(context.guild, 'Snapped members:');
    let i = 0;
    while(purging && toPurge.length > 0) {
        let member = toPurge.pop();
        try {
            await purgeMember(member);
            reportText += `${member.user.id} ${member}\n`;
            i++;
        } catch (e) {
            console.error(`Failed kicking user ${member}: ${e}`);
        }
        if (i>0 && i % 10 == 0) {
            await progressMessage.edit(`Purging... ${Math.floor((i / startCount) * 100)}%`);
            await report(context.guild, reportText);
            reportText = '';
        }
    }
    await context.send(`Purged ${i} members in ${Math.floor((Date.now() - startTime) / 1000)} seconds.`);
    purging = false;
    console.log(`Purge complete, purged ${i} members.`);
}

export async function purgeMember(member: GuildMember): Promise<void> {
    if (config.snap['dm message'].length > 0) {
        try {
            await member.send(config.snap['dm message']);
        } catch (e) {
            // Can't dm user, do nothing.
        }
    }
    await member.kick(config.snap['kick reason']);
}