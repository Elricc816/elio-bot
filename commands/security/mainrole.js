const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "mainrole",

  async execute(message) {

    const embed = new EmbedBuilder()
      .setColor('#D3D3D3')
      .setTitle('<:shieldd:1514699103043584121> Mainrole')
      .setDescription(
`<a:MekoLoading:1514728537452708022> **Available Mainrole Commands [5]**

\`,mainrole\`
> Configure mainrole settings.

\`,mainrole add\`
> Add a role to mainrole.

\`,mainrole remove\`
> Remove a role from mainrole.

\`,mainrole reset\`
> Reset all mainrole settings.

\`,mainrole show\`
> View current mainrole configuration.`
      )
      .setFooter({
        text: `Requested By ${message.author.username}`
      });

    return message.reply({
      embeds: [embed]
    });

  }
};
