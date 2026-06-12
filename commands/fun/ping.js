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
        `<:heartt:1514699719400755432> Heartbeat: **${heartbeat} ms**\n<:timerr:1514699712681218094> API: **${api} ms**`
      )
      .setColor('#fff18d')
      .setFooter({
        text: 'Cluster: 0 | Shard: 0'
      });

    message.reply({ embeds: [embed] });
  }
};
