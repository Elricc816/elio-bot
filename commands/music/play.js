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
      return message.reply("❌ Provide a song name or URL!");
    }

    try {

      const player = await client.shoukaku.joinVoiceChannel({
        guildId: message.guild.id,
        channelId: voiceChannel.id,
        shardId: message.guild.shardId || 0
      });

      const result = await client.shoukaku.rest.resolve(query);

      if (!result?.tracks?.length) {
        return message.reply("❌ No song found!");
      }

      const track = result.tracks[0];

      await player.playTrack(track.encoded);

      const embed = new EmbedBuilder()
        .setColor("#00FF99")
        .setTitle("🎵 Now Playing")
        .setDescription(track.info.title);

      return message.reply({ embeds: [embed] });

    } catch (err) {
      console.log("PLAY ERROR:", err);

      return message.reply("❌ Lavalink error 😅 check console");
    }
  }
};
