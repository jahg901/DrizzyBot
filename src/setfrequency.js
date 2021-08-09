const SetFrequency = ((msg, server) => {
    if (msg.content.substring(1, 9) === "setfreq " && msg.content.length >= 10 && !/[^0-9]+/.test(msg.content.substring(10))) {
        const freq = parseInt(msg.content.substring(10));
        if (freq > 0 && freq < 1000000) {
            server.freq = freq;
            if (freq === 1) {
                msg.channel.send(`OK, I'll drop bars every 1 minute`);
            } else {
                msg.channel.send(`OK, I'll drop bars every ${freq} minutes`);
            }
            clearInterval(server.job)
            server.job = setInterval(() => {

            }, ServerInfo[guild.id].freq * 60000);
        }
    }
});

module.exports = SetFrequency;