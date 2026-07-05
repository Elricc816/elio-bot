const {
    EmbedBuilder,
    ChannelType,
    VerificationLevel,
    ExplicitContentFilterLevel
} = require("discord.js");

module.exports = {
    name: "serverinfo",

    async execute(message) {

        const guild = message.guild;

        await guild.members.fetch();

        const owner = `<@${guild.ownerId}>`;

        const created = Math.floor(guild.createdTimestamp / 1000);

        const humans = guild.members.cache.filter(m => !m.user.bot).size;
        const bots = guild.members.cache.filter(m => m.user.bot).size;

        const textChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size;
        const voiceChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size;
        const stageChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildStageVoice).size;
        const categories = guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory).size;

        const regularEmojis = guild.emojis.cache.filter(e => !e.animated).size;
        const animatedEmojis = guild.emojis.cache.filter(e => e.animated).size;

        const boosters = guild.members.cache.filter(m => m.premiumSince).size;

        const verificationLevels = {
            [VerificationLevel.None]: "None",
            [VerificationLevel.Low]: "Low",
            [VerificationLevel.Medium]: "Medium",
            [VerificationLevel.High]: "High",
            [VerificationLevel.VeryHigh]: "Very High"
        };

        const contentFilters = {
            [ExplicitContentFilterLevel.Disabled]: "Disabled",
            [ExplicitContentFilterLevel.MembersWithoutRoles]: "Members Without Roles",
            [ExplicitContentFilterLevel.AllMembers]: "All Members"
        };

        const features = guild.features.length
            ? guild.features.map(f => f.replace(/_/g, " ").toLowerCase()).join(", ")
            : "No special features.";

        const roles = guild.roles.cache
            .filter(r => r.id !== guild.id)
            .sort((a, b) => b.position - a.position)
            .map(r => `<@&${r.id}>`)
            .slice(0, 15)
            .join(", ");

        const embed = new EmbedBuilder()
            .setColor("#D3D3D3")
            .setAuthor({
                name: `${guild.name}'s info`,
                iconURL: guild.iconURL({ dynamic: true })
            })
            .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
            .setDescription(
`<:search:1523258723974381580> __**About Server**__
> **Name :** ${guild.name}
> **Server ID :** ${guild.id}
> **Owner [<:bluetick:1523423666585604106>] :** ${owner}
> **Created At :** <t:${created}:R>
> **Total Members :** ${guild.memberCount}

<:bluetick:1523423666585604106> __**Extras**__
> **Verification Level :** ${verificationLevels[guild.verificationLevel]}
> **MFA Level :** ${guild.mfaLevel ? "Enabled" : "Disabled"}
> **Content Filter :** ${contentFilters[guild.explicitContentFilter]}

<a:BlackDot:1514727923175657654> __**Features**__
> ${features}

<:member1:1514699741282304061> __**Members**__
> **Total Members :** ${guild.memberCount}
> **Humans :** ${humans}
> **Bots :** ${bots}

<:Logs:1375628818286641245> __**Channels**__
> **Categories :** ${categories}
> **Text Channels :** ${textChannels}
> **Voice Channels :** ${voiceChannels}
> **Stage Channels :** ${stageChannels}

<a:giveaway:1514859685826793504> __**Emojis**__
> **Regular Emojis :** ${regularEmojis}
> **Animated Emojis :** ${animatedEmojis}
> **Stickers :** ${guild.stickers.cache.size}
> **Total :** ${guild.emojis.cache.size}

<:boosts:1523254638571294790> __**Boosts**__
> **Boost Level :** ${guild.premiumTier} Level
> **Boost Count :** ${guild.premiumSubscriptionCount || 0}
> **Boosters :** ${boosters}
> **Booster Role :** ${guild.roles.premiumSubscriberRole ? guild.roles.premiumSubscriberRole : "`None`"}

<:admin:1514699907103985664> __**Roles**__
> ${roles || "`None`"}`
            );

        embed.setFooter({
            text: `Requested by ${message.author.username} • Today at ${new Date().toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit"
            })}`,
            iconURL: message.author.displayAvatarURL({
                dynamic: true
            })
        });

        if (guild.bannerURL()) {
            embed.setImage(
                guild.bannerURL({
                    dynamic: true,
                    size: 4096
                })
            );
        }

        return message.reply({
            embeds: [embed]
        });
    }
};
