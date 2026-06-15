const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "play",

  async execute(message, args, client) {

    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {

      const embed = new EmbedBuilder()
        .setColor("#FF7F7F")
        .setTitle("You can't use this command!")
        .setDescription(
`<a:spider_cross:1514728338701287640> You are restricted from using this command!

<:arrow:1514699753462566953> Restriction Reason ~ \`Voice Connection\``
        );

      const msg = await message.reply({
        embeds: [embed]
      });

      setTimeout(() => {
        msg.delete().catch(() => {});
      }, 10000);

      return;
    }

    const query = args.join(" ");

    if (!query) {

      const embed = new EmbedBuilder()
        .setColor("#FF7F7F")
        .setDescription(
`<:WarningIcon:1514708751385497721> Please provide a song name or YouTube URL.`
        );

      const msg = await message.reply({
        embeds: [embed]
      });

      setTimeout(() => {
        msg.delete().catch(() => {});
      }, 10000);

      return;
    }

    try {

      await client.distube.play(
        voiceChannel,
        query,
        {
          member: message.member,
          textChannel: message.channel
        }
      );

    } catch (err) {
      console.log(err);

      message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("#FF7F7F")
            .setDescription(
              "<a:spider_cross:1514728338701287640> Failed to play the requested song."
            )
        ]
      });
    }
  }
};
