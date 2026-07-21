const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = {
    name: "servericon",
    aliases: ["icon", "guildicon"],

    async execute(message) {

        const guild = message.guild;

        const icon = guild.iconURL({
            dynamic: true,
            size: 4096
        });

        const banner = guild.bannerURL({
            dynamic: true,
            size: 4096
        });

        if (!icon) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#FF7F7F")
                        .setDescription(
                            "<a:spider_cross:1514728338701287640> This server does not have an icon."
                        )
                ]
            });
        }

        function iconEmbed() {
            return new EmbedBuilder()
                .setColor("#D3D3D3")
                .setDescription(
`### 𐙚 ${guild.name}'s Icon

[\`PNG\`](${guild.iconURL({ extension: "png", size: 4096 })}) | [\`JPG\`](${guild.iconURL({ extension: "jpg", size: 4096 })}) | [\`WEBP\`](${guild.iconURL({ extension: "webp", size: 4096 })})

-# Requested by ${message.author}`
                )
                .setImage(icon);
        }

        const row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setCustomId("banner")
                .setLabel("Server Banner")
                .setStyle(ButtonStyle.Secondary)

        );

        const msg = await message.reply({
            embeds: [iconEmbed()],
            components: [row]
        });

        const collector = msg.createMessageComponentCollector({
            time: 300000
        });

        collector.on("collect", async interaction => {

            if (interaction.user.id !== message.author.id) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#FF7F7F")
                            .setDescription(
                                "<a:spider_cross:1514728338701287640> This interaction isn't yours."
                            )
                    ],
                    ephemeral: true
                });
            }if (interaction.customId === "banner") {

                if (!banner) {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("#FF7F7F")
                                .setDescription(
                                    "<a:spider_cross:1514728338701287640> This server does not have a banner."
                                )
                        ],
                        ephemeral: true
                    });
                }

                const bannerEmbed = new EmbedBuilder()
                    .setColor("#D3D3D3")
                    .setDescription(
`### 𐙚 ${guild.name}'s Banner

[\`PNG\`](${guild.bannerURL({ extension: "png", size: 4096 })}) | [\`JPG\`](${guild.bannerURL({ extension: "jpg", size: 4096 })}) | [\`WEBP\`](${guild.bannerURL({ extension: "webp", size: 4096 })})

-# Requested by ${message.author}`
                    )
                    .setImage(banner);

                const bannerRow = new ActionRowBuilder().addComponents(

                    new ButtonBuilder()
                        .setCustomId("icon")
                        .setLabel("Server Icon")
                        .setStyle(ButtonStyle.Secondary)

                );

                return interaction.update({
                    embeds: [bannerEmbed],
                    components: [bannerRow]
                });

            }

            if (interaction.customId === "icon") {

                return interaction.update({
                    embeds: [iconEmbed()],
                    components: [row]
                });

            }

        });

        collector.on("end", async () => {

            const disabled = new ActionRowBuilder().addComponents(
    ...msg.components[0].components.map(button =>
        ButtonBuilder.from(button).setDisabled(true)
    )
);

            await msg.edit({
                components: [disabled]
            }).catch(() => {});

        });

    }

};
