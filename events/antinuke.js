const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { AuditLogEvent } = require("discord.js");

module.exports = (client) => {

    // ==========================================
    // HELPER: VERIFY IF PROTECTION IS ACTIVE
    // ==========================================
    async function shouldAction(guild, filterType, executorId) {
        // 1. Is global antinuke on?
        const isEnabled = await db.get(`antinuke_${guild.id}`);
        if (!isEnabled) return false;

        // 2. Is this specific filter active?
        const filters = await db.get(`antinuke_filters_${guild.id}`);
        if (!filters || filters[filterType] !== true) return false;

        // 3. Bypass if the executor is the Server Owner or the Bot itself
        if (executorId === guild.ownerId || executorId === client.user.id) return false;

        // 4. Bypass if the user is custom whitelisted
        const isWhitelisted = await db.get(`antinuke_whitelist_${guild.id}_${executorId}`);
        if (isWhitelisted) return false;

        return true;
    }

    // ==========================================
    // HELPER: PUNISH THE ROUGE ADMIN
    // ==========================================
    async function punishExecutor(guild, executorId, reason) {
        const member = await guild.members.fetch(executorId).catch(() => null);
        if (!member) return;

        // Attempt to ban the nuker. If hierarchy blocks it, strip all their roles instead.
        await member.ban({ reason: `Antinuke: ${reason}` }).catch(async () => {
            await member.roles.set([], `Antinuke: Failed to ban, stripped all roles instead.`).catch(() => {});
        });
    }


    // ==========================================
    // 1. WATCHING BAN LOGS (guildBanAdd)
    // ==========================================
    client.on("guildBanAdd", async (ban) => {
        const guild = ban.guild;

        // Fetch the audit log entry for the ban
        const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberBanAdd }).catch(() => null);
        if (!fetchedLogs) return;
        const logEntry = fetchedLogs.entries.first();
        if (!logEntry) return;

        const { executor, target } = logEntry;

        // Check if we should act
        if (!(await shouldAction(guild, "ban", executor.id))) return;

        // REVERSE THE DAMAGE: Unban the victim
        await guild.members.unban(target.id, "Antinuke: Reversing illegal ban").catch(() => {});

        // PUNISH NUKER
        await punishExecutor(guild, executor.id, "Rogue Admin Mass Banning");
    });


    // ==========================================
    // 2. WATCHING CHANNEL DELETIONS (channelDelete)
    // ==========================================
    client.on("channelDelete", async (channel) => {
        const guild = channel.guild;
        if (!guild) return;

        const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.ChannelDelete }).catch(() => null);
        if (!fetchedLogs) return;
        const logEntry = fetchedLogs.entries.first();
        if (!logEntry) return;

        const { executor } = logEntry;

        if (!(await shouldAction(guild, "channeldelete", executor.id))) return;

        // REVERSE THE DAMAGE: Re-create the deleted channel
        await channel.clone({ reason: "Antinuke: Restoring deleted channel" }).catch(() => {});

        // PUNISH NUKER
        await punishExecutor(guild, executor.id, "Rogue Admin Deleting Channels");
    });


    // ==========================================
    // 3. WATCHING ROLE DELETIONS (roleDelete)
    // ==========================================
    client.on("roleDelete", async (role) => {
        const guild = role.guild;

        const fetchedLogs = await guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.RoleDelete }).catch(() => null);
        if (!fetchedLogs) return;
        const logEntry = fetchedLogs.entries.first();
        if (!logEntry) return;

        const { executor } = logEntry;

        if (!(await shouldAction(guild, "roledelete", executor.id))) return;

        // REVERSE THE DAMAGE: Re-create the deleted role
        await guild.roles.create({
            name: role.name,
            color: role.color,
            hoist: role.hoist,
            permissions: role.permissions,
            mentionable: role.mentionable,
            reason: "Antinuke: Restoring deleted role"
        }).catch(() => {});

        // PUNISH NUKER
        await punishExecutor(guild, executor.id, "Rogue Admin Deleting Roles");
    });

};
