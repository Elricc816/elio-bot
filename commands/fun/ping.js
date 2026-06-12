const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "ping",
  async execute(message) {

    const heartbeat = Date.now() - message.createdTimestamp;
    const api = Math.round(message.client.ws.ping);

    const embed = new EmbedBuilder()
      .setAuthor({
        name: message.client.user.username,
        iconURL: message.client.user.displayAvatarURL()
      })
      .setDescription(
        `<a:GF_Loading_Google:769532716726747137> Heartbeat: **${heartbeat} ms**\n<:timerr:1514699712681218094> API: **${api} ms**`
      )
      .setColor('#f3ca40')
      .setFooter({
        text: 'Cluster: 0 | Shard: 0'
      });

    message.reply({ embeds: [embed] });
  }
};
