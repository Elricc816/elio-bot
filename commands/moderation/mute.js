module.exports = {
  name: "mute",
  execute(message, args) {

    if (!message.member.permissions.has("ModerateMembers")) {
      return message.reply("❌ You don't have permission to mute members!");
    }

    const user = message.mentions.members.first();
    if (!user) {
      return message.reply("❌ Please mention a user to mute!");
    }

    let role = message.guild.roles.cache.find(r => r.name === "Muted");

    if (!role) {
      return message.reply("❌ No 'Muted' role found! Create it first.");
    }

    user.roles.add(role);

    message.reply(`🔇 Muted **${user.user.tag}**`);
  }
};
