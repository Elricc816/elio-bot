const {
    EmbedBuilder,
    PermissionsBitField
} = require("discord.js");

module.exports = {
    name: "roleinfo",
    aliases: ["ri"],

    async execute(message, args) {

        const role =
            message.mentions.roles.first() ||
            message.guild.roles.cache.get(args[0]) ||
            message.guild.roles.cache.find(r =>
                r.name.toLowerCase() === args.join(" ").toLowerCase()
            );

        if (!role) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#FF7F7F")
                        .setDescription(
                            "<a:spider_cross:1514728338701287640> Role not found."
                        )
                ]
            });
        }

        const members = role.members.size;

        let keyPerms = [];

        if (role.permissions.has(PermissionsBitField.Flags.Administrator)) {
            keyPerms.push("Administrator");
        } else {

            const perms = [
                ["ManageGuild", "Manage Server"],
                ["ManageRoles", "Manage Roles"],
                ["ManageChannels", "Manage Channels"],
                ["ManageMessages", "Manage Messages"],
                ["BanMembers", "Ban Members"],
                ["KickMembers", "Kick Members"],
                ["ModerateMembers", "Moderate Members"],
                ["MentionEveryone", "Mention Everyone"],
                ["ManageWebhooks", "Manage Webhooks"],
                ["ManageNicknames", "Manage Nicknames"]
            ];

            for (const [flag, name] of perms) {
                if (role.permissions.has(PermissionsBitField.Flags[flag])) {
                    keyPerms.push(name);
                }
            }

            if (!keyPerms.length)
                keyPerms.push("No major permissions.");
        }

        const embed = new EmbedBuilder()
            .setColor("#D3D3D3")
            .setAuthor({
                name: `${role.name}'s Info`,
                iconURL: message.guild.iconURL({ dynamic: true })
            })
            .setDescription(
`<:search:1387986025812332564> __General__

> **Name :** ${role.name}
> **ID :** ${role.id}
> **Color :** ${role.hexColor}
> **Position :** ${role.position}
> **Created At :** <t:${Math.floor(role.createdTimestamp / 1000)}:R>

<:mod:1387986036423917569> __Settings__

> **Hoisted :** ${role.hoist ? "Yes" : "No"}
> **Mentionable :** ${role.mentionable ? "Yes" : "No"}
> **Managed :** ${role.managed ? "Yes" : "No"}
> **Members :** ${members}

<:staff:1387986116392779807> __Key Perms__

> ${keyPerms.join("\n> ")}`
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
