const { QuickDB } = require("quick.db");
const db = new QuickDB();

const {
EmbedBuilder,
ActionRowBuilder,
StringSelectMenuBuilder,
ButtonBuilder,
ButtonStyle,
ComponentType,
PermissionsBitField
} = require("discord.js");

const cooldown = new Map();

module.exports = {
name: "antinuke",

async execute(message, args) {

if (!message.guild) return;

const sub = args[0]?.toLowerCase();

// =========================
// COOLDOWN
// =========================
if (cooldown.has(message.author.id)) {
const timeLeft = ((cooldown.get(message.author.id) - Date.now()) / 1000).toFixed(1);

if (timeLeft > 0) {
return message.reply({
embeds: [
new EmbedBuilder()
.setColor("#FF7F7F")
.setDescription(`<:off:1520340423829098597> Cooldown \`${timeLeft}s\``)
]
});
}
}

cooldown.set(message.author.id, Date.now() + 3000);
setTimeout(() => cooldown.delete(message.author.id), 3000);

// =========================
// PERMISSION CHECK
// =========================
if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
return message.reply({
embeds: [
new EmbedBuilder()
.setColor("#FF7F7F")
.setDescription("<:off:1520340423829098597> You need Administrator permission.")
]
});
}

// =========================
// HELP MENU (THIS FIXES YOUR ISSUE)
// =========================
if (!sub) {

return message.reply({
embeds: [
new EmbedBuilder()
.setColor("#D3D3D3")
.setTitle("<:on:1520340385451347968> Antinuke System")
.setDescription(
`<a:MekoLoading:1514728537452708022> **Available Commands**

,antinuke enable
,antinuke disable
,antinuke manage

<:on:1520340385451347968> Enable protection system
<:off:1520340423829098597> Disable protection system
<:on:1520340385451347968> View & edit settings`
)
.setFooter({ text: `Requested by ${message.author.username}` }
)]
});
}

// =========================
// ENABLE
// =========================
if (sub === "enable") {

const enabled = await db.get(`antinuke_${message.guild.id}`);

if (enabled) {
return message.reply({
embeds: [
new EmbedBuilder()
.setColor("#FFCC66")
.setDescription("<:off:1520340423829098597> Antinuke is already ENABLED.\nUse `,antinuke manage` to edit settings.")
]
});
}

// default filters
let filters = {
ban: true,
kick: true,
botadd: true,
channeldelete: true,
roledelete: true,
guildupdate: true,
webhook: true,
mention: true
};

await db.set(`antinuke_filters_${message.guild.id}`, filters);

// =========================
// PREMIUM EMBED
// =========================
const embed = new EmbedBuilder()
.setColor("#D3D3D3")
.setTitle("<:on:1520340385451347968> Antinuke Control Panel")
.setDescription(
`Configure your server protection:

${filters.ban ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Ban
${filters.kick ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Kick
${filters.botadd ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Bot Add
${filters.channeldelete ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Channel Delete
${filters.roledelete ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Role Delete
${filters.guildupdate ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Guild Update
${filters.webhook ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Webhook
${filters.mention ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Mention Spam`
);

// dropdown
const menu = new StringSelectMenuBuilder()
.setCustomId("antinuke_menu")
.setPlaceholder("Toggle protection")
.addOptions([
{ label: "Ban", value: "ban" },
{ label: "Kick", value: "kick" },
{ label: "Bot Add", value: "botadd" },
{ label: "Channel Delete", value: "channeldelete" },
{ label: "Role Delete", value: "roledelete" },
{ label: "Guild Update", value: "guildupdate" },
{ label: "Webhook", value: "webhook" },
{ label: "Mention Spam", value: "mention" }
]);

const row1 = new ActionRowBuilder().addComponents(menu);

const row2 = new ActionRowBuilder().addComponents(
new ButtonBuilder()
.setCustomId("save")
.setLabel("Save Settings")
.setStyle(ButtonStyle.Success),

new ButtonBuilder()
.setCustomId("cancel")
.setLabel("Cancel")
.setStyle(ButtonStyle.Danger)
);

const msg = await message.reply({
embeds: [embed],
components: [row1, row2]
});

// =========================
// SELECT MENU COLLECTOR
// =========================
const collector = msg.createMessageComponentCollector({
componentType: ComponentType.StringSelect,
time: 300000
});

collector.on("collect", async (interaction) => {

if (interaction.user.id !== message.author.id) {
return interaction.reply({
content: "<:off:1520340423829098597> This menu isn't yours.",
ephemeral: true
});
}

let filtersDB = await db.get(`antinuke_filters_${message.guild.id}`) || filters;

const value = interaction.values[0];
filtersDB[value] = !filtersDB[value];

await db.set(`antinuke_filters_${message.guild.id}`, filtersDB);

// update embed
embed.setDescription(
`Configure your server protection:

${filtersDB.ban ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Ban
${filtersDB.kick ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Kick
${filtersDB.botadd ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Bot Add
${filtersDB.channeldelete ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Channel Delete
${filtersDB.roledelete ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Role Delete
${filtersDB.guildupdate ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Guild Update
${filtersDB.webhook ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Webhook
${filtersDB.mention ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Mention Spam`
);

await interaction.update({
embeds: [embed],
components: [row1, row2]
});
});

// =========================
// BUTTON COLLECTOR
// =========================
const buttonCollector = msg.createMessageComponentCollector({
componentType: ComponentType.Button,
time: 300000
});

buttonCollector.on("collect", async (interaction) => {

if (interaction.user.id !== message.author.id) {
return interaction.reply({
content: "<:off:1520340423829098597> This interaction isn't yours.",
ephemeral: true
});
}

if (interaction.customId === "cancel") {
return msg.delete().catch(() => {});
}

if (interaction.customId === "save") {

await db.set(`antinuke_${message.guild.id}`, true);

return interaction.update({
embeds: [
new EmbedBuilder()
.setColor("#57F287")
.setTitle("<:on:1520340385451347968> Antinuke Enabled")
.setDescription("Settings saved successfully.\nYour server is now protected.")
],
components: []
});
}
});
}

// =========================
// DISABLE
// =========================
if (sub === "disable") {

const enabled = await db.get(`antinuke_${message.guild.id}`);

if (!enabled) {
return message.reply({
embeds: [
new EmbedBuilder()
.setColor("#FF7F7F")
.setDescription("<:off:1520340423829098597> Antinuke is already DISABLED.")
]
});
}

await db.delete(`antinuke_${message.guild.id}`);
await db.delete(`antinuke_filters_${message.guild.id}`);

return message.reply({
embeds: [
new EmbedBuilder()
.setColor("#FF7F7F")
.setDescription("<:off:1520340423829098597> Antinuke has been disabled.")
]
});
}

// =========================
// MANAGE
// =========================
if (sub === "manage") {

const enabled = await db.get(`antinuke_${message.guild.id}`);

if (!enabled) {
return message.reply({
embeds: [
new EmbedBuilder()
.setColor("#FF7F7F")
.setDescription("<:off:1520340423829098597> Antinuke is not enabled in this server.")
]
});
}

const filters = await db.get(`antinuke_filters_${message.guild.id}`) || {};

return message.reply({
embeds: [
new EmbedBuilder()
.setColor("#D3D3D3")
.setTitle("<:on:1520340385451347968> Antinuke Settings")
.setDescription(
Object.entries(filters)
.map(([k,v]) =>
`${v ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} ${k}`
)
.join("\n")
)
]
});
}

}
};
