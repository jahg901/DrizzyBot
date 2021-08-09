require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });;

const ServerInfo = require("../serverinfo.json");
const DrizzyLines = require("../drizzylines.json");
const token = process.env.DISCORD_TOKEN;

const HeyDrake = require("./heydrake");
const SetFrequency = require("./setfrequency");
const SetCharacter = require("./char");

const shuffle = require("./shufflearray");

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.guilds.cache.map(guild => {
        if (!(guild.id in ServerInfo)) {
            ServerInfo[guild.id] = { char: ",", freq: 1, latestMsg: { content: "", channel: null } };
        }
        ServerInfo[guild.id].job = setInterval(() => {
            if (ServerInfo[guild.id].latestMsg.channel !== null) {
                const msgWords = ServerInfo[guild.id].latestMsg.content.toLowerCase().split(/[^a-zA-Z0-9]+/);
                let messageFound = false;
                for (w of shuffle(msgWords)) {
                    for (l of shuffle(DrizzyLines)) {
                        if (l.replace(/[^a-zA-Z0-9 ]/g, "").toLowerCase().includes(` ${w} `)) {
                            ServerInfo[guild.id].latestMsg.channel.send(l);
                            messageFound = true;
                            break;
                        }
                    }
                    if (messageFound) break;
                }
                if (!messageFound) {
                    ServerInfo[guild.id].latestMsg.channel.send(DrizzyLines[Math.floor(Math.random() * DrizzyLines.length)]);
                }
            }
        }, ServerInfo[guild.id].freq * 60000);
    });
    console.log("Server information loaded");
});

client.on("messageCreate", msg => {
    HeyDrake(msg);
    if (msg.content.startsWith(ServerInfo[msg.guildId].char)) {
        SetCharacter(msg, ServerInfo[msg.guildId]);
        SetFrequency(msg, ServerInfo[msg.guildId]);
    } else if (typeof msg.content == "string" && msg.content !== "") {
        ServerInfo[msg.guildId].latestMsg = { content: msg.content, channel: msg.channel };
    }
});

client.login(token);