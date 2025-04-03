require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.once('ready', () => {
  console.log(`✅ Bot connecté en tant que ${client.user.tag}`);

  const statuses = process.env.STATUS_MESSAGES.split('|');
  let index = 0;

  setInterval(() => {
    client.user.setActivity(statuses[index], { type: 'WATCHING' });
    index = (index + 1) % statuses.length;
  }, 10000);
});

client.on('messageCreate', async message => {
  if (message.content === '!ping') {
    const sent = await message.channel.send('⏳ Ping...');
    const latency = sent.createdTimestamp - message.createdTimestamp;
    sent.edit(`🏓 Pong ! (${latency} ms)`);
  }
});

client.login(process.env.DISCORD_TOKEN);