const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "membercount",

    async execute(message) {

        const guild = message.guild;

        await guild.members.fetch().catch(() => null);

        const members = guild.members.cache;

        const humans = members.filter(m => !m.user.bot).size;
        const bots = members.filter(m => m.user.bot).size;

        const online = members.filter(m => m.presence?.status === "online").size;
        const offline = members.filter(m => !m.presence || m.presence.status === "offline").size;

        const embed = new EmbedBuilder()
            .setColor("#D3D3D3")
            .setTitle("<:member1:1514699741282304061> Member Count")
            .setDescription(
`> **__Humans__ :** \`${humans}\`
> **__Bots__ :** \`${bots}\`
> **__Total__ :** \`${members.size}\`
<:dot:1514706694079254730> **Online :** \`${online}\`
<:dot:1514706694079254730> **Offline :** \`${offline}\``
                .setThumbnail(message.guild.iconURL({ dynamic: true, size: 1024 }))
            );

        return message.reply({ embeds: [embed] });
    }
};
