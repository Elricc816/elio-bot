const { QuickDB } = require("quick.db");
const db = new QuickDB();
const axios = require("axios");

module.exports = {
  name: "ai",

  async execute(message, args) {
    const query = args.join(" ") || "hello";
    const history =
  (await db.get(`chat_${message.author.id}`)) || [];

    const loading = await message.reply(
      "<a:loading_Google:1514727933183524964> Typing..."
    );

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
