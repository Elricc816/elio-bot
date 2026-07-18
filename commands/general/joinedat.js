const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "joinedat",
    aliases: ["joinat"],

    async execute(message, args) {

        const member =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]) ||
            message.member;

        const embed = new EmbedBuilder()
            .setColor("#90EE90")
            .setTitle(`${member.user.username}'s Join Date !`)
            .setThumbnail(
                member.user.displayAvatarURL({
                    dynamic: true,
                    size: 4096
                })
            )
            .setDescription(
`<:arrow:1514699753462566953> User joined the server at **__<t:${Math.floor(member.joinedTimestamp / 1000)}:F>__**`
            );

        return message.reply({
            embeds: [embed]
        });

    }
};
