const cooldown = new Map();

module.exports = {
  name: "purge",
  async execute(message, args) {

    if (!message.member.permissions.has("ManageMessages")) {
      return message.reply("❌ You don't have permission to purge messages!");
    }

    // 10s cooldown
    const now = Date.now();
    const lastUsed = cooldown.get(message.author.id);

    if (lastUsed && now - lastUsed < 10000) {
      return message.reply("⏳ Wait 10 seconds before using purge again!");
    }

    cooldown.set(message.author.id, now);

    const targetUser = message.mentions.users.first();

    // BOT MODE: !purge bots OR !pb
    const isBotMode =
      args[0] === "bots" ||
      args[0] === "bot" ||
      args[0] === "pb" ||
      message.content.startsWith("!pb");

    // helper for limit
    const limit = (n) => {
      if (!n || isNaN(n)) return 10;
      if (n > 100) return 100;
      return n;
    };

    let amount;

    // ---------------------------
    // 1️⃣ BOT PURGE
    // ---------------------------
    if (isBotMode) {

      amount = limit(parseInt(args[1]));

      const messages = await message.channel.messages.fetch({ limit: 100 });

      const botMessages = messages
        .filter(m => m.author.bot)
        .first(amount);

      await message.channel.bulkDelete(botMessages, true);

      return message.channel.send(
        `🧹 Purged **${botMessages.length} bot messages**`
      );
    }

    // ---------------------------
    // 2️⃣ USER PURGE
    // ---------------------------
    if (targetUser) {

      amount = limit(parseInt(args[1]));

      const messages = await message.channel.messages.fetch({ limit: 100 });

      const userMessages = messages
        .filter(m => m.author.id === targetUser.id)
        .first(amount);

      await message.channel.bulkDelete(userMessages, true);

      return message.channel.send(
        `🧹 Purged **${userMessages.length} messages from ${targetUser.username}**`
      );
    }

    // ---------------------------
    // 3️⃣ NORMAL PURGE
    // ---------------------------
    amount = parseInt(args[0]);

    if (!amount) {
      return message.reply("❌ Use: `!purge {number}`");
    }

    amount = limit(amount);

    const deleted = await message.channel.bulkDelete(amount + 1, true);

    return message.channel.send(
      `🧹 Purged **${deleted.size - 1} messages**`
    );
  }
};
