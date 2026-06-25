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

      const node = [...client.shoukaku.nodes.values()][0];

      if (!node) {
        return message.reply("❌ Lavalink node not connected!");
      }

      const player = client.shoukaku.createPlayer({
        guildId: message.guild.id,
        shardId: 0,
        voiceChannelId: voiceChannel.id
      });

      const result = await node.rest.resolve(query);

      if (!result || !result.tracks.length) {
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

      return message.reply("❌ Lavalink error 😭 check console");
    }
  }
};
