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

    try {
      await user.timeout(null);
      message.reply(`🔊 Successfully unmuted **${user.user.tag}**`);
    } catch (err) {
      console.log(err);
      message.reply("❌ Failed to unmute user");
    }
  }
};
