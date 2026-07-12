const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "avatar",
    aliases: ["av", "pfp"],

    async execute(message, args) {

        const member =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]) ||
            message.member;

        const avatar = member.user.displayAvatarURL({
            dynamic: true,
            size: 4096
        });

        const embed = new EmbedBuilder()
            .setColor("#D3D3D3")
            .setAuthor({
                name: `${member.user.username}'s Avatar`,
                iconURL: member.user.displayAvatarURL({ dynamic: true })
            })
            .setImage(avatar)
            .setDescription(
`<:member1:1514699741282304061> **User:** ${member}

<:search:1523258723974381580> **Avatar Links**
> [PNG](${member.user.displayAvatarURL({ extension: "png", size: 4096 })})
> [JPG](${member.user.displayAvatarURL({ extension: "jpg", size: 4096 })})
> [WEBP](${member.user.displayAvatarURL({ extension: "webp", size: 4096 })})
> [Avatar URL](${avatar})`
            )
            .setFooter({
                text: `Requested by ${message.author.username} • Today at ${new Date().toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit"
                })}`,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            });

        return message.reply({
            embeds: [embed]
        });
    }
};
