const { EmbedBuilder } = require("discord.js");

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

        if (!banner) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#D3D3D3")
                        .setDescription(
                            `<:WarningIcon:1514708751385497721> ${member.user} doesn't have a banner.`
                        )
                ]
            });
        }

        const embed = new EmbedBuilder()
            .setColor("#D3D3D3")
            .setAuthor({
                name: `${member.user.username}'s Banner`,
                iconURL: member.user.displayAvatarURL({ dynamic: true })
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

        return message.reply({
            embeds: [embed]
        });
    }
};
