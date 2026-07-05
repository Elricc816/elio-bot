const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "userinfo",

    async execute(message, args) {

        const member =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]) ||
            message.member;

        const user = member.user;

        const created = Math.floor(user.createdTimestamp / 1000);
        const joined = Math.floor(member.joinedTimestamp / 1000);

        const roles = member.roles.cache
            .filter(r => r.id !== message.guild.id)
            .map(r => r.toString());

        const topRole = member.roles.highest;

        const perms = member.permissions.toArray().slice(0, 6).join(", ");

        const voice = member.voice.channel
            ? member.voice.channel.toString()
            : "Not in a voice channel";

        const boosting = member.premiumSince
            ? "Boosting"
            : "Not boosting";

        const embed = new EmbedBuilder()
            .setColor("#D3D3D3")
            .setAuthor({ name: `${user.username}'s info` })
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setDescription(
`<:search:1387986025812332564> __General__

> **Name :** ${user.username}
> **ID :** ${user.id}
> **Nickname :** ${member.nickname || "None"}
> **Is Bot :** ${user.bot ? "Yes" : "No"}
> **Account Created :** <t:${created}:R>
> **Server Joined :** <t:${joined}:R>

<:mod:1387986036423917569> __Roles__

> **Top Role :** ${topRole}
> **Total Roles :** ${roles.length}

<:greet:1387986100265680976> __Extras__

> **Boosting :** ${boosting}
> **Voice :** ${voice}

<:staff:1387986116392779807> __Key Perms__

> ${perms.length ? perms : "None"}

<:906932013951500358:1391489472109219860> __Acknowledgement__

> ${message.guild.ownerId === user.id ? "Server Owner" : "Member"}

Requested by ${message.author.username} !! | <t:${Math.floor(Date.now()/1000)}:R>`
            );

        return message.reply({
            embeds: [embed]
        });
    }
};
