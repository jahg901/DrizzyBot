const HeyDrake = (msg => {
    if (msg.content === "hey drake") {
        msg.channel.send("whats hannenin");
    }
});

module.exports = HeyDrake;