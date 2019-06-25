import {Message, RichEmbed, User} from 'discord.js';
import {ListenerTask}             from '../tasks';
import {Task}                     from '../index';
import {hasAdminRole}             from '../commands';
import {report, warn}             from '../logger';
import config                     from '../config';

async function handle(message: Message) {
    if (message.author.bot) return false;
    if (message.channel.type !== 'text') return false;
    if (!(message.guild.id in config['anti-mention']['whitelist'])) return;
    if (!message.content.match(config['anti-mention']['match'])) return;
    if (hasAdminRole(message.member))
        return message.channel.send('👀').catch(e => console.error(e));

    await report(message.guild, new RichEmbed()
        .setTitle('Rei Mention Notice')
        .setColor('ORANGE')
        .addField('User', `${message.author}`, true)
        .addField('Guild', `${message.guild.name}`, true)
        .addField('Channel', `${message.channel}`, true)
        .addField('Message', message.content, true)
        .addField('Message Link', message.url, true));

    let timer = config['anti-mention'].countdown;
    let embed = new RichEmbed()
        .setColor('RED')
        .setDescription(getRandomText(message.author))
        .setFooter(`${timer} seconds`);
    message.member.addRole(config['anti-mention']['silence roles'][message.guild.id], config['anti-mention']['ban reason']).catch(e => console.error(e));
    let display = await message.channel.send(embed) as Message;
    display.react('✅').catch(e => console.error(e));
    let hook = setInterval(async () => {
        await display.edit(embed.setFooter(`${--timer} seconds`));
        if (timer !== 0) return;
        clearInterval(hook);
        collector.stop('banned');
        await display.edit(embed.setFooter('Member was banned.'));
        message.author.send(config['anti-mention']['dm message']).catch(e => console.error(e));
        let banCount     = 0;
        let hackBanCount = 0;
        for (const guild of Object.keys(config['anti-mention']['whitelist'])) {
            if (message.client.guilds.has(guild)) {
                const has = message.client.guilds.get(guild).members.has(message.member.id) ? 1 : 0;
                try {
                    hackBanCount++;
                    banCount += has;
                    await message.client.guilds.get(guild).ban(message.member, {reason: config['anti-mention']['ban reason']});
                } catch (e) {
                    hackBanCount--;
                    banCount -= has;
                    warn(`Failed to ban ${message.member} in guild ${message.client.guilds.get(guild).name}.`);
                }
            }
        }
        display.clearReactions().catch(e => console.error(e));
        await report(message.guild, new RichEmbed()
            .setColor('RED')
            .setDescription(`${message.author} was banned from [${banCount}] guilds and pre-banned from [${hackBanCount}] guilds for mentioning Rei.`));
    }, 1000);

    let collector = display.createReactionCollector((react, user) =>
        user.id !== message.client.user.id &&
        hasAdminRole(message.guild.members.get(user.id)) &&
        react.emoji.name === '✅'
    ).on('collect', async () => {
        clearInterval(hook);
        collector.stop('pardoned');
        message.member.removeRole(config['anti-mention']['silence roles'][message.guild.id], 'pardoned').catch(e => console.error(e));
        display.clearReactions().catch(e => console.error(e));
        display.edit(embed.setColor('GREEN')).catch(e => console.error(e));
        await report(message.guild, new RichEmbed()
            .setColor('GREEN')
            .setDescription(`${message.author} was pardoned.`));
    });
}

function getRandomText(user: User): string {
    return (
        config['anti-mention']['fun texts'][
            Math.floor(Math.random() * config['anti-mention']['fun texts'].length)] as string
    ).replace('{name}', `<@${user.id}>`);
}

export default new ListenerTask({
    name:        'Mentions',
    description: 'Performs actions when certain mentions are detected.',
    listeners:   {
        'message':       handle,
        'messageUpdate': (original: Message, updated: Message) => handle(updated)
    }
}) as Task;