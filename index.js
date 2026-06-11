const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();

const prefix = '!';

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
    'Elric on Top.',
    'Nukes? Not Today.',
    'Infinite Galaxies.',
    'Protecting Servers.',
    '!help | Security for Your Server.',
    'Built Different.',
    'One Step Ahead.',
    'Powered by Elio Devs </>.',
    'Keeping Chaos Away.',
    'Security Never Sleeps.',
    'Moderating the Multiverse.',
    'Trust Elio.',
    'Keeping Servers Safe.',
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
  setInterval(updateStatus, 5000);
});

client.on('messageCreate', message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  if (!command) {
    return message.reply("❌ Didn't recognize that command. Type !help for list of commands");
  }

  try {
    command.execute(message, args, client);
  } catch (err) {
    console.log(err);
    message.reply("❌ Error running command!");
  }
});

client.login(process.env.TOKEN);
