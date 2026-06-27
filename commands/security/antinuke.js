const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

// =========================
// WHITELIST CHECK
// =========================
async function isWhitelisted(db, guildId, userId) {
  const list = await db.get(`whitelist_${guildId}`) || [];
  return list.includes(userId);
}

// =========================
// PERMISSION CHECK
// =========================
function hasPerm(member) {
  return member.permissions.has(PermissionsBitField.Flags.Administrator) ||
         member.permissions.has(PermissionsBitField.Flags.ManageGuild);
}

module.exports = (client) => {

  // =========================
  // CHANNEL DELETE
  // =========================
  client.on("channelDelete", async (channel) => {

    const guild = channel.guild;
    if (!guild) return;

    const enabled = await db.get(`antinuke_${guild.id}`);
    if (!enabled) return;

    const filters = await db.get(`antinuke_filters_${guild.id}`);
    if (!filters?.channeldelete) return;

    const logs = await guild.fetchAuditLogs({ type: 12, limit: 1 });
    const entry = logs.entries.first();
    if (!entry) return;

    const user = entry.executor;
    if (!user || user.bot) return;

    const member = await guild.members.fetch(user.id).catch(() => null);
    if (!member) return;

    if (!hasPerm(member)) return;
    if (await isWhitelisted(db, guild.id, user.id)) return;

    await member.ban({ reason: "Antinuke | Channel Delete" }).catch(() => {});
  });

  // =========================
  // ROLE DELETE
  // =========================
  client.on("roleDelete", async (role) => {

    const guild = role.guild;
    if (!guild) return;

    const enabled = await db.get(`antinuke_${guild.id}`);
    if (!enabled) return;

    const filters = await db.get(`antinuke_filters_${guild.id}`);
    if (!filters?.roledelete) return;

    const logs = await guild.fetchAuditLogs({ type: 32, limit: 1 });
    const entry = logs.entries.first();
    if (!entry) return;

    const user = entry.executor;
    if (!user || user.bot) return;

    const member = await guild.members.fetch(user.id).catch(() => null);
    if (!member) return;

    if (!hasPerm(member)) return;
    if (await isWhitelisted(db, guild.id, user.id)) return;

    await member.ban({ reason: "Antinuke | Role Delete" }).catch(() => {});
  });

  // =========================
  // BOT ADD
  // =========================
  client.on("guildMemberAdd", async (member) => {

    const guild = member.guild;

    const enabled = await db.get(`antinuke_${guild.id}`);
    if (!enabled) return;

    const filters = await db.get(`antinuke_filters_${guild.id}`);
    if (!filters?.botadd) return;

    if (!member.user.bot) return;

    const logs = await guild.fetchAuditLogs({ type: 28, limit: 1 });
    const entry = logs.entries.first();
    if (!entry) return;

    const user = entry.executor;
    if (!user || user.bot) return;

    const admin = await guild.members.fetch(user.id).catch(() => null);
    if (!admin) return;

    if (!hasPerm(admin)) return;
    if (await isWhitelisted(db, guild.id, user.id)) return;

    await admin.ban({ reason: "Antinuke | Unauthorized Bot Added" }).catch(() => {});
    await member.kick().catch(() => {});
  });

};
