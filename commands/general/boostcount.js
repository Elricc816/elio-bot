const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "boostcount",

    async execute(message) {

        const guild = message.guild;

        const boosts = guild.premiumSubscriptionCount || 0;

        const tier = guild.premiumTier;

        const embed = new EmbedBuilder()
            .setColor("#D3D3D3")
            .setTitle("<:boost:1514699712681218094> Boost Count")
            .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
            .setDescription(
`> **__Boosts__ :** \`${boosts}\`
> **__Boost Tier__ :** \`Level ${tier}\``
            );

        return message.reply({
            embeds: [embed]
        });
    }
};
