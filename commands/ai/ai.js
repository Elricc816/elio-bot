const cooldown = new Map();
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const axios = require("axios");

module.exports = {
  name: "ai",

  async execute(message, args) {
    const query = args.join(" ").trim();
    const history =
  (await db.get(`chat_${message.author.id}`)) || [];

    const loading = await message.reply(
      "<a:loading_Google:1514727933183524964> Typing..."
    );
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
    const userId = message.author.id;

if (cooldown.has(userId)) {
  const timeLeft = cooldown.get(userId) - Date.now();

  if (timeLeft > 0) {
    return loading.edit(
      `<a:clockk:1514734530282520647> Wait ${Math.ceil(timeLeft / 1000)}s before using AI again.`
    );
  }
}

    try {
      const res = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.1-8b-instant",
          messages: [
  {
    role: "system",
    content:
      "You are Elio AI 🤖. You remember previous chat and reply naturally. Keep answers short."
  },

  ...history.slice(-10),

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

      const reply = res.data?.choices?.[0]?.message?.content;
      cooldown.set(message.author.id, Date.now() + 5000);
      if (!reply || reply.trim().length === 0) {
  return loading.edit("❌ Empty AI response. Try again.");
      }
      history.push({ role: "user", content: query });
history.push({ role: "assistant", content: reply });

await db.set(
  `chat_${message.author.id}`,
  history.filter(m => m.content).slice(-12)
);

if (!reply) {
  return loading.edit("❌ No response from AI.");
}

      const sent = await loading.edit(reply.slice(0, 2000));

await sent.react("1514699727072133233");

    } catch (err) {
  console.log("🔥 GROQ ERROR:");
  console.log(err.response?.data || err.message);

  return loading.edit(
    "❌ AI failed (API issue). Try again in a few seconds."
  );
    }
  }
};
