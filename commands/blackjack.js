const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'blackjack',
    description: 'Play blackjack. 🃏',
    aliases: ['bj'],
    cooldown: 5,
    async execute(message, args, db) {
        const user = message.author.id;
        const bet = parseInt(args[0]);
        const maxBet = 400000; // Maksimum bahis miktarı
  
        if (isNaN(bet) || bet <= 0) {
            return message.reply('❌ Geçerli bir miktar giriniz.');
        }
  
        if (bet > maxBet) {
            return message.reply(`❌ Maksimum bahis miktarı ${maxBet}.`);
        }
  
        let cash = db.get(`cash_${user}`) || 0;
  
        if (cash < bet) {
            return message.reply('❌ Yeterli paran yok.');
        }
  
        // Oyuncunun kazanma ihtimalini %30 olarak ayarla
        const playerWins = Math.random() < 0.5; // %30 kazanma ihtimali
  
        // Kasa ve oyuncu ellerinin belirlenmesi
        const dealerHand = Math.floor(Math.random() * 21) + 1;
        const playerHand = Math.floor(Math.random() * 21) + 1;
  
        let resultMessage = `🃏 Kasa'nın eli: ${dealerHand}\n🃏 Senin elin: ${playerHand}\n`;
  
        if (playerWins) {
            db.add(`cash_${user}`, bet);
            resultMessage += `🎉 Kazandınız ${bet} para!`;
        } else {
            db.add(`cash_${user}`, -bet);
            resultMessage += `❌ Kaybettiniz ${bet} para.`;
        }
  
        message.reply(resultMessage);
    }
};
