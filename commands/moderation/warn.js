const warns = new Map();

module.exports = {
  name: "warn",
  async execute(message, args) {

    const requiredRole = "Moderator";

    const hasRole = message.member.roles.cache.some(r => r.name === requiredRole);
    const isAdmin = message.member.permissions.has("Administrator");

    if (!hasRole && !isAdmin) {
      return message.reply(
        `❌ You need **${requiredRole} role** or Admin permission to warn users!`
      );
    }

    const user = message.mentions.members.first();

    if (!user) {
      return message.reply("❌ Use: `!warn @user reason`");
    }

    const reason = args.slice(1).join(" ") || "No reason provided";

    if (!warns.has(user.id)) {
      warns.set(user.id, []);
    }

    warns.get(user.id).push({
      reason,
      moderator: message.author.tag,
      time: Date.now()
    });

    // DM the user
    try {
      await user.send(
        `⚠️ You have been warned in **${message.guild.name}**\nReason: ${reason}`
      );
    } catch (err) {
      console.log("Could not DM user");
    }

    // Channel message
    message.reply(
      `⚠️ **${user.user.tag}** has been warned\nReason: ${reason}`
    );
  }
};
