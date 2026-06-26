const db = require('../database');
const { EmbedBuilder } = require('discord.js');

module.exports = async (client) => {

  client.on("channelDelete", async (channel) => {

    const guild = channel.guild;
    if (!guild) return;

    const status = await db.get(`antinuke_${guild.id}`);
    if (!status) return;

    const logs = await guild.fetchAuditLogs({ type: 12, limit: 1 });
    const entry = logs.entries.first();
    if (!entry) return;

    const user = entry.executor;

    if (user.bot) return;

    const member = await guild.members.fetch(user.id).catch(() => null);
    if (!member) return;

    // ❌ ACTION (punish)
    member.ban({ reason: "Antinuke | Channel Delete" }).catch(() => {});
  });

};
