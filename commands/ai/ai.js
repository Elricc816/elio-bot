const axios = require("axios");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ai",

  async execute(message, args) {
    const query = args.join(" ");
    if (!query) return message.reply("❌ Please provide a message.");

    const loading = await message.reply("🤖 Thinking...");

    try {
      const res = await axios.post(
  "https://api.groq.com/openai/v1/chat/completions",
  {
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content:
          "You are Elio AI, a helpful Discord bot. Give short, clear, useful answers."
      },
      {
        role: "user",
        content: String(query || "hello")
      }
    ]
  },
  {
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    }
  }
);

console.log("AI RESPONSE:", JSON.stringify(res.data, null, 2));


      const reply = res.data.choices[0].message.content;

      const embed = new EmbedBuilder()
        .setColor("#3498db")
        .setTitle("🤖 Elio AI")
        .setDescription(reply.slice(0, 4000))
        .setFooter({ text: `Requested by ${message.author.username}` });

      return loading.edit({ content: "", embeds: [embed] });

    } catch (err) {
  console.log("STATUS:", err.response?.status);
  console.log("DATA:", err.response?.data);
  console.log("MESSAGE:", err.message);

  loading.edit("❌ AI failed. Check Railway log.");
    }
  }
};
