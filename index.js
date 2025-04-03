require('dotenv').config();
const fs = require('fs');
const {
    Client,
    GatewayIntentBits,
    ActivityType,
    PresenceUpdateStatus
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
});

client.once('ready', () => {
    console.log(`✅ Bot connecté en tant que ${client.user.tag}`);

    // 🔄 Forcer statut "en ligne"
    client.user.setStatus(PresenceUpdateStatus.Online);

    // 📖 Lire les statuts dynamiques
    const statuses = fs.readFileSync('./status.txt', 'utf-8')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

    let index = 0;
    setInterval(() => {
        console.log(`🔁 Changement de statut : ${statuses[index]}`);
        client.user.setActivity(statuses[index], { type: ActivityType.Playing });
        index = (index + 1) % statuses.length;
    }, 10000);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    if (message.content === '!ping') {
        await message.delete();
        const sent = await message.channel.send('⏳ Ping...');
        const latency = sent.createdTimestamp - message.createdTimestamp;
        sent.edit(`🏓 Pong ! (${latency} ms)`);
    }
});

// 🔌 Fermeture propre du bot
process.on('SIGINT', () => {
    console.log('🛑 Fermeture du bot...');
    client.destroy();
    process.exit();
});

client.login(process.env.DISCORD_TOKEN);
