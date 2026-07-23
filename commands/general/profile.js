const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    UserFlagsBitField
} = require("discord.js");

module.exports = {
    name: "profile",
    aliases: ["pf"],

    async execute(message, args) {

        const member =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]) ||
            message.member;

        const user = member.user;

        await user.fetch(true).catch(() => {});

        const avatar = user.displayAvatarURL({
            dynamic: true,
            size: 4096
        });

        const banner = user.bannerURL({
            dynamic: true,
            size: 4096
        });

        const flags = await user.fetchFlags();

        const badges = [];

        if (flags.has(UserFlagsBitField.Flags.ActiveDeveloper))
            badges.push("🧑‍💻 Active Developer");

        if (flags.has(UserFlagsBitField.Flags.HypeSquad))
            badges.push("🎉 HypeSquad");

        if (flags.has(UserFlagsBitField.Flags.HypeSquadOnlineHouse1))
            badges.push("🏠 Bravery");

        if (flags.has(UserFlagsBitField.Flags.HypeSquadOnlineHouse2))
            badges.push("🏠 Brilliance");

        if (flags.has(UserFlagsBitField.Flags.HypeSquadOnlineHouse3))
            badges.push("🏠 Balance");

        if (flags.has(UserFlagsBitField.Flags.BugHunterLevel1))
            badges.push("🐞 Bug Hunter");

        if (flags.has(UserFlagsBitField.Flags.BugHunterLevel2))
            badges.push("🐛 Bug Hunter Lv2");

        if (flags.has(UserFlagsBitField.Flags.Staff))
            badges.push("🛡 Discord Staff");

        if (flags.has(UserFlagsBitField.Flags.VerifiedDeveloper))
            badges.push("✔ Early Verified Bot Dev");

        const roles = member.roles.cache
            .filter(r => r.id !== message.guild.id)
            .sort((a, b) => b.position - a.position)
            .map(r => r.toString())
            .slice(0, 10)
            .join(", ") || "None";

      const embed = new EmbedBuilder()
            .setColor("#D3D3D3")
            .setThumbnail(avatar)
            .setDescription(
`## ${user.username}'s Profile

<:search:1387986025812332564> __General__
> **Username :** ${user.username}
> **Display Name :** ${member.displayName}
> **User ID :** ${user.id}
> **Bot :** ${user.bot ? "Yes" : "No"}

<:staff:1387986116392779807> __Dates__
> **Created :** <t:${Math.floor(user.createdTimestamp / 1000)}:R>
> **Joined :** <t:${Math.floor(member.joinedTimestamp / 1000)}:R>

<:mod:1387986036423917569> __Server__
> **Top Role :** ${member.roles.highest}
> **Boosting :** ${member.premiumSince ? `<t:${Math.floor(member.premiumSinceTimestamp / 1000)}:R>` : "No"}
> **Roles :** ${roles}

🏅 __Badges__
> ${badges.length ? badges.join(", ") : "None"}`
            );

        const row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setCustomId("avatar")
                .setLabel("Avatar")
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

          if (interaction.customId === "avatar") {

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#D3D3D3")
                            .setDescription(
`### ${user.username}'s Avatar

> Requested by ${message.author}`
                            )
                            .setImage(avatar)
                    ],
                    ephemeral: true
                });

            }

            if (interaction.customId === "banner") {

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

                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#D3D3D3")
                            .setDescription(
`### ${user.username}'s Banner

> Requested by ${message.author}`
                            )
                            .setImage(banner)
                    ],
                    ephemeral: true
                });

            }

        });

        collector.on("end", async () => {

            try {

                const disabledRow = new ActionRowBuilder();

                for (const button of msg.components[0].components) {
                    disabledRow.addComponents(
                        ButtonBuilder.from(button).setDisabled(true)
                    );
                }

                await msg.edit({
                    components: [disabledRow]
                });

            } catch {}

        });

    }

};
