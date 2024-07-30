const { EmbedBuilder } = require('discord.js');

const cooldowns = new Map(); // Kullanıcıların soğuma sürelerini saklamak için bir harita
const maxBet = 250000; // Maksimum bahis miktarı

module.exports = {
  name: 'battle',
  description: 'Rastgele bir rakiple dövüşün. ⚔️',
  aliases: [],
  async execute(message, args, db) {
    const user = message.author.id;
    const cash = db.get(`cash_${user}`) || 0;
    let bet = parseInt(args[0]);

    if (isNaN(bet) || bet <= 0) {
      return message.reply('❌ Geçerli bir bahis miktarı girin.');
    }

    if (cash < bet) {
      return message.reply('❌ Yeterli paranız yok.');
    }

    // Bahis miktarını maksimum sınırla
    if (bet > maxBet) {
      bet = maxBet;
    }

    // Kullanıcının soğuma süresini kontrol et
    const cooldownTime = 1500; // 4.5 saniye
    const now = Date.now();
    const timestamps = cooldowns.get(user) || {};

    if (timestamps.lastUsed && now - timestamps.lastUsed < cooldownTime) {
      const timeLeft = Math.ceil((cooldownTime - (now - timestamps.lastUsed)) / 1000);
      return message.reply(`❌ Lütfen battle komutunu tekrar kullanmadan önce **${timeLeft} saniye** bekleyin.`);
    }

    // Kullanıcının soğuma süresini güncelle
    timestamps.lastUsed = now;
    cooldowns.set(user, timestamps);

    // 3 saniye bekleme süresi ekleyelim
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Kaybetme ihtimalini %60, kazanma ihtimalini %40 olarak ayarla
    const result = Math.random() < 0.5 ? 'win' : 'lose';
    let resultMessage;

    if (result === 'win') {
      db.add(`cash_${user}`, bet);
      resultMessage = `🎉 Dövüşü kazandınız ve ${bet} birim kazandınız!`;
    } else {
      db.add(`cash_${user}`, -bet);
      resultMessage = `❌ Dövüşü kaybettiniz ve ${bet} birim kaybettiniz.`;
    }

    const embed = new EmbedBuilder()
      .setTitle('⚔️ Dövüş Sonucu')
      .setDescription(resultMessage)
      .setColor(result === 'win' ? '#00FF00' : '#FF0000')
      .setTimestamp();

    message.reply({ embeds: [embed] });
  }
};
