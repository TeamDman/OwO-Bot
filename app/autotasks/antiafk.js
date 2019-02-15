module.exports = (client) => {
    setInterval(()=>{
        client.guilds.get('431514494750031882').channels.get('432713268755300382').startTyping();
    },5000);
};