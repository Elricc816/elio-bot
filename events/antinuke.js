const db = require('../database');
const { EmbedBuilder } = require('discord.js');

// =========================
// WHITELIST FUNCTION
// =========================
async function isWhitelisted(db, guildId, userId) {
  const list = await db.get(`whitelist_${guildId}`) || [];
  return list.includes(userId);
}

module.exports = (client) => {

  // =========================
  // CHANNEL DELETE PROTECTION
  // =========================
  client.on("channelDelete", async (channel) => {

    const guild = channel.guild;
    if (!guild) return;

    const status = await db.get(`antinuke_${guild.id}`);
    if (!status) return;

    const logs = await guild.fetchAuditLogs({ type: 12, limit: 1 });
    const entry = logs.entries.first();
    if (!entry) return;

    const user = entry.executor;
    if (!user || user.bot) return;

    // ✅ WHITELIST CHECK (CORRECT PLACE)
    if (await isWhitelisted(db, guild.id, user.id)) return;

    const member = await guild.members.fetch(user.id).catch(() => null);
    if (!member) return;

    await member.ban({ reason: "Antinuke | Channel Delete" }).catch(() => {});
  });

  // =========================
  // ROLE DELETE PROTECTION
  // =========================
  client.on("roleDelete", async (role) => {

    const guild = role.guild;
    if (!guild) return;

    const status = await db.get(`antinuke_${guild.id}`);
    if (!status) return;

    const logs = await guild.fetchAuditLogs({ type: 32, limit: 1 });
    const entry = logs.entries.first();
    if (!entry) return;

    const user = entry.executor;
    if (!user || user.bot) return;

    // ✅ WHITELIST CHECK
    if (await isWhitelisted(db, guild.id, user.id)) return;

    const member = await guild.members.fetch(user.id).catch(() => null);
    if (!member) return;

    await member.ban({ reason: "Antinuke | Role Delete" }).catch(() => {});
  });

  // =========================
  // BOT ADD PROTECTION
  // =========================
  client.on("guildMemberAdd", async (member) => {

    const guild = member.guild;

    const status = await db.get(`antinuke_${guild.id}`);
    if (!status) return;

    if (!member.user.bot) return;

    const logs = await guild.fetchAuditLogs({ type: 28, limit: 1 });
    const entry = logs.entries.first();
    if (!entry) return;

    const user = entry.executor;
    if (!user || user.bot) return;

    // ✅ WHITELIST CHECK
    if (await isWhitelisted(db, guild.id, user.id)) return;

    const admin = await guild.members.fetch(user.id).catch(() => null);
    if (!admin) return;

    await admin.ban({ reason: "Antinuke | Unauthorized Bot Added" }).catch(() => {});
    await member.kick().catch(() => {});
  });

};
