const { QuickDB } = require("quick.db");
const db = new QuickDB();
const axios = require("axios");

module.exports = {
  name: "ai",

  async execute(message, args, client) {
    const query = args.join(" ");

    if (!query)
      return message.reply("❌ Please provide a message.");

    const loading = await message.reply(
      "<a:loading_Google:1514727933183524964> Typing..."
    );

    try {
      // GET MEMORY
      const history =
        (await db.get(`chat_${message.author.id}`)) || [];

      const messages = [
        {
          role: "system",
          content:
            "You are Elio AI, a helpful Discord assistant. Reply short, clear, and natural."
        },
        ...history.slice(-10),
        {
          role: "user",
          content: query
        }
      ];

      // CALL GROQ
      const res = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama3-8b-8192",
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

      // SAVE MEMORY (user + bot)
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
  console.log("========== AXIOS ERROR ==========");
  console.log("STATUS:", err.response?.status);
  console.log("DATA:", JSON.stringify(err.response?.data, null, 2));
  console.log("HEADERS:", err.response?.headers);
  console.log("MESSAGE:", err.message);
  console.log("FULL ERROR:", err);

  loading.edit("❌ AI failed. Check Railway logs.");
    }
  }
};
