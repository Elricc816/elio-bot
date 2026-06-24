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

      // GET NODE (SAFE WAY)
      const node = [...client.shoukaku.nodes.values()][0];

      // CONNECT PLAYER
      const player = await node.joinChannel({
        guildId: message.guild.id,
        channelId: voiceChannel.id,
        shardId: 0,
        deaf: true
      });

      // SEARCH TRACK
      const result = await node.rest.resolve(query);

      if (!result || !result.tracks.length) {
        return message.reply("❌ No song found!");
      }

      const track = result.tracks[0];

      // PLAY TRACK (CORRECT WAY)
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
