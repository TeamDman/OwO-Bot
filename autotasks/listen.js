module.exports = async function (client) {
    client.on('messageDelete', m => {
        if (m.author.bot) return;
        client.inspect(m);
        client.log(`!!! ${m.author.tag}\t#${m.channel.name}\t${m.content}`);
        m.embeds.forEach(em => {
            client.log(`!!! ${m.author.tag}\t#${m.channel.name}\t ${em.type} embed:${em.url}`);
        });
        m.attachments.forEach(em => {
            client.log(`!!! ${m.author.tag}\t#${m.channel.name}\t ${em.filename} url:${em.url}`);
        });
    });
    client.on('messageUpdate', (o, n) => {
        if (o.author.bot) return;
        if (o.content == n.content) return;
        const line = `*** ${o.author.tag}\t#${o.channel.name}\t`;
        client.log(`${line}${o.content}`);
        client.log(`${line.replace(/[^\t]/g, ' ')}${n.content}`);
    });
};
