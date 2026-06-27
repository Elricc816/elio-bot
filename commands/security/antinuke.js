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
.setDescription("Cooldown `" + timeLeft + "s`")
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
.setDescription("You need Administrator permission.")
]
});
}

// =========================
// HELP MENU (FULL COMMAND LIST)
// =========================
if (!sub) {

const embed = new EmbedBuilder()
.setColor('#d3d3d3')
.setTitle('<:shield:1514699900225323108> Antinuke System')
.setDescription(
`<a:MekoLoading:1514728537452708022> **Available Antinuke Commands [13]**

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

const row = new ActionRowBuilder().addComponents(
new ButtonBuilder()
.setCustomId("delete")
.setEmoji("🗑️")
.setStyle(ButtonStyle.Danger)
);

const msg = await message.reply({
embeds: [embed],
components: [row]
});

const collector = msg.createMessageComponentCollector({
time: 300000
});

collector.on("collect", async (interaction) => {

if (interaction.user.id !== message.author.id) {
return interaction.reply({
embeds: [
new EmbedBuilder()
.setColor("#FF7F7F")
.setDescription("This menu isn't yours.")
],
ephemeral: true
});
}

if (interaction.customId === "delete") {
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
.setDescription("Antinuke is already enabled. Use `,antinuke manage`.")
]
});
}

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

const embed = new EmbedBuilder()
.setColor("#D3D3D3")
.setTitle("Antinuke Setup Panel")
.setDescription("Select protections below and press Save.");

const menu = new StringSelectMenuBuilder()
.setCustomId("antinuke_menu")
.setPlaceholder("Toggle protections")
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
.setLabel("Save")
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

const collector = msg.createMessageComponentCollector({
componentType: ComponentType.StringSelect,
time: 300000
});

collector.on("collect", async (interaction) => {

if (interaction.user.id !== message.author.id) {
return interaction.reply({ content: "Not yours", ephemeral: true });
}

let filtersDB = await db.get(`antinuke_filters_${message.guild.id}`) || filters;

const value = interaction.values[0];
filtersDB[value] = !filtersDB[value];

await db.set(`antinuke_filters_${message.guild.id}`, filtersDB);

await interaction.update({
embeds: [embed],
components: [row1, row2]
});
});

const btn = msg.createMessageComponentCollector({
componentType: ComponentType.Button,
time: 300000
});

btn.on("collect", async (interaction) => {

if (interaction.user.id !== message.author.id) {
return interaction.reply({ content: "Not yours", ephemeral: true });
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
.setTitle("Antinuke Enabled")
.setDescription("Settings saved. Server protected.")
],
components: []
});
}
});

return;
}

// =========================
// DISABLE (WITH CONFIRMATION)
// =========================
if (sub === "disable") {

const enabled = await db.get(`antinuke_${message.guild.id}`);

if (!enabled) {
return message.reply({
embeds: [
new EmbedBuilder()
.setColor("#FF7F7F")
.setDescription("Antinuke is already disabled.")
]
});
}

const row = new ActionRowBuilder().addComponents(
new ButtonBuilder()
.setCustomId("yes_disable")
.setLabel("Yes")
.setStyle(ButtonStyle.Danger),

new ButtonBuilder()
.setCustomId("no_disable")
.setLabel("No")
.setStyle(ButtonStyle.Secondary)
);

const msg = await message.reply({
embeds: [
new EmbedBuilder()
.setColor("#FFCC66")
.setDescription("Are you sure you want to disable Antinuke?")
],
components: [row]
});

const collector = msg.createMessageComponentCollector({
componentType: ComponentType.Button,
time: 30000
});

collector.on("collect", async (interaction) => {

if (interaction.user.id !== message.author.id) {
return interaction.reply({ content: "Not yours", ephemeral: true });
}

if (interaction.customId === "no_disable") {
return msg.delete().catch(() => {});
}

if (interaction.customId === "yes_disable") {

await db.delete(`antinuke_${message.guild.id}`);
await db.delete(`antinuke_filters_${message.guild.id}`);

return interaction.update({
embeds: [
new EmbedBuilder()
.setColor("#FF7F7F")
.setDescription("Antinuke disabled.")
],
components: []
});
}
});

return;
}

// =========================
// MANAGE (WITH DROPDOWN)
// =========================
if (sub === "manage") {

const enabled = await db.get(`antinuke_${message.guild.id}`);

if (!enabled) {
return message.reply("Antinuke is not enabled.");
}

let filters = await db.get(`antinuke_filters_${message.guild.id}`) || {};

const embed = new EmbedBuilder()
.setColor("#D3D3D3")
.setTitle("Antinuke Settings")
.setDescription(
`${filters.ban ? "🟢" : "🔴"} Ban\n` +
`${filters.kick ? "🟢" : "🔴"} Kick\n` +
`${filters.botadd ? "🟢" : "🔴"} Bot Add\n` +
`${filters.channeldelete ? "🟢" : "🔴"} Channel Delete\n` +
`${filters.roledelete ? "🟢" : "🔴"} Role Delete\n` +
`${filters.guildupdate ? "🟢" : "🔴"} Guild Update\n` +
`${filters.webhook ? "🟢" : "🔴"} Webhook\n` +
`${filters.mention ? "🟢" : "🔴"} Mention Spam`
);

const menu = new StringSelectMenuBuilder()
.setCustomId("manage_menu")
.setPlaceholder("Toggle settings")
.addOptions([
{ label: "Ban", value: "ban" },
{ label: "Kick", value: "kick" },
{ label: "Bot Add", value: "botadd" },
{ label: "Channel Delete", value: "channeldelete" },
{ label: "Role Delete", value: "roledelete" },
{ label: "Guild Update", value: "guildupdate" },
{ label: "Webhook", value: "webhook" },
{ label: "Mention", value: "mention" }
]);

const row = new ActionRowBuilder().addComponents(menu);

const msg = await message.reply({
embeds: [embed],
components: [row]
});

const collector = msg.createMessageComponentCollector({
componentType: ComponentType.StringSelect,
time: 300000
});

collector.on("collect", async (interaction) => {

if (interaction.user.id !== message.author.id) {
return interaction.reply({ content: "Not yours", ephemeral: true });
}

let data = await db.get(`antinuke_filters_${message.guild.id}`) || {};

const value = interaction.values[0];
data[value] = !data[value];

await db.set(`antinuke_filters_${message.guild.id}`, data);

return interaction.update({
embeds: [embed],
components: [row]
});
});

return;
}

}
};
