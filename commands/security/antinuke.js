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

    // =========================
    // 🔥 ENABLE ANTINUKE (CONFIRMATION)
    // =========================
    if (sub === "enable") {

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("antinuke_yes")
            .setLabel("Yes")
            .setEmoji("1514714209085292564")
            .setStyle(ButtonStyle.Success),

          new ButtonBuilder()
            .setCustomId("antinuke_no")
            .setLabel("No")
            .setEmoji("1514728338701287640")
            .setStyle(ButtonStyle.Danger)
        );

      const confirm = await message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#D3D3D3")
            .setTitle("<:shield:1514699900225323108> Antinuke Confirmation")
            .setDescription(
`<:WarningIcon:1514708751385497721> Are you sure you want to **ENABLE Antinuke** in this server?

<:arrow:1514699753462566953> This will activate full server protection.`
            )
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
                .setDescription("<a:spider_cross:1514728338701287640> This interaction isn't yours.")
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
`<a:Animated_Tick:1514714209085292564> Antinuke has been **enabled successfully**.

<:arrow:1514699753462566953> Your server is now protected.`
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
                .setTitle("<:info:1514699288674828310> Cancelled")
                .setDescription("<a:spider_cross:1514728338701287640> Operation cancelled.")
            ],
            components: []
          });
        }
      });

      return;
    }

    // =========================
    // ❌ DISABLE ANTINUKE (CONFIRMATION)
    // =========================
    if (sub === "disable") {

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("antinuke_disable_yes")
            .setLabel("Yes")
            .setEmoji("1514714209085292564")
            .setStyle(ButtonStyle.Success),

          new ButtonBuilder()
            .setCustomId("antinuke_disable_no")
            .setLabel("No")
            .setEmoji("1514728338701287640")
            .setStyle(ButtonStyle.Danger)
        );

      const confirm = await message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#D3D3D3")
            .setTitle("<:shield:1514699900225323108> Antinuke Confirmation")
            .setDescription(
`<:WarningIcon:1514708751385497721> Are you sure you want to **DISABLE Antinuke** in this server?

<:arrow:1514699753462566953> This will remove all protection instantly.`
            )
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
                .setDescription("<a:spider_cross:1514728338701287640> This interaction isn't yours.")
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
                .setTitle("<:shield:1514699900225323108> Antinuke Disabled")
                .setDescription(
`<a:spider_cross:1514728338701287640> Antinuke has been **disabled**.`
                )
            ],
            components: []
          });
        }

        if (interaction.customId === "antinuke_disable_no") {

          return interaction.update({
            embeds: [
              new EmbedBuilder()
                .setColor("#D3D3D3")
                .setTitle("<:info:1514699288674828310> Cancelled")
                .setDescription("Operation cancelled successfully.")
            ],
            components: []
          });
        }
      });

      return;
    }

    // =========================
    // 📄 ANTINUKE HELP PAGE (PREMIUM UI)
    // =========================

    const embed = new EmbedBuilder()
      .setColor('#d3d3d3')
      .setTitle('<:shield:1514699900225323108> Antinuke System')
      .setDescription(
`<a:MekoLoading:1514728537452708022> **Available Antinuke Commands [15]**

,antinuke enable
> Enable and configure antinuke protection.

,antinuke disable
> Disable server protection.

,antinuke autorecovery
> Manage server autorecovery settings.

,antinuke betrayalguard
> Enable or disable betrayal guard.

,antinuke limit
> Set security limits.

,antinuke logging
> Set antinuke log channel.

,antinuke manage
> Manage all settings.

,antinuke reset
> Reset all data.

,antinuke whitelist
> Manage whitelist users.

,antinuke trustlimit
> Set trusted limits.

,antinuke wallon / walloff
> Toggle wall protection.

,antinuke wizard
> One-click setup.

,antinuke zplus
> Advanced protection system.`
      )
      .setFooter({
        text: `Requested by ${message.author.username}`
      });

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('delete')
          .setEmoji('🗑️')
          .setStyle(ButtonStyle.Danger)
      );

    const msg = await message.reply({
      embeds: [embed],
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
              .setDescription("<a:spider_cross:1514728338701287640> This menu isn't yours.")
          ],
          ephemeral: true
        });
      }

      if (interaction.customId === 'delete') {
        return msg.delete().catch(() => {});
      }

    });

  }
};
