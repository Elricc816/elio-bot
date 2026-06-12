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
        .setColor('#D3D3D3')
        .setTitle('<:shield:1514699900225323108> Antinuke')
        .setDescription(
`<a:MekoLoading:1514728537452708022> **Available Antinuke Commands**

\`,antinuke enable\`
> Enable antinuke.

\`,antinuke disable\`
> Disable antinuke.

\`,antinuke logging\`
> Configure logs.

\`,antinuke whitelist\`
> Manage whitelist.

\`,antinuke trustlimit\`
> Configure trusted limits.

\`,antinuke autorecovery\`
> Configure autorecovery.

\`,antinuke wizard\`
> Setup wizard.

\`,antinuke reset\`
> Reset settings.`
        )
        .setFooter({
          text: `Page 1/1 | Requested By ${message.author.username}`
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
