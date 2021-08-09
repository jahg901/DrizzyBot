require("dotenv").config();
const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });;

const ServerInfo = require("../serverinfo.json");
const DrizzyLines = require("../drizzylines.json");
const token = process.env.DISCORD_TOKEN;

const HeyDrake = require("./heydrake");
const SetFrequency = require("./setfrequency");
const SetCharacter = require("./char");
const SendLyric = require("./sendLyric");

const shuffle = require("./shufflearray");

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.guilds.cache.map(guild => {
        if (!(guild.id in ServerInfo)) {
            ServerInfo[guild.id] = { char: ",", freq: 1, latestMsg: { content: "", channel: null } };
        }
        SendLyric(ServerInfo[guild.id]);
    });
    console.log("Server information loaded");
});

client.on("guildCreate", guild => {
    if (!(guild.id in ServerInfo)) {
        ServerInfo[guild.id] = { char: ",", freq: 1, latestMsg: { content: "", channel: null } };
    }
    SendLyric(ServerInfo[guild.id]);
});

client.on("guildDelete", guild => {
    delete ServerInfo[msg.guild.id];
});

client.on("messageCreate", msg => {
    console.log(ServerInfo[msg.guildId].char);
    HeyDrake(msg);
    if (msg.content.startsWith(ServerInfo[msg.guildId].char)) {
        SetCharacter(msg, ServerInfo[msg.guildId]);
        SetFrequency(msg, ServerInfo[msg.guildId]);
    } else if (typeof msg.content == "string" && msg.content !== "") {
        ServerInfo[msg.guildId].latestMsg = { content: msg.content, channel: msg.channel };
    }
});

process.on("SIGINT", () => {
    console.log("\n");
    process.exit();
});

process.on("exit", () => {
    fs.writeFileSync("./serverinfo.json", JSON.stringify(ServerInfo, (key, value) => {
        if (key === "latestMsg") {
            return { content: "", channel: null };
        } else if (key === "job") {
            return null;
        }
        return value;
    }, 2));
});

client.login(token);