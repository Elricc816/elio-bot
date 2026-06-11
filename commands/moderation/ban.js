module.exports = {
  name: "ban",
  execute(message, args) {

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

    user.ban();

    message.reply(`🔨 Successfully banned **${user.user.tag}**`);
  }
};
