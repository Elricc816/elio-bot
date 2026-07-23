const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = {
    name: "profileedit",
    aliases: ["editprofile"],

    async execute(message) {

        const embed = new EmbedBuilder()
            .setColor("#D3D3D3")
            .setDescription(
`## ✏️ Edit Your Profile

Choose what you want to edit.`
            );

        const row1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("bio")
                .setLabel("Bio")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("birthday")
                .setLabel("Birthday")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("website")
                .setLabel("Website")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("instagram")
                .setLabel("Instagram")
                .setStyle(ButtonStyle.Secondary)
        );

        const row2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("youtube")
                .setLabel("YouTube")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("theme")
                .setLabel("Theme")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("banner")
                .setLabel("Banner")
                .setStyle(ButtonStyle.Secondary)
        );

        await message.reply({
            embeds: [embed],
            components: [row1, row2]
        });

    }
};
