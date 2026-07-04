const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "membercount",

    async execute(message, args, client) {

        const guild = message.guild;

        const members = await guild.members.fetch();

        const humans = members.filter(m => !m.user.bot).size;
        const bots = members.filter(m => m.user.bot).size;

        const online = members.filter(m => m.presence?.status === "online").size;
        const offline = members.filter(m => !m.presence || m.presence.status === "offline").size;

        const total = guild.memberCount;

        const embed = new EmbedBuilder()
            .setColor("#D3D3D3")
            .setTitle("<:members:1459287850901180614> Member Count")
            .setDescription(
`> **__Humans__ :** \`${humans}\`
> **__Bots__ :** \`${bots}\`
> **__Total__ :** \`${total}\`
<:online:1459286574201311364> **Online :** \`${online}\`
<:invisible:1459286543146680430> **Offline :** \`${offline}\``
            );

        return message.reply({ embeds: [embed] });
    }
};
