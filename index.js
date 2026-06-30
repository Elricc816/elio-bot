process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

console.log("Node Version:", process.version);

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

const { QuickDB } = require("quick.db");
const db = new QuickDB();

setInterval(() => {
  const mem = process.memoryUsage();
  console.log(
    "RAM:",
    Math.round(mem.rss / 1024 / 1024) + "MB"
  );
}, 60000);

const client = new Client({
  
  intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildVoiceStates
]
});

client.commands = new Collection();

// =========================
// EVENT LOADER (ADD THIS)
// =========================
const eventPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventPath, file);
  const event = require(filePath);

  if (typeof event === "function") {
    event(client);
  }
}

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
    'Nukes? Not Today.',
    'Protecting Servers.',
    ',help | Security for Your Server.',
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

if (message.reference) {
  try {
    const replied = await message.channel.messages.fetch(
      message.reference.messageId
    );

    const isAiMessage =
      replied.reactions.cache.some(
        r => r.emoji.id === "1514699727072133233"
      );

    if (isAiMessage) {
      const aiCommand = client.commands.get("ai");

      return aiCommand.execute(
        message,
        message.content.split(" ")
      );
    }
  } catch (err) {
    console.log(err);
  }
}
  
  if (message.author.bot) return;
  db.push(`chat_${message.author.id}`, message.content);

  const afkData = await db.get(`afk_${message.author.id}`);

if (afkData) {
    await db.delete(`afk_${message.author.id}`);

    message.reply({
        embeds: [
            new EmbedBuilder()
                .setColor("#D3D3D3")
                .setDescription(`<:Tick:1514714190500335677> Welcome back ${message.author}`)
        ]
    }).then(m => {
        setTimeout(() => m.delete().catch(() => {}), 5000);
    });
}

message.mentions.users.forEach(async (user) => {
    const data = await db.get(`afk_${user.id}`);
    if (!data) return;

    message.reply({
        embeds: [
            new EmbedBuilder()
                .setColor("#FFCC66")
                .setDescription(
                    `<:WarningIcon:1514708751385497721> ${user.username} is AFK\nReason: ${data.reason}`
                )
        ]
    });
});
  

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

client.login(process.env.TOKEN);
