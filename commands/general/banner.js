const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = {
    name: "banner",

    async execute(message, args) {

        const member =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]) ||
            message.member;

        const user = await message.client.users.fetch(member.id, {
            force: true
        });

        const banner = user.bannerURL({
            dynamic: true,
            size: 4096
        });

        const avatar = user.displayAvatarURL({
            dynamic: true,
            size: 4096
        });

        // Discord doesn't expose server banners.
        const serverBanner = null;

        if (!banner) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#FF7F7F")
                        .setDescription(
                            "<a:spider_cross:1514728338701287640> This user does not have a banner."
                        )
                ]
            });
        }

        function bannerEmbed() {

            return new EmbedBuilder()
                .setColor("#D3D3D3")
                .setAuthor({
                    name: `${user.username}'s Banner`,
                    iconURL: avatar
                })
                .setImage(banner)
                .setDescription(
`<:member1:1514699741282304061> **User:** ${member}

<:search:1523258723974381580> **Banner Links**
> [PNG](${user.bannerURL({ extension: "png", size: 4096 })})
> [JPG](${user.bannerURL({ extension: "jpg", size: 4096 })})
> [WEBP](${user.bannerURL({ extension: "webp", size: 4096 })})
> [Banner URL](${banner})`
                )
                .setFooter({
                    text: `Requested by ${message.author.username} • Today at ${new Date().toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit"
                    })}`,
                    iconURL: message.author.displayAvatarURL({
                        dynamic: true
                    })
                });

        }

        const bannerButtons = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setCustomId("avatar")
                .setLabel("Avatar")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("serverbanner")
                .setLabel("Server Banner")
                .setStyle(ButtonStyle.Secondary)

        );

        const msg = await message.reply({
            embeds: [bannerEmbed()],
            components: [bannerButtons]
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
            }

            // =========================
            // AVATAR
            // =========================

            if (interaction.customId === "avatar") {

                const embed = new EmbedBuilder()
                    .setColor("#D3D3D3")
                    .setAuthor({
                        name: `${user.username}'s Avatar`,
                        iconURL: avatar
                    })
                    .setImage(avatar)
                    .setDescription(
`<:member1:1514699741282304061> **User:** ${member}

<:search:1523258723974381580> **Avatar Links**
 [PNG](${user.displayAvatarURL({ extension: "png", size: 4096 })}) | [JPG](${user.displayAvatarURL({ extension: "jpg", size: 4096 })}) | [WEBP](${user.displayAvatarURL({ extension: "webp", size: 4096 })})
> [Avatar URL](${avatar})`
                    )
                    .setFooter({
                        text: `Requested by ${message.author.username} • Today at ${new Date().toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit"
                        })}`,
                        iconURL: message.author.displayAvatarURL({ dynamic: true })
                    });

                const row = new ActionRowBuilder().addComponents(

                    new ButtonBuilder()
                        .setCustomId("banner")
                        .setLabel("Banner")
                        .setStyle(ButtonStyle.Secondary)

                );

                return interaction.update({
                    embeds: [embed],
                    components: [row]
                });
            }

                 // =========================
            // SERVER BANNER
            // =========================

            if (interaction.customId === "serverbanner") {

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#FF7F7F")
                            .setDescription(
                                "<a:spider_cross:1514728338701287640> This user does not have a server banner."
                            )
                    ],
                    ephemeral: true
                });

            }

            // =========================
            // BACK TO BANNER
            // =========================

            if (interaction.customId === "banner") {

                return interaction.update({
                    embeds: [bannerEmbed()],
                    components: [bannerButtons]
                });

            }

        });

        collector.on("end", async () => {

                     const disabledRow = new ActionRowBuilder();

            bannerButtons.components.forEach(button => {
                disabledRow.addComponents(
                    ButtonBuilder.from(button).setDisabled(true)
                );
            });

            await msg.edit({
                components: [disabledRow]
            }).catch(() => {});

        });

    }

};
