const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "userinfo",

    async execute(message, args) {

        const member =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]) ||
            message.member;

        const user = member.user;

        const embed = new EmbedBuilder()
            .setColor("#D3D3D3")
            .setTitle("<:member1:1514699741282304061> User Information")
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setDescription(
`> **__Username__ :** ${user.username}
> **__Display Name__ :** ${member.displayName}
> **__User ID__ :** \`${user.id}\`
> **__Bot__ :** \`${user.bot ? "Yes" : "No"}\`

<:dot:1514706694079254730> **Created :** <t:${Math.floor(user.createdTimestamp / 1000)}:F>
<:dot:1514706694079254730> **Created :** <t:${Math.floor(user.createdTimestamp / 1000)}:R>

<:dot:1514706694079254730> **Joined Server :** <t:${Math.floor(member.joinedTimestamp / 1000)}:F>
<:dot:1514706694079254730> **Joined :** <t:${Math.floor(member.joinedTimestamp / 1000)}:R>`
            );

        return message.reply({
            embeds: [embed]
        });
    }
};
