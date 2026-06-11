module.exports = {
  name: "kick",
  execute(message, args) {

    // Permission check
    if (!message.member.permissions.has("KickMembers")) {
      return message.reply("❌ You don't have permission to kick members!");
    }

    // Get mentioned user
    const user = message.mentions.members.first();
    if (!user) {
      return message.reply("❌ Please mention a user to kick!");
    }

    // Prevent self kick / bot kick
    if (user.id === message.author.id) {
      return message.reply("❌ You can't kick yourself!");
    }

    if (!user.kickable) {
      return message.reply("❌ I cannot kick this user!");
    }

    // Kick user
    user.kick();

    message.reply(`👢 Successfully kicked **${user.user.tag}**`);
  }
};
