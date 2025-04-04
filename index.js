require('dotenv').config();
const fs = require('fs');
const path = require('path');
const {
  Client,
  GatewayIntentBits,
  ActivityType,
  PresenceUpdateStatus,
  Collection,
  Events
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();

// Chargement des commandes
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// Statuts tournants
client.once('ready', () => {
  console.log(`✅ Bot connecté en tant que ${client.user.tag}`);
  client.user.setStatus(PresenceUpdateStatus.Online);

  const statuses = fs.readFileSync('./status.txt', 'utf-8')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  let index = 0;
  setInterval(() => {
    client.user.setActivity(statuses[index], { type: ActivityType.Playing });
    index = (index + 1) % statuses.length;
  }, 10000);
});

// Commandes texte
client.on('messageCreate', async message => {
  if (message.author.bot) return;
  const command = client.commands.get(message.content.trim());
  if (command) command.execute(message, client);
});

// Boutons
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isButton()) return;
  const changementAnnee = require('./commands/changement-année');
  changementAnnee.handleButton(interaction, client);
});

// Fermeture propre
process.on('SIGINT', () => {
  console.log('🛑 Fermeture du bot...');
  client.destroy();
  process.exit();
});

client.login(process.env.DISCORD_TOKEN);
