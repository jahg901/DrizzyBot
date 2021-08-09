const DrizzyLines = require("../drizzylines.json");

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
                if (server.latestMsg.channel !== null) {
                    const msgWords = server.latestMsg.content.toLowerCase().split(/[^a-zA-Z0-9]+/);
                    let messageFound = false;
                    for (w of shuffle(msgWords)) {
                        for (l of shuffle(DrizzyLines)) {
                            if (l.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase().includes(` ${w} `)) {
                                server.latestMsg.channel.send(l);
                                messageFound = true;
                                break;
                            }
                        }
                        if (messageFound) break;
                    }
                    if (!messageFound) {
                        server.latestMsg.channel.send(DrizzyLines[Math.floor(Math.random() * DrizzyLines.length)]);
                    }
                }
            }, server.freq * 60000);
        }
    }
});

module.exports = SetFrequency;