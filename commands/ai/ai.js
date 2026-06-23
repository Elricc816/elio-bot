const { QuickDB } = require("quick.db");
const db = new QuickDB();

const axios = require("axios");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "ai",

  async execute(message, args) {
    const query = args.join(" ");
    if (!query) return message.reply("❌ Please provide a message.");

    const loading = await message.reply(
      "<:bot1:1514699532686852227> Typing..."
    );

    try {
      // Get memory
      const history =
        (await db.get(`chat_${message.author.id}`)) || [];

      // Build messages
      const messages = [
        {
          role: "system",
          content:
            "You are Elio AI. You remember previous messages and reply naturally like a Discord assistant. Keep answers short and helpful."
        },
        ...history.slice(-10),
        {
          role: "user",
          content: query
        }
      ];

      // Save user message
      await db.push(`chat_${message.author.id}`, {
        role: "user",
        content: query
      });

      // API request
      const res = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.3-70b-versatile",
          messages: messages
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );

      const reply = res.data.choices[0].message.content;

      // Save bot reply
      await db.push(`chat_${message.author.id}`, {
        role: "assistant",
        content: reply
      });

      // Send final response (NO EMBED)
      return loading.edit(reply.slice(0, 2000));

    } catch (err) {
      console.log("AI ERROR:", err.response?.data || err.message);
      loading.edit("❌ AI failed. Check console.");
    }
  }
};
