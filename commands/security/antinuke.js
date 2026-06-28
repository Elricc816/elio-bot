const { QuickDB } = require("quick.db"); const db = new QuickDB();

const {
EmbedBuilder,
ActionRowBuilder,
StringSelectMenuBuilder,
ButtonBuilder,
ButtonStyle,
ComponentType
} = require('discord.js');

const cooldown = new Map();

module.exports = {
name: "antinuke",

async execute(message, args) {

const cooldownTime = 3000;

// =========================
// COOLDOWN
// =========================
if (cooldown.has(message.author.id)) {

const timeLeft = (
(cooldown.get(message.author.id) - Date.now()) / 1000
).toFixed(1);

if (timeLeft > 0) {

return message.reply({
embeds: [
new EmbedBuilder()
.setColor("#FF7F7F")
.setDescription(
`<:WarningIcon:1514708751385497721> You are under cooldown.

<:arrow:1514699753462566953> Cooldown • \`${timeLeft}s\``
)
]
});
}

}

cooldown.set(message.author.id, Date.now() + cooldownTime);

setTimeout(() => {
cooldown.delete(message.author.id);
}, cooldownTime);

const sub = args[0]?.toLowerCase();

  if (!sub) {

const embed = new EmbedBuilder()
.setColor('#d3d3d3')
.setTitle('<:shield:1514699900225323108> Antinuke System')
.setDescription(
`<a:MekoLoading:1514728537452708022> **Available Antinuke Commands [15]**

,antinuke enable
> Enable and configure antinuke protection.

,antinuke disable
> Disable server protection.

,antinuke autorecovery
> Manage server autorecovery settings.

,antinuke betrayalguard
> Enable or disable betrayal guard.

,antinuke limit
> Set security limits.

,antinuke logging
> Set antinuke log channel.

,antinuke manage
> Manage all settings.

,antinuke reset
> Reset all data.

,antinuke whitelist
> Manage whitelist users.

,antinuke trustlimit
> Set trusted limits.

,antinuke wallon / walloff
> Toggle wall protection.

,antinuke wizard
> One-click setup.

,antinuke zplus
> Advanced protection system.`
)
.setFooter({
text: `Requested by ${message.author.username}`
});

const row = new ActionRowBuilder()
.addComponents(
new ButtonBuilder()
.setCustomId('delete')
.setEmoji('🗑️')
.setStyle(ButtonStyle.Danger)
);

const msg = await message.reply({
embeds: [embed],
components: [row]
});

const collector = msg.createMessageComponentCollector({
time: 300000
});

collector.on('collect', async interaction => {

if (interaction.user.id !== message.author.id) {
return interaction.reply({
embeds: [
new EmbedBuilder()
.setColor('#FF7F7F')
.setDescription("<a:spider_cross:1514728338701287640> This menu isn't yours.")
],
ephemeral: true
});
}

if (interaction.customId === 'delete') {
return msg.delete().catch(() => {});
}

});
return;
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
.setDescription(
`<:WarningIcon:1514708751385497721> Antinuke is already enabled in this server.

Use \`,antinuke manage\` to edit settings.`
)
]
});
}

// DEFAULT FILTERS
const filters = {
ban: true,
kick: true,
botadd: true,
channeldelete: true,
roledelete: true,
guildupdate: true,
webhook: true,
mention: true
};

// =========================
// SETUP EMBED
// =========================
const embed = new EmbedBuilder()
.setColor("#D3D3D3")
.setTitle("<:shield:1514699900225323108> Antinuke Setup")
.setDescription(
`Configure your server protection before enabling Antinuke.

<:on:1520340385451347968> Ban
<:on:1520340385451347968> Kick
<:on:1520340385451347968> Bot Add
<:on:1520340385451347968> Channel Delete
<:on:1520340385451347968> Role Delete
<:on:1520340385451347968> Guild Update
<:on:1520340385451347968> Webhook
<:on:1520340385451347968> Mention Spam`
);

// =========================
// DROPDOWN
// =========================
const menu = new StringSelectMenuBuilder()
.setCustomId("antinuke_menu")
.setPlaceholder("Toggle protections")
.addOptions([
{label:"Ban", value:"ban"},
{label:"Kick", value:"kick"},
{label:"Bot Add", value:"botadd"},
{label:"Channel Delete", value:"channeldelete"},
{label:"Role Delete", value:"roledelete"},
{label:"Guild Update", value:"guildupdate"},
{label:"Webhook", value:"webhook"},
{label:"Mention Spam", value:"mention"}
]);

// =========================
// BUTTONS
// =========================
const buttons = new ActionRowBuilder().addComponents(
new ButtonBuilder()
.setCustomId("save")
.setLabel("Save")
.setStyle(ButtonStyle.Success),

new ButtonBuilder()
.setCustomId("cancel")
.setLabel("Cancel")
.setStyle(ButtonStyle.Danger)
);

const rows = [
new ActionRowBuilder().addComponents(menu),
buttons
];

// =========================
// PANEL
// =========================
const panel = await message.reply({
embeds: [embed],
components: rows
});

// =========================
// DROPDOWN COLLECTOR
// =========================
const collector = panel.createMessageComponentCollector({
componentType: ComponentType.StringSelect,
time: 300000
});

collector.on("collect", async interaction => {

if (interaction.user.id !== message.author.id) {
return interaction.reply({
content: "This menu isn't yours.",
ephemeral: true
});
}

const value = interaction.values[0];

filters[value] = !filters[value];

embed.setDescription(
`Configure your server protection before enabling Antinuke.

${filters.ban ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Ban
${filters.kick ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Kick
${filters.botadd ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Bot Add
${filters.channeldelete ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Channel Delete
${filters.roledelete ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Role Delete
${filters.guildupdate ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Guild Update
${filters.webhook ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Webhook
${filters.mention ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Mention Spam`
);

await interaction.update({
embeds: [embed],
components: rows
});

});

