const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "play",

  async execute(message, args, client) {

    const voiceChannel = message.member.voice.channel;

    if (!voiceChannel) {
      return message.reply("❌ Join a voice channel first!");
    }

    const query = args.join(" ");

    if (!query) {
      return message.reply("❌ Give a song name or URL!");
    }

    try {

      const player = await client.shoukaku.joinVoiceChannel({
        guildId: message.guild.id,
        channelId: voiceChannel.id,
        shardId: 0
      });

      const result = await client.shoukaku.rest.resolve(query);

      if (!result?.tracks?.length) {
        return message.reply("❌ No song found!");
      }

      const track = result.tracks[0];

      await player.playTrack({ track: track.encoded });

      const embed = new EmbedBuilder()
        .setColor("#00FF99")
        .setTitle("🎵 Now Playing")
        .setDescription(`**${track.info.title}**`)
        .setFooter({ text: "Elio Music System" });

      message.reply({ embeds: [embed] });

    } catch (err) {
      console.log("PLAY ERROR:", err);

      message.reply("❌ Failed to play song 😅");
    }
  }
};
