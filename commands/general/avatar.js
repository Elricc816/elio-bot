const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = {
    name: "avatar",
    aliases: ["av", "pfp"],

    async execute(message, args) {

        const member =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]) ||
            message.member;

        const user = await message.client.users.fetch(member.id, {
            force: true
        });

        const avatar = user.displayAvatarURL({
            dynamic: true,
            size: 4096
        });

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
> [PNG](${user.displayAvatarURL({ extension: "png", size: 4096 })})
> [JPG](${user.displayAvatarURL({ extension: "jpg", size: 4096 })})
> [WEBP](${user.displayAvatarURL({ extension: "webp", size: 4096 })})
> [Avatar URL](${avatar})`
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

        const row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setCustomId("serveravatar")
                .setLabel("Server Avatar")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("banner")
                .setLabel("Banner")
                .setStyle(ButtonStyle.Secondary)

        );

        const msg = await message.reply({
            embeds: [embed],
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
            }

            if (interaction.customId === "serveravatar") {

                const serverAvatar = member.displayAvatarURL({
                    dynamic: true,
                    size: 4096
                });

                if (member.avatar === null) {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("#FF7F7F")
                                .setDescription(
                                    "<a:spider_cross:1514728338701287640> This user does not have a server avatar."
                                )
                        ],
                        ephemeral: true
                    });
                }

                const embed = new EmbedBuilder()
                    .setColor("#D3D3D3")
                    .setAuthor({
                        name: `${user.username}'s Server Avatar`,
                        iconURL: serverAvatar
                    })
                    .setImage(serverAvatar)
                    .setFooter({
                        text: `Requested by ${message.author.username} • Today at ${new Date().toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit"
                        })}`,
                        iconURL: message.author.displayAvatarURL({ dynamic: true })
                    });

                return interaction.update({
                    embeds: [embed],
                    components: [row]
                });
            }

            if (interaction.customId === "banner") {

                const banner = user.bannerURL({
                    dynamic: true,
                    size: 4096
                });

                if (!banner) {
                    return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                                .setColor("#FF7F7F")
                                .setDescription(
                                    "<a:spider_cross:1514728338701287640> This user does not have a banner."
                                )
                        ],
                        ephemeral: true
                    });
                }

                const embed = new EmbedBuilder()
                    .setColor("#D3D3D3")
                    .setAuthor({
                        name: `${user.username}'s Banner`,
                        iconURL: user.displayAvatarURL({ dynamic: true })
                    })
                    .setImage(banner)
                    .setFooter({
                        text: `Requested by ${message.author.username} • Today at ${new Date().toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit"
                        })}`,
                        iconURL: message.author.displayAvatarURL({ dynamic: true })
                    });

                return interaction.update({
                    embeds: [embed],
                    components: [row]
                });
            }

        });

        collector.on("end", async () => {

            const disabledRow = new ActionRowBuilder().addComponents(

                ButtonBuilder.from(row.components[0]).setDisabled(true),
                ButtonBuilder.from(row.components[1]).setDisabled(true)

            );

            msg.edit({
                components: [disabledRow]
            }).catch(() => {});

        });

    }
};
