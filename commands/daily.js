module.exports = {
    name: 'daily',
    description: 'Günlük paranı al. 💰',
    aliases: [],
    async execute(message, args, db) {
      const user = message.author.id;
      const lastDaily = db.get(`daily_${user}`);
  
      if (lastDaily && (Date.now() - lastDaily) < 86400000) {
        return message.reply('🕒 Zaten günlük paranı aldın. Sonra tekrar dene.');
      }
  
      const amount = Math.floor(Math.random() * 100) + 50;
      db.set(`daily_${user}`, Date.now());
      db.add(`cash_${user}`, amount);
  
      message.reply(`🎉 You have received ${amount} cash!`);
    }
  };
  