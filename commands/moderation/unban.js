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

    let dmFailed = false;
    let username = "User";

    try {
      // fetch user for DM
      const user = await message.client.users.fetch(userId);
      username = user.tag;

      // DM attempt
      try {
        await user.send(
          `🔓 You have been unbanned from **${message.guild.name}** server`
        );
      } catch (err) {
        dmFailed = true;
      }

      // unban
      await message.guild.members.unban(userId);

      message.reply(
        `✅ Successfully unbanned **${username}**` +
        (dmFailed ? "\n⚠️ Could not DM user" : "")
      );

    } catch (err) {
      console.log(err);
      message.reply("❌ Failed to unban user (invalid ID or not banned)");
    }
  }
};
