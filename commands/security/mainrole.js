const {
EmbedBuilder,
ActionRowBuilder,
ButtonBuilder,
ButtonStyle
} = require('discord.js');

const cooldown = new Map();

module.exports = {
name: "mainrole",

async execute(message) {

const cooldownTime = 3000;

if (cooldown.has(message.author.id)) {
  const timeLeft = (
    (cooldown.get(message.author.id) - Date.now()) / 1000
  ).toFixed(1);

  if (timeLeft > 0) {
    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setColor('#FF7F7F')
          .setDescription(

`<:WarningIcon:1514708751385497721> You are under cooldown to this command!

<:arrow:1514699753462566953> Cooldown ~ `${timeLeft}s``
)
]
});
}
}

cooldown.set(
  message.author.id,
  Date.now() + cooldownTime
);

setTimeout(() => {
  cooldown.delete(message.author.id);
}, cooldownTime);

const embed = new EmbedBuilder()
  .setColor('#D3D3D3')
  .setTitle('<:shieldd:1514699103043584121> Mainrole')
  .setDescription(

`<a:MekoLoading:1514728537452708022> Available Mainrole Commands [5]

`,mainrole`

«Configure mainrole settings.»

`,mainrole add`

«Add a role to mainrole.»

`,mainrole remove`

«Remove a role from mainrole.»

`,mainrole reset`

«Reset all mainrole settings.»

`,mainrole show`

«View current mainrole configuration.") .setFooter({ text:"Page 1/1 | Requested By ${message.author.username}`
});»

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
          .setDescription(
            "<a:spider_cross:1514728338701287640> This menu isn't yours."
          )
      ],
      ephemeral: true
    });
  }

  if (interaction.customId === 'delete') {
    return msg.delete().catch(() => {});
  }

  await interaction.deferUpdate();

});

}
};
