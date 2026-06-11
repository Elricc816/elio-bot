module.exports = {
  name: "unmute",
  async execute(message, args) {

    if (!message.member.permissions.has("ModerateMembers")) {
      return message.reply("❌ You don't have permission to unmute users!");
    }

    const user = message.mentions.members.first();

    if (!user) {
      return message.reply(
        "❌ Wrong format!\nUse:\n`!unmute @user`"
      );
    }

    if (!user.isCommunicationDisabled()) {
      return message.reply("❌ This user is not muted!");
    }

    // 🔊 DM USER FIRST
    try {
      await user.send(
        `🔊 You have been unmuted from **${message.guild.name}** server`
      );
    } catch (err) {
      console.log("Could not DM user");
    }

    // 🔓 UNMUTE
    try {
      await user.timeout(null);
      message.reply(`🔊 Successfully unmuted **${user.user.tag}**`);
    } catch (err) {
      console.log(err);
      message.reply("❌ Failed to unmute user");
    }
  }
};
