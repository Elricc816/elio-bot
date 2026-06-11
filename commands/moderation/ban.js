module.exports = {
  name: "ban",
  async execute(message, args) {

    if (!message.member.permissions.has("BanMembers")) {
      return message.reply("❌ You don't have permission to ban members!");
    }

    const user = message.mentions.members.first();

    if (!user) {
      return message.reply("❌ Please mention a user to ban!");
    }

    if (user.id === message.author.id) {
      return message.reply("❌ You can't ban yourself!");
    }

    if (!user.bannable) {
      return message.reply("❌ I cannot ban this user!");
    }

    // optional reason
    const reason = args.slice(1).join(" ");

    let dmFailed = false;

    // DM user before ban
    try {
      await user.send(
        reason
          ? `🔨 You have been banned from **${message.guild.name}** server\nReason: ${reason}`
          : `🔨 You have been banned from **${message.guild.name}** server`
      );
    } catch (err) {
      dmFailed = true;
    }

    // ban user
    await user.ban({ reason: reason || "No reason provided" });

    // server reply
    message.reply(
      `🔨 Successfully banned **${user.user.tag}**` +
      (reason ? `\nReason: ${reason}` : "") +
      (dmFailed ? "\n⚠️ Could not DM user" : "")
    );
  }
};
