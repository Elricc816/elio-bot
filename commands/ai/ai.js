const axios = require("axios");

module.exports = {
  name: "ai",

  async execute(message, args) {
    const query = args.join(" ") || "hello";

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
                "You are Elio AI. Reply short and helpful."
            },
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

      const reply =
  res.data?.choices?.[0]?.message?.content;

if (!reply) {
  return loading.edit("❌ AI returned empty response. Try again.");
}
      const sent = await loading.edit(reply.slice(0, 2000));

await sent.react("<1514699727072133233>");

    } catch (err) {
      console.log("AI ERROR:", err.response?.data || err.message);

      loading.edit("❌ AI failed. Check logs.");
    }
  }
};
