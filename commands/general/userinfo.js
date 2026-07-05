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
            .setAuthor({
                name: `${user.username}'s info`,
                iconURL: user.displayAvatarURL({ dynamic: true })
            })
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
            .setDescription(
`<:search:1523258723974381580> __**General**__
> **Name :** ${user.username}
> **ID :** ${user.id}
> **Nickname :** ${member.nickname || "None"}
> **Is Bot :** ${user.bot ? "Yes" : "No"}
> **Account Created :** <t:${created}:R>
> **Server Joined :** <t:${joined}:R>

<:mod1:1514699913919991839> __**Roles**__
> **Top Role :** ${topRole}
> **Total Roles :** ${roles.length}

<:general:1514699942181081261> __**Extras**__
> **Boosting :** ${boosting}
> **Voice :** ${voice}

<:admin:1514699907103985664> __**Key Perms**__
> ${perms.length ? perms : "None"}

<:crown:1514699539657920592> __**Acknowledgement**__
> ${message.guild.ownerId === user.id ? "Server Owner" : "Member"}`
            );

        // =========================
        // ADD BANNER (IF USER HAS ONE)
        // =========================
        try {
            const fetchedUser = await user.fetch();

            if (fetchedUser.banner) {
                embed.setImage(
                    `https://cdn.discordapp.com/banners/${user.id}/${fetchedUser.banner}.png?size=1024`
                );
            }
        } catch (err) {
            console.log("Banner fetch error:", err);
        }

        // =========================
        // FOOTER (Requested by + icon + time)
        // =========================
        embed.setFooter({
            text: `Requested by ${message.author.username} !! | ${new Date().toLocaleString()}`,
            iconURL: message.author.displayAvatarURL({ dynamic: true })
        });

        return message.reply({
            embeds: [embed]
        });
    }
};
