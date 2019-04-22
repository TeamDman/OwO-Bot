module.exports = async function (client) {
    return;
    const info = m => {
        return `${m.guild.name}\t${m.channel.name}\t${m.author.tag}`;
    };
    client.on('messageDelete', m => {
        if (m.author.bot) return;
        client.log(`!!! ${info(m)}\t${m.content}`);
        m.embeds.forEach(em => {
            client.log(`!!! ${info(m)}\t ${em.type} embed:${em.url}`);
        });
        m.attachments.forEach(em => {
            client.log(`!!! ${info(m)}\t ${em.filename} url:${em.url}`);
        });
    });
    client.on('messageUpdate', (o, n) => {
        if (o.author.bot) return;
        if (o.content == n.content) return;
        const line = `*** ${info(o)}\t`;
        client.log(`${line}${o.content}`);
        client.log(`${line.replace(/[^\t]/g, ' ')}${n.content}`);
    });
};
