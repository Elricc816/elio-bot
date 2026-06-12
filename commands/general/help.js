const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "help",
  async execute(message, args, client) {

    const heartbeat = Date.now() - message.createdTimestamp;
    const api = Math.round(client.ws.ping);

    const embed = new EmbedBuilder()
      .setColor('#d3d3d3')
      .setDescription(
`### Hey, I'm **Elio**

<:white_arrow:1514714190231769219> **I'm a powerful Discord bot built for moderation, security, automation, and server management. Keep your community safe, organized, and engaging with a wide range of useful features.**

<a:BlackDot:1514727923175657654> **My prefix for this server is** \`!\`
<a:BlackDot:1514727923175657654> **Type \`!help [context]\` for more**
<a:BlackDot:1514727923175657654> **Total commands:** \`${client.commands.size}\`

**<:rocket:1514699262527541490> Quick Stats -
          <:arrow:1514699753462566953> Heartbeat: ${heartbeat} ms
          <:arrow:1514699753462566953> API: ${api} ms**

> **<:shield:1514699900225323108>  \`»\` Security**
> **<:admin:1514699907103985664>  \`»\` Automod**
> **<:mod1:1514699913919991839>  \`»\` Moderation**
> **<:member1:1514699741282304061>  \`»\` General**
> **<:brush:1514699282152685759>  \`»\` Embed System**
> **<:server:1514699921914331136>  \`»\` Utility**
> **<:dnd:1514699559094190220>  \`»\` Autoresponders**
> **<:timerr:1514699712681218094>  \`»\` Timer**
> **<:gwy2:1514699519244243107>  \`»\` Giveaway**
> **<:general:1514699942181081261>  \`»\` Music**
> **<:bug:1514699948480790608>  \`»\` Fun Commands**
> **<:pin:1514699935264673902>  \`»\` Sticky**
> **<a:loading_Google:1514727933183524964>  \`»\` Voice Commands**
> **<:ticket:1514699959847616573>  \`»\` Tickets**
> **<:CodeXFolder:1514708745756872845>  \`»\` Logging**
> **<:hat:1514699954264998041> \`»\` Voice Master**
> **<:bot1:1514699532686852227>  \`»\` Bot Settings**
> **<:visual:1514699307754721491>  \`»\` Invite Tracker**
> **<:vip:1514699727072133233>  \`»\` AI**
> **<:cart:1514699759250575472>  \`»\` Premium**

**<:info:1514699288674828310>  __Pro Tip__**
Try Elio Premium! <:diamond:1514699495768592635>

**<:link:1514699706788221120>  __Links__**
[Invite me](https://discord.com/oauth2/authorize?client_id=1514506916993306744&permissions=8&integration_type=0&scope=bot+applications.commands) <:dot:1514706694079254730> [Support](https://discord.gg/WJGpbAZRWs) <:devv:1514699301144756234>

-# Developed by <@1306606920836055043> <:dev:1514699929199706143>
-# <:heartt:1514699719400755432> Thanks For Using Elio!`
      )

      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setImage('https://cdn.discordapp.com/attachments/1514704811394728098/1514922360958881812/file_0000000053d471fa97a1c3a38c25570f.png?ex=6a2d20e4&is=6a2bcf64&hm=3033bdf3f0131eb7b1ece53615f28773b10937cfb762f2d84fc05c781b613f45&')

      .setFooter({
        text: `Executed by ${message.author.username}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true })
      })

      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};
