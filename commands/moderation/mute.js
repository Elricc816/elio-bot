module.exports = {
  name: "mute",
  async execute(message, args) {

    if (!message.member.permissions.has("ModerateMembers")) {
      return message.reply("❌ You don't have permission to mute members!");
    }

    const user = message.mentions.members.first();

    // Expected format: !mute @user 10m
    const time = args[1];

    // ❌ Wrong format handler
    if (!user || !time) {
      return message.reply(
        "❌ Wrong format!\n" +
        "Correct usage:\n" +
        "`!mute @user 10m`\n" +
        "`!mute @user 1h`\n" +
        "`!mute @user 1d`"
      );
    }

    if (user.id === message.author.id) {
      return message.reply("❌ You can't mute yourself!");
    }

    if (!user.moderatable) {
      return message.reply("❌ I cannot mute this user!");
    }

    // Convert time to milliseconds
    let duration;

    if (time.endsWith("m")) {
      duration = parseInt(time) * 60 * 1000;
    } 
    else if (time.endsWith("h")) {
      duration = parseInt(time) * 60 * 60 * 1000;
    } 
    else if (time.endsWith("d")) {
      duration = parseInt(time) * 24 * 60 * 60 * 1000;
    } 
    else {
      return message.reply(
        "❌ Invalid time format!\nUse: `10m`, `1h`, `1d`"
      );
    }

    try {
      await user.timeout(duration, "Muted by Elio bot");

      message.reply(
        `🔇 **${user.user.tag}** muted for **${time}**`
      );
    } catch (err) {
      console.log(err);
      message.reply("❌ Failed to mute user");
    }
  }
};
