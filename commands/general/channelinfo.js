const {
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: "channelinfo",
    aliases: ["ci"],

    async execute(message, args) {

        const channel =
            message.mentions.channels.first() ||
            message.guild.channels.cache.get(args[0]) ||
            message.channel;

        const channelTypes = {
            0: "Text Channel",
            2: "Voice Channel",
            4: "Category",
            5: "Announcement Channel",
            10: "Announcement Thread",
            11: "Public Thread",
            12: "Private Thread",
            13: "Stage Channel",
            14: "Directory",
            15: "Forum Channel",
            16: "Media Channel"
        };

        const category =
            channel.parent
                ? channel.parent.name
                : "None";

        const topic =
            channel.topic && channel.topic.length > 0
                ? channel.topic
                : "No topic set.";

        const slowmode =
            channel.rateLimitPerUser
                ? `${channel.rateLimitPerUser}s`
                : "Off";

        const embed = new EmbedBuilder()
            .setColor("#D3D3D3")
            .setAuthor({
                name: `${channel.name} Info`,
                iconURL: message.guild.iconURL({
                    dynamic: true
                })
            })
            .setDescription(
`<:search:1523258723974381580> __General__
> **Name :** ${channel.name}
> **ID :** ${channel.id}
> **Mention :** <#${channel.id}>
> **Type :** ${channelTypes[channel.type] || "Unknown"}
> **Category :** ${category}
> **Created At :** <t:${Math.floor(channel.createdTimestamp / 1000)}:R>
> **Position :** ${channel.position}

<:shieldd:1514699103043584121> __Settings__
> **NSFW :** ${channel.nsfw ? "Yes" : "No"}
> **Slowmode :** ${slowmode}

<:info:1514699288674828310> __Topic__
> ${topic}`
            )
            .setFooter({
                text: `Requested by ${message.author.username} !! | Today at ${new Date().toLocaleTimeString([], {
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
