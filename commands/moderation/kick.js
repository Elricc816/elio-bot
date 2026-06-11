module.exports = {
  name: "kick",
  async execute(message, args) {

    if (!message.member.permissions.has("KickMembers")) {
      return message.reply("❌ You don't have permission to kick members!");
    }

    const user = message.mentions.members.first();

    if (!user) {
      return message.reply("❌ Use: `!kick @user [reason]`");
    }

    if (user.id === message.author.id) {
      return message.reply("❌ You can't kick yourself!");
    }

    if (!user.kickable) {
      return message.reply("❌ I cannot kick this user!");
    }

    // optional reason
    const reason = args.slice(1).join(" ").trim();

    // DM message (conditional)
    try {
      if (reason) {
        await user.send(
          `👢 You have been kicked from **${message.guild.name}**\nReason: ${reason}`
        );
      } else {
        await user.send(
          `👢 You have been kicked from **${message.guild.name}**`
        );
      }
    } catch (err) {
      console.log("Could not DM user");
    }

    // kick with or without reason
    await user.kick(reason || "No reason provided");

    // server message
    message.reply(
      `👢 **${user.user.tag}** has been kicked` +
      (reason ? `\nReason: ${reason}` : "")
    );
  }
};
