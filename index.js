const { DisTube } = require('distube');
const { YouTubePlugin } = require('@distube/youtube');
const ffmpeg = require("ffmpeg-static");

console.log("Node Version:", process.version);

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

const { QuickDB } = require("quick.db");
const db = new QuickDB();

const client = new Client({
  intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildVoiceStates
]
});

client.commands = new Collection();

client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  plugins: [new YouTubePlugin()],
  ffmpeg: {
    path: ffmpeg
  }
});

client.distube.on("ffmpegDebug", console.log);
client.distube.on("debug", console.log);

const prefix = ',';

// Load all commands from folders
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if (command.name) {
      client.commands.set(command.name, command);
    }
  }
}

client.once('ready', () => {
  console.log(`🤖 Elio Bot logged in as ${client.user.tag}`);

  const statuses = [
    'Elric on Top',
    'Nukes? Not Today.',
    'Infinite Galaxies.',
    'Protecting Servers.',
    '!help | Security for Your Server.',
    'Built Different',
    'One Step Ahead',
    'Powered by Elio Devs </>.',
    'Keeping Chaos Away',
    'Security Never Sleeps',
    'Moderating the Multiverse',
    'Trust Elio',
    'Keeping Servers Safe',
    () => `${client.guilds.cache.size} Servers`,
    () => `${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)} Users`
  ];

  let i = 0;

  const updateStatus = () => {
    const status =
      typeof statuses[i] === 'function'
        ? statuses[i]()
        : statuses[i];

    client.user.setActivity(status, {
      type: 3
    });

    i = (i + 1) % statuses.length;
  };

  updateStatus();
  setInterval(updateStatus, 6500);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  if (
    message.content === `<@${client.user.id}>` ||
    message.content === `<@!${client.user.id}>`
  ) {

    const { EmbedBuilder } = require('discord.js');

    const embed = new EmbedBuilder()
      .setColor('#D3D3D3')
      .setTitle('<:bot1:1514699532686852227> | Prefix Info')
      .setDescription(
`<:dot:1514706694079254730> **Prefix Help**
Hey ${message.author}! Here are my current prefixes:

<:dot:1514706694079254730> **Details**

> <:arrow:1514699753462566953> **Global Prefix** : \`,\`
> <:arrow:1514699753462566953> **Server Prefix** : \`,\`

> ***Tip***: *Use \`,help\` to see all my commands.*`
      );

    const pingMsg = await message.reply({
  embeds: [embed]
});

setTimeout(() => {
  pingMsg.delete().catch(() => {});
}, 5000);

return;
  }

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  if (!command) {

    const { EmbedBuilder } = require('discord.js');

    const embed = new EmbedBuilder()
        .setTitle('Unknown Command')
        .setDescription(
            "<:WarningIcon:1514708751385497721> Didn't recognize that command.\n\nUse `,help` for a list of commands."
        )
        .setColor('#FF5C5C')
        .setFooter({ text: 'Elio • Created by Elric' });

    return message.reply({ embeds: [embed] });
  }
  try {
  await command.execute(message, args, client);
} catch (err) {
    console.error("PLAY ERROR:", err);
    message.reply("<:WarningIcon:1514708751385497721> Error running command!");
  }
});
client.distube.on("error", (channel, error) => {
  console.log("DISTUBE ERROR:");
  console.error(error);
});

client.login(process.env.TOKEN);
