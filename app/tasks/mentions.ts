import {Message, RichEmbed, User} from 'discord.js';
import {ListenerTask}             from '../tasks';
import {Task}                     from '../index';
import {hasPermission}            from '../commands';
import {report}                   from '../logger';
import config                     from '../config';

function getRandomText(user: User): string {
    return (
        config['anti-mention']['fun texts'][
            Math.floor(Math.random() * config['anti-mention']['fun texts'].length)] as string
    ).replace('{name}', `<@${user.id}>`);
}

async function handle(message: Message) {
    if (message.author.bot) return false;
    if (!message.content.match(config['anti-mention']['match']))
        return;
    if (hasPermission(message.member, 'HAS_ADMIN_ROLE'))
        return message.channel.send('👀').catch(e => console.error(e));

    await report(message.guild, new RichEmbed()
        .setTitle('Rei Mention Notice')
        .setColor('ORANGE')
        .addField('User', `${message.author}`)
        .addField('Guild', `${message.guild.name}`)
        .addField('Message', message.content));

    let timer   = config['anti-mention'].countdown;
    let embed   = new RichEmbed()
        .setColor('RED')
        .setDescription(getRandomText(message.author))
        .setFooter(`${timer} seconds`);
    let display = await message.channel.send(embed) as Message;
    display.react('✅').catch(e => console.error(e));
    let hook    = setInterval(async () => {
        await display.edit(embed.setFooter(`${--timer} seconds`));
        if (timer !== 0) return;
        clearInterval(hook);
        await display.edit(embed.setFooter('Member was banned.'));
        message.guild.ban(message.member, {reason: config['anti-mention']['ban reason']}).catch(e => console.error(e));
        display.clearReactions().catch(e => console.error(e));
        await report(message.guild, new RichEmbed()
            .setColor('RED')
            .setDescription(`${message.author} was banned for mentioning Rei.`));
    }, 1000);

    let collector = display.createReactionCollector((react, user) =>
        user.id !== message.client.user.id &&
        hasPermission(message.guild.members.get(user.id), 'HAS_ADMIN_ROLE') &&
        react.emoji.name === '✅'
    ).on('collect', async () => {
        clearInterval(hook);
        collector.stop('pardoned');
        // commands.unmute(message.member).catch(e => console.error(e));
        display.clearReactions().catch(e => console.error(e));
        display.edit(embed.setColor('GREEN')).catch(e => console.error(e));
        await report(message.guild, new RichEmbed()
            .setColor('GREEN')
            .setDescription(`${message.author} was pardoned.`));
    });
}

export default new ListenerTask({
    name:        'Mentions',
    description: 'Performs actions when certain mentions are detected.',
    listeners:   {
        'message':       handle,
        'messageUpdate': (original: Message, updated: Message) => handle(updated)
    }
}) as Task;