const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require('discord.js');

const cooldown = new Set();

module.exports = {
  name: "help",
  async execute(message, args, client) {

    if (cooldown.has(message.author.id)) {
      const cooldownMsg = await message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF7F7F')
            .setDescription(
`<:WarningIcon:1514708751385497721> You are under cooldown to this command!

<:arrow:1514699753462566953> Cooldown ~ \`5s\``
            )
        ]
      });

      setTimeout(() => {
        cooldownMsg.delete().catch(() => {});
      }, 2000);

      return;
    }

    cooldown.add(message.author.id);
    setTimeout(() => cooldown.delete(message.author.id), 5000);

    const heartbeat = Date.now() - message.createdTimestamp;
    const api = Math.round(client.ws.ping);

    // MAIN HELP EMBED
    const embed = new EmbedBuilder()
      .setColor('#d3d3d3')
      .setDescription(
`### Hey , I'm **Elio**

<:white_arrow:1514714190231769219> **I'm a powerful Discord bot built for moderation, security, automation, and server management.**

<a:BlackDot:1514727923175657654> **Current Prefix:** \`,\`
<a:BlackDot:1514727923175657654> **Use \`,help <category>\`**

**<:rocket:1514699262527541490> Quick Stats**
<:arrow:1514699753462566953> Heartbeat: ${heartbeat} ms
<:arrow:1514699753462566953> API: ${api} ms
<:arrow:1514699753462566953> Commands: ${client.commands.size}

Select a category below 👇`
      )
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setTimestamp();

    // GENERAL EMBED
    const generalEmbed = new EmbedBuilder()
      .setColor('#d3d3d3')
      .setTitle('<:general:1514699942181081261> General Commands')
      .setDescription(
`__Basic Commands__
afk, membercount, boostcount
joinedat, serverinfo, userinfo
channelinfo, roleinfo, avatar
banner, servericon, serverbanner
profile, vote

__Bot Info__
invite, stats, botinfo
ping, uptime, users
docs, website

-# Developed By Elric`
      );

    // DROPDOWN MENU
    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('help_menu')
          .setPlaceholder('Select a category')
          .addOptions([
            {
              label: 'Security',
              description: 'View security commands',
              value: 'security',
              emoji: { id: '1514699900225323108' }
            },
            {
              label: 'Automod',
              description: 'View automod commands',
              value: 'automod',
              emoji: { id: '1514699907105665664' }
            },
            {
              label: 'Moderation',
              description: 'View moderation commands',
              value: 'moderation',
              emoji: { id: '1514699913919991839' }
            },
            {
              label: 'General',
              description: 'View general commands',
              value: 'general',
              emoji: { id: '1514699942181081261' }
            }
          ])
      );

    const loadingMsg = await message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor('#D3D3D3')
          .setDescription('<a:clockk:1514734530282520647> **Just A Moment.**')
      ]
    });

    await new Promise(r => setTimeout(r, 1000));

    await loadingMsg.edit({
      embeds: [embed],
      components: [row]
    });

    const collector = loadingMsg.createMessageComponentCollector({
      filter: i => i.customId === 'help_menu',
      time: 300000
    });

    collector.on('collect', async interaction => {

      if (interaction.user.id !== message.author.id) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor('#FF7F7F')
              .setDescription("<a:spider_cross:1514728338701287640> This help menu isn't yours.")
          ],
          ephemeral: true
        });
      }

      const value = interaction.values[0];

      if (value === 'security') {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor('#d3d3d3')
              .setTitle('<:shield:1514699900225323108> Security Modules')
              .setDescription(`Security commands here`)
          ],
          ephemeral: true
        });
      }

      if (value === 'moderation') {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor('#d3d3d3')
              .setTitle('<:mod1:1514699913919991839> Moderation Commands')
              .setDescription(`Moderation commands here`)
          ],
          ephemeral: true
        });
      }

      if (value === 'general') {
        return interaction.reply({
          embeds: [generalEmbed],
          ephemeral: true
        });
      }

      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('#FF7F7F')
            .setDescription('Category under development.')
        ],
        ephemeral: true
      });

    });

  }
};
