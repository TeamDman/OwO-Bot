module.exports = async function (client) {
    return;
    client.on('message', message => {
        if (message.guild.id !== '372448486723158016' && message.guild.id !== '349201954326708226' && message.guild.id !== '123194979509207040') return;
        if (message.content.indexOf('terracotta') == -1) return;
        if (message.content.indexOf('where') == -1 && message.content.indexOf('how') == -1) return;
        message.channel.send('WhErE iS ThE TeRrAcOtTa!?');
    });
};
