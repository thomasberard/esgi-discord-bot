module.exports = {
    name: '!ping',
    async execute(message) {
      const reply = await message.reply('⏳ Ping...');
      const latency = reply.createdTimestamp - message.createdTimestamp;
      await reply.edit(`🏓 Pong ! (${latency} ms)`);
  
      setTimeout(() => {
        reply.delete().catch(() => {});
        message.delete().catch(() => {});
      }, 10000);
    }
  };
  