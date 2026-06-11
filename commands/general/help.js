const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "help",
  execute(message) {
    const embed = new EmbedBuilder()
      .setColor(0x00AEFF)
      .setTitle("🤖 Elio Bot Command Menu")
      .setDescription("Here are all available command categories:")
      .addFields(
        {
          name: "🎉 Fun",
          value: "`!ping` - Check bot response"
        },
        {
          name: "🌐 General",
          value: "`!help` - Show this menu"
        },
        {
          name: "🛡️ Moderation",
          value: "kick, ban, mute (coming soon)"
        },
        {
          name: "🎁 Giveaway",
          value: "start, reroll (coming soon)"
        },
        {
          name: "🤖 Automod",
          value: "anti-link, anti-spam (coming soon)"
        }
      )
      .setFooter({ text: "Elio Bot • Running 24/7" });

    message.reply({ embeds: [embed] });
  }
};
