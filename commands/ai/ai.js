const axios = require("axios");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "ai",

  async execute(message, args) {
    const query = args.join(" ") || "hello";
    const history = (await db.get(`chat_${message.author.id}`)) || [];

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
      "You are Elio AI. You remember previous chat and reply naturally. Keep answers short."
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

      const reply = res.data.choices[0].message.content;
      await db.push(`chat_${message.author.id}`, {
  role: "user",
  content: query
});

await db.push(`chat_${message.author.id}`, {
  role: "assistant",
  content: reply
});

      return loading.edit(reply.slice(0, 2000));

    } catch (err) {
  console.log("========== AI ERROR ==========");
  console.log("STATUS:", err.response?.status);
  console.log("DATA:", JSON.stringify(err.response?.data, null, 2));
  console.log("MESSAGE:", err.message);
  console.log("==============================");

  loading.edit("❌ AI failed. Check Railway logs.");
    }
  }
};