// =========================
// BUTTON COLLECTOR
// =========================
const buttonCollector = panel.createMessageComponentCollector({
componentType: ComponentType.Button,
time: 300000
});

buttonCollector.on("collect", async interaction => {

if (interaction.user.id !== message.author.id) {
return interaction.reply({
embeds: [
new EmbedBuilder()
.setColor("#FF7F7F")
.setDescription("<a:spider_cross:1514728338701287640> This menu isn't yours.")
],
ephemeral: true
});
}

// CANCEL
if (interaction.customId === "cancel") {
return interaction.update({
embeds: [
new EmbedBuilder()
.setColor("#D3D3D3")
.setDescription("<a:spider_cross:1514728338701287640> Setup cancelled.")
],
components: []
});
}

// SAVE
if (interaction.customId === "save") {

await db.set(`antinuke_${message.guild.id}`, true);
await db.set(`antinuke_filters_${message.guild.id}`, filters);

return interaction.update({
embeds: [
new EmbedBuilder()
.setColor("#57F287")
.setTitle("<:shield:1514699900225323108> Antinuke Enabled")
.setDescription(
`<a:Animated_Tick:1514714209085292564> Settings saved successfully.

<:arrow:1514699753462566953> Your server is now protected.`
)
],
components: []
});
}

});

return;
}

// =========================
// DISABLE
// =========================
if (sub === "disable") {

await db.delete(`antinuke_${message.guild.id}`);
await db.delete(`antinuke_filters_${message.guild.id}`);
  
return message.reply({
embeds: [
new EmbedBuilder()
.setColor("#FF7F7F")
.setDescription("<:shield:1514699900225323108> Antinuke disabled in this server.")
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
.setDescription("<:WarningIcon:1514708751385497721> Antinuke is disabled in this server.")
]
});
}

const filters = await db.get(`antinuke_filters_${message.guild.id}`) || {
ban: true,
kick: true,
botadd: true,
channeldelete: true,
roledelete: true,
guildupdate: true,
webhook: true,
mention: true
};

const embed = new EmbedBuilder()
.setColor("#D3D3D3")
.setTitle("<:shield:1514699900225323108> Antinuke Manage Panel")
.setDescription(
`${filters.ban ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Ban
${filters.kick ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Kick
${filters.botadd ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Bot Add
${filters.channeldelete ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Channel Delete
${filters.roledelete ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Role Delete
${filters.guildupdate ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Guild Update
${filters.webhook ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Webhook
${filters.mention ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Mention Spam`
);

const menu = new StringSelectMenuBuilder()
.setCustomId("antinuke_menu")
.setPlaceholder("Toggle protections")
.addOptions([
{label:"Ban", value:"ban"},
{label:"Kick", value:"kick"},
{label:"Bot Add", value:"botadd"},
{label:"Channel Delete", value:"channeldelete"},
{label:"Role Delete", value:"roledelete"},
{label:"Guild Update", value:"guildupdate"},
{label:"Webhook", value:"webhook"},
{label:"Mention Spam", value:"mention"}
]);

const buttons = new ActionRowBuilder().addComponents(
new ButtonBuilder()
.setCustomId("save")
.setLabel("Save")
.setStyle(ButtonStyle.Success),

new ButtonBuilder()
.setCustomId("cancel")
.setLabel("Cancel")
.setStyle(ButtonStyle.Danger)
);

const rows = [
new ActionRowBuilder().addComponents(menu),
buttons
];

const panel = await message.reply({
embeds: [embed],
components: rows
});

const collector = panel.createMessageComponentCollector({
componentType: ComponentType.StringSelect,
time: 300000
});

collector.on("collect", async interaction => {

if (interaction.user.id !== message.author.id)
return interaction.reply({
embeds: [
new EmbedBuilder()
.setColor("#FF7F7F")
.setDescription("<a:spider_cross:1514728338701287640> This menu isn't yours.")
],
ephemeral: true
});
  
const value = interaction.values[0];
filters[value] = !filters[value];

embed.setDescription(
`${filters.ban ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Ban
${filters.kick ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Kick
${filters.botadd ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Bot Add
${filters.channeldelete ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Channel Delete
${filters.roledelete ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Role Delete
${filters.guildupdate ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Guild Update
${filters.webhook ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Webhook
${filters.mention ? "<:on:1520340385451347968>" : "<:off:1520340423829098597>"} Mention Spam`
);

await interaction.update({
embeds: [embed],
components: rows
});

});

const buttonCollector = panel.createMessageComponentCollector({
componentType: ComponentType.Button,
time: 300000
});

buttonCollector.on("collect", async interaction => {

if (interaction.user.id !== message.author.id)
return interaction.reply({ content: "This menu isn't yours.", ephemeral: true });

if (interaction.customId === "cancel") {
return interaction.update({
embeds: [
new EmbedBuilder()
.setColor("#D3D3D3")
.setDescription("<a:spider_cross:1514728338701287640> Changes cancelled.")
],
components: []
});
}

if (interaction.customId === "save") {

await db.set(`antinuke_filters_${message.guild.id}`, filters);

return interaction.update({
embeds: [
new EmbedBuilder()
.setColor("#57F287")
.setDescription("<a:Animated_Tick:1514714209085292564> Antinuke settings updated successfully.")
],
components: []
});
}

});

return;
}
