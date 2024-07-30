const { EmbedBuilder } = require('discord.js');

const maxBet = 250000; // Maksimum bahis miktarı

module.exports = {
  name: 'cf',
  description: 'Bir bahse girin ve şansınızı deneyin!',
  aliases: ['coinflip'],
  cooldown: 10,
  args: true,
  usage: '<miktar> veya all',
  async execute(message, args, db) {
    const user = message.author.id;
    let bet;

    // Eğer 'all' girildiyse, tüm parayı yatır
    if (args[0] === 'all') {
      bet = db.get(`cash_${user}`) || 0;
      if (bet > maxBet) bet = maxBet; // Bahis limitini aşmamak için kontrol et
    } else {
      bet = parseInt(args[0]);

      if (isNaN(bet) || bet <= 0) {
        return message.reply('❌ Lütfen geçerli bir bahis miktarı belirtin.');
      }

      if (bet > maxBet) {
        return message.reply(`❌ Maksimum bahis miktarı ${maxBet} para.`);
      }
    }

    let cash = db.get(`cash_${user}`) || 0;

    if (cash < bet) {
      return message.reply('❌ Bu bahsi koyacak kadar paranız yok.');
    }

    // Bahisi düşür
    db.add(`cash_${user}`, -bet);

    // Şans hesaplama ve sonuç oluşturma
    const successChance = Math.random();
    const isWinning = successChance < 0.40; // %55 şansla kazanma
    const reward = isWinning ? bet * 2 : 0; // Kazanırsa bahsin 2 katı, kaybederse ödül yok

    if (isWinning) {
      db.add(`cash_${user}`, reward);
    }

    // Kaybettikleri durumda, paranın negatif olmamasını sağla
    if (!isWinning && db.get(`cash_${user}`) < 0) {
      db.set(`cash_${user}`, 0);
    }

    const embed = new EmbedBuilder()
      .setTitle('🎲 Coinflip Sonucu')
      .setDescription(`**Bahis Miktarı:** ${bet}\n` +
                      `**Sonuç:** ${isWinning ? `Kazandınız ${reward} para!` : `Kaybettiniz ${bet} para.`}`)
      .setColor(isWinning ? '#00FF00' : '#FF0000');

    await message.reply({ embeds: [embed] });
  }
};
