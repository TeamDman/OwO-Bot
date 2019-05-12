import {Collection, Guild, GuildChannel, GuildMember, Message, Snowflake, TextChannel} from 'discord.js';
import config                                                                          from './config';
import {info, report}                                                                  from './logger';

let purging: boolean = false;

export function shouldPurge(member: GuildMember): boolean {
    if (member.user.bot)
        return false;
    let has = 0;
    for (let role of Object.values(config.snap['must have more roles than these to not be purged']))
        if (member.roles.has(role as string))
            has++;
    // If they only have those roles, then boot 'em.
    return has === member.roles.size;
}

export async function startPurge(context: TextChannel, count: number): Promise<void> {
    if (purging)
        throw new Error("Already purging.");
    let toPurge = context.guild.members
        .filter(shouldPurge)
        .array()
        .filter((_, index) => index < count);
    let startCount = toPurge.length;
    info(`Purging ${startCount} members in ${context.guild.name}`);
    let startTime = Date.now();
    purging = true;
    let progressMessage = await context.send('Purging...') as Message;
    let reportText    = '';
    await report(context.guild, 'Snapped members:');
    let i=0;
    for (; purging && toPurge.length > 0; i++) {
        let member = toPurge.pop();
        try {
            await purgeMember(member);
        } catch (e) {
            console.error(`Failed kicking user: ${e}`);
        }
        reportText += `${member.user.id} ${member}\n`;
        if (i % 10 == 0) {
            await progressMessage.edit(`Purging... ${Math.floor((i / startCount) * 100)}%`);
            await report(context.guild, reportText);
            reportText = '';
        }
    }
    await progressMessage.edit('Purging... 100%');
    await context.send(`Purged ${i} members in ${Math.floor((Date.now() - startTime) / 1000)} seconds.`);
    purging = false;
    console.log(`Purge complete, purged ${startCount} members.`);
}

export async function purgeMember(member: GuildMember): Promise<void> {
    if (config.snap_dm_message.length > 0) {
        await member.send(config.snap['dm message']);
    }
    await member.kick(config.snap['kick reason']);
}