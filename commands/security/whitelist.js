const db = require('../../database');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
name: "whitelist",

async execute(message, args) {

if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
return message.reply({
content: "You need Administrator permission."
});
}

const sub = args[0]?.toLowerCase();
const user = message.mentions.users.first();

if (!sub) {
return message.reply({
embeds: [
new EmbedBuilder()
.setColor("#D3D3D3")
.setDescription(
`Usage:

\`,whitelist add @user
,whitelist remove @user
,whitelist list\``
)
]
});
}

// =========================
// ADD USER
// =========================
if (sub === "add") {

if (!user) return message.reply("Mention a user.");

let list = await db.get(`whitelist_${message.guild.id}`) || [];

if (list.includes(user.id)) {
return message.reply("User is already whitelisted.");
}

list.push(user.id);

await db.set(`whitelist_${message.guild.id}`, list);

return message.reply({
embeds: [
new EmbedBuilder()
.setColor("#57F287")
.setDescription(`${user.tag} added to whitelist.`)
]
});
}

// =========================
// REMOVE USER
// =========================
if (sub === "remove") {

if (!user) return message.reply("Mention a user.");

let list = await db.get(`whitelist_${message.guild.id}`) || [];

if (!list.includes(user.id)) {
return message.reply("User is not in whitelist.");
}

list = list.filter(x => x !== user.id);

await db.set(`whitelist_${message.guild.id}`, list);

return message.reply({
embeds: [
new EmbedBuilder()
.setColor("#FF7F7F")
.setDescription(`${user.tag} removed from whitelist.`)
]
});
}

// =========================
// LIST USERS
// =========================
if (sub === "list") {

let list = await db.get(`whitelist_${message.guild.id}`) || [];

if (!list.length) {
return message.reply("No whitelisted users.");
}

return message.reply({
embeds: [
new EmbedBuilder()
.setColor("#D3D3D3")
.setDescription(
list.map(id => `<@${id}>`).join("\n")
)
]
});
}

}
};
