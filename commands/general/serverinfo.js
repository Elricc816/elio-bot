const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "serverinfo",

    async execute(message) {

        const guild = message.guild;

        await guild.members.fetch();

        const owner = await guild.fetchOwner();

        const created = Math.floor(guild.createdTimestamp / 1000);

        const humans = guild.members.cache.filter(m => !m.user.bot).size;
        const bots = guild.members.cache.filter(m => m.user.bot).size;

        const textChannels = guild.channels.cache.filter(c => c.type === 0).size;
        const voiceChannels = guild.channels.cache.filter(c => c.type === 2).size;
        const categories = guild.channels.cache.filter(c => c.type === 4).size;

        const boosts = guild.premiumSubscriptionCount;
        const boostLevel = guild.premiumTier;

        const verification = guild.verificationLevel;

        const embed = new EmbedBuilder()
            .setColor("#D3D3D3")
            .setAuthor({
                name: `${guild.name}'s info`,
                iconURL: guild.iconURL({ dynamic: true })
            })
            .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
            .setDescription(
`<:search:1523258723974381580> __**General**__
> **Name :** ${guild.name}
> **ID :** ${guild.id}
> **Owner :** ${owner}
> **Created :** <t:${created}:R>
> **Verification :** ${verification}

<:member1:1514699741282304061> __**Members**__
> **Humans :** ${humans}
> **Bots :** ${bots}
> **Total :** ${guild.memberCount}

<:general:1514699942181081261> __**Channels**__
> **Text :** ${textChannels}
> **Voice :** ${voiceChannels}
> **Categories :** ${categories}

<:boost:1514699532686852227> __**Boosts**__
> **Boost Count :** ${boosts}
> **Boost Level :** ${boostLevel}

<:admin:1514699907103985664> __**Extras**__
> **Roles :** ${guild.roles.cache.size}
> **Emojis :** ${guild.emojis.cache.size}
> **Stickers :** ${guild.stickers.cache.size}`
            );

        if (guild.bannerURL()) {
            embed.setImage(guild.bannerURL({ dynamic: true, size: 1024 }));
        }

        embed.setFooter({
            text: `Requested by ${message.author.username} !! | ${new Date().toLocaleString()}`,
            iconURL: message.author.displayAvatarURL({ dynamic: true })
        });

        return message.reply({
            embeds: [embed]
        });
    }
};
