const db = require('quick.db');
const { EmbedBuilder } = require('discord.js');

// =========================
// WHITELIST FUNCTION
// =========================
async function isWhitelisted(db, guildId, userId) {
  const list = (await db.get(`whitelist_${guildId}`)) || [];
  return list.includes(userId);
}

// =========================
// COOLDOWN (ANTI SPAM PROTECTION)
// =========================
const punishCooldown = new Map();

module.exports = (client) => {

  // =========================
  // CHANNEL DELETE PROTECTION
  // =========================
  client.on("channelDelete", async (channel) => {
    try {
      const guild = channel.guild;
      if (!guild) return;

      const status = await db.get(`antinuke_${guild.id}`);
      if (!status) return;

      const logs = await guild.fetchAuditLogs({ type: 12, limit: 1 });
      const entry = logs.entries.first();
      if (!entry) return;

      const user = entry.executor;
      if (!user || user.bot) return;

      const member = await guild.members.fetch(user.id).catch(() => null);
      if (!member) return;

      // whitelist check AFTER validation
      if (await isWhitelisted(db, guild.id, user.id)) return;

      // anti spam protection
      if (punishCooldown.has(user.id)) return;
      punishCooldown.set(user.id, true);
      setTimeout(() => punishCooldown.delete(user.id), 5000);

      await member.ban({ reason: "Antinuke | Channel Delete" }).catch(() => {});
    } catch (err) {
      console.error("ChannelDelete Antinuke Error:", err);
    }
  });

  // =========================
  // ROLE DELETE PROTECTION
  // =========================
  client.on("roleDelete", async (role) => {
    try {
      const guild = role.guild;
      if (!guild) return;

      const status = await db.get(`antinuke_${guild.id}`);
      if (!status) return;

      const logs = await guild.fetchAuditLogs({ type: 32, limit: 1 });
      const entry = logs.entries.first();
      if (!entry) return;

      const user = entry.executor;
      if (!user || user.bot) return;

      const member = await guild.members.fetch(user.id).catch(() => null);
      if (!member) return;

      if (await isWhitelisted(db, guild.id, user.id)) return;

      if (punishCooldown.has(user.id)) return;
      punishCooldown.set(user.id, true);
      setTimeout(() => punishCooldown.delete(user.id), 5000);

      await member.ban({ reason: "Antinuke | Role Delete" }).catch(() => {});
    } catch (err) {
      console.error("RoleDelete Antinuke Error:", err);
    }
  });

  // =========================
  // BOT ADD PROTECTION
  // =========================
  client.on("guildMemberAdd", async (member) => {
    try {
      const guild = member.guild;
      if (!guild) return;

      if (!member.user.bot) return;

      const status = await db.get(`antinuke_${guild.id}`);
      if (!status) return;

      const logs = await guild.fetchAuditLogs({ type: 28, limit: 1 });
      const entry = logs.entries.first();
      if (!entry) return;

      const user = entry.executor;
      if (!user || user.bot) return;

      const admin = await guild.members.fetch(user.id).catch(() => null);
      if (!admin) return;

      if (await isWhitelisted(db, guild.id, user.id)) return;

      if (punishCooldown.has(user.id)) return;
      punishCooldown.set(user.id, true);
      setTimeout(() => punishCooldown.delete(user.id), 5000);

      await admin.ban({ reason: "Antinuke | Unauthorized Bot Added" }).catch(() => {});
      await member.kick().catch(() => {});
    } catch (err) {
      console.error("GuildMemberAdd Antinuke Error:", err);
    }
  });

};
