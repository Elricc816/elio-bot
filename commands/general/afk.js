const { EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
    name: "afk",

    async execute(message, args) {

        const reason = args.length ? args.join(" ") : "No reason provided.";

        const alreadyAfk = await db.get(`afk_${message.author.id}`);

        if (alreadyAfk) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#FFCC66")
                        .setDescription(
                            `<:WarningIcon:1514708751385497721> You are already AFK.\n\n<:arrow:1514699753462566953> Reason • \`${alreadyAfk.reason}\``
                        )
                ]
            });
        }

        await db.set(`afk_${message.author.id}`, {
            reason,
            since: Date.now()
        });

        return message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("#57F287")
                    .setTitle("<:timerr:1514699712681218094> AFK Enabled")
                    .setDescription(
                        `<:Tick:1514714190500335677> Your AFK has been enabled.\n\n` +
                        `<:arrow:1514699753462566953> **Reason**\n> ${reason}\n\n` +
                        `<:arrow:1514699753462566953> I'll remove your AFK automatically when you send a message.`
                    )
                    .setFooter({
                        text: `Requested by ${message.author.username}`
                    })
                    .setTimestamp()
            ]
        });

    }
};
