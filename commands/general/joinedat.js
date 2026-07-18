const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "joinedat",

    async execute(message, args) {

        const member =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]) ||
            message.member;

        const embed = new EmbedBuilder()
            .setColor("#D3D3D3")
            .setTitle("<:calendar:1514699288674828310> Joined At")
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setDescription(
`> **__User__ :** ${member}
> **__Joined Server__ :** <t:${Math.floor(member.joinedTimestamp / 1000)}:F>
> **__Joined__ :** <t:${Math.floor(member.joinedTimestamp / 1000)}:R>`
            );

        return message.reply({
            embeds: [embed]
        });
    }
};
