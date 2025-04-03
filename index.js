require('dotenv').config();
const fs = require('fs');
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

client.once('ready', () => {
    console.log(`✅ Bot connecté en tant que ${client.user.tag}`);
  
    client.user.setStatus('online');
  
    const statuses = fs.readFileSync('./status.txt', 'utf-8')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  
    let index = 0;
    setInterval(() => {
      console.log(`🔁 Changement de statut : ${statuses[index]}`);
      client.user.setActivity(statuses[index], { type: 'PLAYING' });
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