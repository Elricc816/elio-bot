module.exports = {
  name: "unban",
  async execute(message, args) {

    if (!message.member.permissions.has("BanMembers")) {
      return message.reply("❌ You don't have permission to unban users!");
    }

    const userId = args[0];

    // wrong format check
    if (!userId) {
      return message.reply(
        "❌ Wrong format!\nUse:\n`!unban <userID>`"
      );
    }

    try {
      await message.guild.members.unban(userId);
      message.reply(`✅ Successfully unbanned user ID: **${userId}**`);
    } catch (err) {
      console.log(err);
      message.reply("❌ Failed to unban user (invalid ID or not banned)");
    }
  }
};
