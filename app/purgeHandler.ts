import {Collection, Guild, GuildMember, Message, Snowflake} from 'discord.js';
import config                                               from './config';
import {info}                                               from './logger';

let purging: boolean = false;

export function shouldPurge(member: GuildMember): boolean {
    return false;
}

export async function startPurge(source: Message, count: number): Promise<void> {
    let toPurge = source.guild.members
        .filter(m =>
            !m.user.bot &&
            m.roles.size == (m.roles.has(config.role_lurker)?1:0) + (m.roles.has(config.role_events)?1:0) + 1
        ).array().filter((_, index) => index < count);
    let startTime = Date.now();
    purging = true;
    info(`Purging ${toPurge.length} members in ${source.guild.name}`)
    let progressMessage = await source.channel.send('Purging...');
    let report    = '';
    await commands.report('Snapped members:');
    for (let i = 0; i < amount && commands.purging; i++) {
        let member = members.pop();
        try {
            if (config.snap_dm_message.length > 0) {
                await member.send(config.snap_dm_message);
            }
            await member.kick('Oh snap!');
        } catch (e) {
            console.error(`Failed kicking user: ${e}`);
        }
        report += `${member.user.id} ${member}\n`;
        // if (i%Math.floor(Math.pow(members.length, 1/3))==0) {
        if (i % 10 == 0) {
            await purgingMessage.edit(`Purging... ${Math.floor((i / amount) * 100)}%`);
            await commands.report(report);
            report = '';
        }
    }
    await purgingMessage.edit('Purging... 100%');
    await channel.send(`Purged ${amount} members in ${Math.floor((Date.now() - startTime) / 1000)} seconds.`);
    commands.purging = false;
    console.log(`Purge complete, purged ${amount} members.`);
}

export async function purge(member: GuildMember): Promise<void> {

}