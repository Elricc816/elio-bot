const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  name: "antinuke",

  async execute(message, args) {

    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF7F7F')
            .setDescription('❌ You need Administrator permission to use this command.')
        ]
      });
    }

    const sub = args[0]?.toLowerCase();

    if (!sub) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#d3d3d3')
            .setTitle('🛡️ Antinuke')
            .setDescription(
              '**Available Commands**\n\n' +
              '`,antinuke enable`\n' +
              '`,antinuke disable`'
            )
            .setFooter({
              text: 'Built By Elric </>'
            })
        ]
      });
    }

    if (sub === 'enable') {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#57F287')
            .setDescription('✅ Antinuke has been enabled.')
        ]
      });
    }

    if (sub === 'disable') {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#ED4245')
            .setDescription('❌ Antinuke has been disabled.')
        ]
      });
    }

    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor('#FF7F7F')
          .setDescription('❌ Unknown subcommand.')
      ]
    });
  }
};
