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

      // 🔥 DIS-TUBE PLAY (CORRECT WAY)
      client.distube.play(voiceChannel, query, {
        textChannel: message.channel,
        member: message.member
      });

      return message.reply("🎵 Searching and playing song...");

    } catch (err) {
      console.log("PLAY ERROR:", err);
      return message.reply("❌ Error playing song 😭");
    }
  }
};
