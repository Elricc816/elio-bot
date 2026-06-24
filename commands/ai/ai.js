const cooldown = new Map();
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const axios = require("axios");

module.exports = {
  name: "ai",

  async execute(message, args) {
    const query = args.join(" ").trim();
    
    const userId = message.author.id;

    const history =
      (await db.get(`chat_${userId}`)) || [];

    const loading = await message.reply(
      "<a:loading_Google:1514727933183524964> Typing..."
    );

    // 🧠 EMPTY QUERY CHECK (HELP EMBED)
    if (!query) {
      const { EmbedBuilder } = require("discord.js");

      const embed = new EmbedBuilder()
        .setColor("#D3D3D3")
        .setTitle("<:bot3:1514699096047358082> AI Command Help")
        .setDescription(
`**\`\`\`yml
<..> <required> | [..] [optional]
\`\`\`**

> **\`,ai <query>\`**

<:arrow:1514699753462566953> Ask the chatbot a question with a predefined profile.`
        );

      return loading.edit({ content: "", embeds: [embed] });
    }

    // ⏳ COOLDOWN CHECK
    if (cooldown.has(userId)) {
      const timeLeft = cooldown.get(userId) - Date.now();

      if (timeLeft > 0) {
        return loading.edit(
          `<a:clockk:1514734530282520647> Wait ${Math.ceil(timeLeft / 1000)}s before using AI again.`
        );
      }
    }

    try {
      let res;

for (let i = 0; i < 2; i++) {
  try {
    res = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: `
You are Elio AI 🤖.

Rules:
- Talk like a friendly human 😋
- Use emojis naturally (😀😅😭🥲🔥) but not too much
- Be helpful, a bit fun, and expressive
- Keep replies 1–4 lines max
- Understand emotions and respond properly
`
          },

          ...history
  .filter(
    m =>
      m &&
      typeof m === "object" &&
      typeof m.role === "string" &&
      typeof m.content === "string"
  )
  .slice(-10),

          {
            role: "user",
            content: query
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

    break;
  } catch (err) {
    if (i === 1) throw err;
  }
}

      const reply = res.data?.choices?.[0]?.message?.content;

      if (!reply || reply.trim().length === 0) {
        return loading.edit("❌ Empty AI response. Try again.");
      }

      // 💾 SAVE MEMORY
      history.push({ role: "user", content: query });
      history.push({ role: "assistant", content: reply });

      await db.set(
        `chat_${userId}`,
        history.filter(m => m.content).slice(-12)
      );

      // ⚡ SET COOLDOWN
      cooldown.set(userId, Date.now() + 5000);

      const sent = await loading.edit(reply.slice(0, 2000));

      await sent.react("1514699727072133233");

    } catch (err) {
      console.log("🔥 AI ERROR:", err.response?.data || err.message);

      let msg = "❌ AI is tired right now 😅 try again in a few seconds.";

      if (err.response?.status === 429) {
        msg = "⏳ Too many requests 😭 slow down a bit!";
      }

      if (err.response?.status === 500) {
        msg = "💥 AI server issue 🥲 try again later!";
      }

      return loading.edit(msg);
    }
  }
};
