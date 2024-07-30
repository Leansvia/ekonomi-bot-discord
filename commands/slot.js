const { EmbedBuilder } = require('discord.js');

const maxBet = 250000; // Maksimum bahis miktarı
const slots = [
  '🍆', // Örnek emoji
  '❤️', // Örnek emoji
  '🍒', // Örnek emoji
  '💵', // Örnek emoji
  '🌟', // Örnek emoji
  '🎰'  // Örnek emoji
];
const moving = '🔄'; // Hareketli emoji

module.exports = {
  name: 'slot',
  description: 'Slot makinesinde oyun oynayın! Bahsinizin 3 katını kazanabilirsiniz!',
  aliases: ['slots', 's'],
  cooldown: 5,
  args: true,
  usage: '<miktar|tümü>',
  async execute(message, args, db) {
    const user = message.author.id;
    let amount = parseInt(args[0]);
    const all = args[0] === 'all';

    if (isNaN(amount) && !all) {
      return message.reply('❌ Geçerli bir miktar belirtin veya "tümü" yazarak tüm paranızı bahis yapın.');
    }

    if (amount <= 0 && !all) {
      return message.reply('❌ 0 veya negatif miktarda bahis yapamazsınız.');
    }

    let cash = db.get(`cash_${user}`) || 0;

    if (all) {
      amount = cash;
    }

    if (amount > maxBet) {
      amount = maxBet;
    }

    if (cash < amount) {
      return message.reply('❌ Bu bahsi koyacak kadar paranız yok.');
    }

    const result = [];
    const rand = Math.random() * 100;

    let win = 0;

    if (rand <= 10) { // %10 kazanma ihtimali
      win = amount * 3; // 3x kazanç
      result.push(slots[4], slots[5], slots[4]);
    } else if (rand <= 30) { // %20 kazanma ihtimali
      win = amount * 2; // 2x kazanç
      result.push(slots[3], slots[3], slots[3]);
    } else if (rand <= 70) { // %40 kazanma ihtimali
      win = amount; // 1x kazanç
      result.push(slots[2], slots[2], slots[2]);
    } else {
      result.push(slots[Math.floor(Math.random() * slots.length)],
                 slots[Math.floor(Math.random() * slots.length)],
                 slots[Math.floor(Math.random() * slots.length)]);
    }

    const finalWin = win - amount;

    try {
      db.add(`cash_${user}`, finalWin);

      // Kullanıcının parası negatif olmamalı
      let newCash = db.get(`cash_${user}`);
      if (newCash < 0) {
        db.set(`cash_${user}`, 0);
      }
    } catch (error) {
      console.error('Veritabanına para eklerken bir hata oluştu:', error);
      return message.reply('❌ Hata: Veritabanına para eklenirken bir sorun oluştu.');
    }

    const embed = new EmbedBuilder()
      .setTitle('🎰 Slot Makinesi')
      .setDescription(`**Dönüyor...**\n\n${moving} ${moving} ${moving}`)
      .setColor('#FFD700');

    const messageSent = await message.reply({ embeds: [embed] });

    setTimeout(async () => {
      embed.setDescription(`**Sonuçlar:**\n\n${result.join(' ')}\n\n**${win > 0 ? 'Kazandınız' : 'Kaybettiniz'} ${Math.abs(finalWin)} para!**`);
      await messageSent.edit({ embeds: [embed] });
    }, 2000);
  }
};
