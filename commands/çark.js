const { EmbedBuilder } = require('discord.js');

const wheelSegments = [
  { emoji: '🍎', prize: 1000 },
  { emoji: '🍌', prize: 2000 },
  { emoji: '🍇', prize: -3000 },
  { emoji: '🍍', prize: 5000 }
];
const spinAnimation = ['🔄', '🎡', '🌟'];

module.exports = {
  name: 'spin',
  description: 'Çarkı döndürün ve ödüller kazanın!',
  cooldown: 10,
  async execute(message, args, db) {
    const user = message.author.id;
    const embed = new EmbedBuilder()
      .setTitle('🎡 Çarkı Döndürme Başladı!')
      .setDescription(`**Dönüyor...**\n\n${spinAnimation.join(' ')}`)
      .setColor('#FFD700');

    const messageSent = await message.reply({ embeds: [embed] });

    setTimeout(() => {
      const result = wheelSegments[Math.floor(Math.random() * wheelSegments.length)];
      db.add(`cash_${user}`, result.prize);

      embed.setDescription(`**Sonuçlar:**\n\n${result.emoji}\n\n**Kazandınız ${result.prize} para!**`);
      messageSent.edit({ embeds: [embed] });
    }, 3000);
  }
};
