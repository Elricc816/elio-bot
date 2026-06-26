const db = require('../../database');
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const cooldown = new Map();
module.exports = {
  name: "antinuke",

  async execute(message, args) {
    
    const cooldownTime = 3000;

    if (cooldown.has(message.author.id)) {
      const timeLeft = (
        (cooldown.get(message.author.id) - Date.now()) / 1000
      ).toFixed(1);

      if (timeLeft > 0) {

        const cooldownMsg = await message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor('#FF7F7F')
              .setDescription(
`<:WarningIcon:1514708751385497721> You are under cooldown to this command!

<:arrow:1514699753462566953> Cooldown ~ \`${timeLeft}s\``
              )
          ]
        });

        setTimeout(() => {
          cooldownMsg.delete().catch(() => {});
        }, 2000);

        return;
      }
    }

    cooldown.set(message.author.id, Date.now() + cooldownTime);

    setTimeout(() => {
      cooldown.delete(message.author.id);
    }, cooldownTime);
    const sub = args[0]?.toLowerCase();

if (sub === "enable") {

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("antinuke_yes")
        .setLabel("Yes")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("antinuke_no")
        .setLabel("No")
        .setStyle(ButtonStyle.Danger)
    );

  const confirm = await message.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("#D3D3D3")
        .setTitle("Antinuke Enable?")
        .setDescription("Are you sure you want to ENABLE antinuke?")
    ],
    components: [row]
  });

  const collector = confirm.createMessageComponentCollector({
    time: 60000
  });

  collector.on("collect", async (interaction) => {

    if (interaction.user.id !== message.author.id) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF7F7F")
            .setDescription("Not your button")
        ],
        ephemeral: true
      });
    }

    if (interaction.customId === "antinuke_yes") {

      await db.set(`antinuke_${message.guild.id}`, true);

      return interaction.update({
        embeds: [
          new EmbedBuilder()
            .setColor("#57F287")
            .setDescription("Antinuke Enabled ✅")
        ],
        components: []
      });
    }

    if (interaction.customId === "antinuke_no") {

      return interaction.update({
        embeds: [
          new EmbedBuilder()
            .setColor("#D3D3D3")
            .setDescription("Cancelled ❌")
        ],
        components: []
      });
    }

  });

  return;
}

confirmCollector.on("collect", async interaction => {

  if (interaction.user.id !== message.author.id) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor("#FF7F7F")
          .setDescription(
            "<a:spider_cross:1514728338701287640> This interaction isn't yours."
          )
      ],
      ephemeral: true
    });
  }

  if (interaction.customId === "antinuke_yes") {

    await db.set(`antinuke_${message.guild.id}`, true);

    return interaction.update({
      embeds: [
        new EmbedBuilder()
          .setColor("#57F287")
          .setTitle("<:shield:1514699900225323108> Antinuke Enabled")
          .setDescription(
`<a:Animated_Tick:1514714209085292564> Successfully enabled Antinuke for this server.`
          )
      ],
      components: []
    });
  }

  if (interaction.customId === "antinuke_no") {

    return interaction.update({
      embeds: [
        new EmbedBuilder()
          .setColor("#D3D3D3")
          .setTitle("<:info:1514699288674828310> Action Cancelled")
          .setDescription(
`<a:spider_cross:1514728338701287640> Antinuke enabling has been cancelled.`
          )
      ],
      components: []
    });
  }

});
  
    embeds: [
      new EmbedBuilder()
        .setColor("#D3D3D3")
        .setTitle("<:shield:1514699900225323108> Antinuke Confirmation")
        .setDescription(
`<:WarningIcon:1514708751385497721> Are you sure you want to enable Antinuke in this server?

<:arrow:1514699753462566953> This will enable Elio's antinuke protection.`
        )
    ],
    components: [row]
  });

  return;
}

if (sub === "disable") {

  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId("antinuke_disable_yes")
        .setLabel("Yes")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("antinuke_disable_no")
        .setLabel("No")
        .setStyle(ButtonStyle.Danger)
    );

  const confirm = await message.reply({
    embeds: [
      new EmbedBuilder()
        .setColor("#D3D3D3")
        .setTitle("Disable Antinuke?")
        .setDescription("Are you sure you want to DISABLE antinuke?")
    ],
    components: [row]
  });

  const collector = confirm.createMessageComponentCollector({
    time: 60000
  });

  collector.on("collect", async (interaction) => {

    if (interaction.user.id !== message.author.id) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF7F7F")
            .setDescription("Not your button")
        ],
        ephemeral: true
      });
    }

    if (interaction.customId === "antinuke_disable_yes") {

      await db.set(`antinuke_${message.guild.id}`, false);

      return interaction.update({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF7F7F")
            .setDescription("Antinuke Disabled ❌")
        ],
        components: []
      });
    }

    if (interaction.customId === "antinuke_disable_no") {

      return interaction.update({
        embeds: [
          new EmbedBuilder()
            .setColor("#D3D3D3")
            .setDescription("Cancelled")
        ],
        components: []
      });
    }

  });

  return;
        }

    embeds: [
      new EmbedBuilder()
        .setColor('#FF7F7F')
        .setDescription(
          '<a:spider_cross:1514728338701287640> Antinuke has been disabled.'
        )
    ]
  });

}

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
