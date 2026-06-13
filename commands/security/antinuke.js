const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

module.exports = {
  name: "antinuke",

  async execute(message) {

    const pages = [

      new EmbedBuilder()
        .setColor('#D3D3D3')
        .setTitle('<:shield:1514699900225323108> Antinuke')
.setDescription(
`<a:MekoLoading:1514728537452708022> **Available Antinuke Commands [15]**

,antinuke autorecovery
> Manage server autorecovery settings.

,antinuke betrayalguard
> Enable or disable betrayal guard for whitelisted users.

,antinuke disable
> Disable antinuke on the server.

,antinuke enable
> Enable and configure antinuke on the server.

,antinuke limit
> Set limits and heat for antinuke filters.

,antinuke logdisable
> Disable antinuke logging.`
)
        
        .setFooter({
          text: `Page 1/3 | Requested By ${message.author.username}`
        }),

      new EmbedBuilder()
        .setColor('#D3D3D3')
        .setTitle('<:shield:1514699900225323108> Antinuke')
        .setDescription(
`,antinuke logging
> Set the channel for antinuke logs.

,antinuke manage
> Manage all antinuke settings.

,antinuke reset
> Reset all antinuke data for the server.

,antinuke trustlimit
> Set limits for extraowners and whitelisted users.

,antinuke walloff
> Disable wall role protection.

,antinuke wallon
> Enable wall role protection.

,antinuke whitelist
> Manage antinuke whitelist.`
        )
        .setFooter({
          text: `Page 2/3 | Requested By ${message.author.username}`
        }),

      new EmbedBuilder()
        .setColor('#D3D3D3')
        .setTitle('<:shield:1514699900225323108> Antinuke')
        .setDescription(
`,antinuke wizard
> One-click setup for antinuke.

,antinuke zplus
> Configure advanced Z+ protection.`
        )
        .setFooter({
          text: `Page 3/3 | Requested By ${message.author.username}`
        })

    ];

    let page = 0;

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('first')
          .setEmoji('⏪')
          .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
          .setCustomId('previous')
          .setEmoji('◀️')
          .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
          .setCustomId('delete')
          .setEmoji('🗑️')
          .setStyle(ButtonStyle.Danger),

        new ButtonBuilder()
          .setCustomId('next')
          .setEmoji('▶️')
          .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
          .setCustomId('last')
          .setEmoji('⏩')
          .setStyle(ButtonStyle.Secondary)
      );

    const msg = await message.reply({
      embeds: [pages[page]],
      components: [row]
    });

    const collector = msg.createMessageComponentCollector({
      time: 300000
    });

    collector.on('collect', async interaction => {

      if (interaction.user.id !== message.author.id) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor('#FF7F7F')
              .setDescription(
                "<a:spider_cross:1514728338701287640> This menu isn't yours."
              )
          ],
          ephemeral: true
        });
      }

      if (interaction.customId === 'first') page = 0;
      if (interaction.customId === 'previous') page = page > 0 ? page - 1 : 0;
      if (interaction.customId === 'next') page = page < pages.length - 1 ? page + 1 : pages.length - 1;
      if (interaction.customId === 'last') page = pages.length - 1;

      if (interaction.customId === 'delete') {
        return msg.delete().catch(() => {});
      }

      await interaction.update({
        embeds: [pages[page]],
        components: [row]
      });

    });

  }
};
