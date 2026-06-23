const { QuickDB } = require("quick.db");
const db = new QuickDB();
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
          model: "llama-3.3-70b-versatile",
          const history = await db.get(`chat_${message.author.id}`) || [];

const messages: messages
  {
    role: "system",
    content:
      "You are Elio AI. You remember previous messages and reply naturally like a chat assistant. Keep answers short and helpful."
  },
  ...history.slice(-10),
  {
    role: "user",
    content: query
  }
];
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );

      const reply = res.data.choices[0].message.content;
await db.push(`chat_${message.author.id}`, {
  role: "assistant",
  content: reply
});

      const embed = new EmbedBuilder()
        .setColor("#3498db")
        .setTitle("🤖 Elio AI")
        .setDescription(reply.slice(0, 4000))
        .setFooter({ text: `Requested by ${message.author.username}` });

      loading.edit({ content: "", embeds: [embed] });

    } catch (err) {
  console.log("AI ERROR:", err.response?.data || err.message);
  loading.edit("❌ AI failed. Check console.");
    }
  }
};
