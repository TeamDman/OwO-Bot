module.exports = async function (client) {
    client.on('message', message => {
        if (message.channel.id !== '527215210768105481' && message.channel.id !== '123194979509207040') return;
        if (message.content.indexOf('terracotta') == -1) return;
        if (message.content.indexOf('where') == -1 && message.content.indexOf('how') == -1) return;
        message.channel.send('WhErE iS ThE TeRrAcOtTa!?');
    });
};
