const SetCharacter = ((msg, server) => {
    if (msg.content.substring(1, 9) === "setchar " && msg.content.length === 10) {
        const char = msg.content.substring(9);
        if (char !== " " && char !== "\n" && char !== "/") {
            server.char = char;
            msg.channel.send(`OK, I respond to \`${char}\` now`);
        }
    }
});

module.exports = SetCharacter;