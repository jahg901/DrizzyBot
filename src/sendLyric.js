const DrizzyLines = require("../drizzylines.json");
const shuffle = require("./shufflearray");

const SendLyric = (server => {
    server.job = setInterval(() => {
        let messageFound = false;
        if (server.latestMsg.channel !== null) {
            const msgWords = server.latestMsg.content.toLowerCase().split(/[^a-zA-Z0-9]+/);
            for (w of shuffle(msgWords)) {
                for (l of shuffle(DrizzyLines)) {
                    if (l.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase().includes(` ${w} `)) {
                        server.latestMsg.channel.send(l);
                        messageFound = true;
                        ServerInfo[guild.id].latestMsg = { content: "", channel: null };
                        break;
                    }
                }
                if (messageFound) break;
            }
        }
        if (!messageFound) {
            server.latestMsg.channel.send(DrizzyLines[Math.floor(Math.random() * DrizzyLines.length)]);
        }
    }, server.freq * 60000);
});

module.exports = SendLyric;