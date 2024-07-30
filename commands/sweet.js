const { EmbedBuilder } = require('discord.js');

const sweets = ['🍭', '🍬', '🍫', '🍩', '🍪', '🍰', '🍮', '🧁'];
const rows = 5;
const columns = 5;
const dropSpeed = 1000; // Düşme süresi (ms)
const gameDuration = 5000; // Oyun süresi (ms)
const maxBet = 300000;
const winMultiplier = 3; // Maksimum kazanç çarpanı

module.exports = {
  name: 'sweetbonanza',
  description: 'Sweet Bonanza tarzı tatlılar eşleştirme oyunu oynayın! Bahis yaparak kazanın!',
  cooldown: 10,
  args: true,
  usage: '<miktar|all>',
  async execute(message, args, db) {
    const user = message.author.id;
    let bet = parseInt(args[0]);

    if (args[0] === 'all') {
      let cash = db.get(`cash_${user}`) || 0;
      bet = Math.min(cash, maxBet);
    } else if (isNaN(bet) || bet <= 0) {
      return message.reply('❌ Lütfen geçerli bir bahis miktarı belirtin.');
    }

    if (bet > maxBet) {
      return message.reply(`❌ Maksimum bahis miktarı ${maxBet} para.`);
    }

    let cash = db.get(`cash_${user}`) || 0;

    if (bet > cash) {
      return message.reply('❌ Bu bahsi koyacak kadar paranız yok.');
    }

    // Bahisi düşür
    db.set(`cash_${user}`, cash - bet);

    const generateEmptyBoard = () => {
      let board = '';
      for (let i = 0; i < rows; i++) {
        board += sweets.slice(0, columns).join(' ') + '\n';
      }
      return board;
    };

    const generateRandomRow = () => {
      return Array.from({ length: columns }, () => sweets[Math.floor(Math.random() * sweets.length)]).join(' ');
    };

    const updateBoard = (board) => {
      embed.setDescription('Tatlılar düşüyor...\n\n' + board);
      messageSent.edit({ embeds: [embed] });
    };

    const calculateReward = (bet) => {
      const reward = bet * winMultiplier;
      return reward > bet * 2 ? bet * 2 : reward;
    };

    const embed = new EmbedBuilder()
      .setTitle('🍭 Sweet Bonanza Başladı!')
      .setDescription('Tatlılar düşüyor...\n\n' + generateEmptyBoard())
      .setColor('#FF69B4');

    const messageSent = await message.reply({ embeds: [embed] });

    const runGame = async () => {
      let board = Array.from({ length: rows }, generateRandomRow).join('\n');
      updateBoard(board);

      const endTime = Date.now() + gameDuration;
      while (Date.now() < endTime) {
        // Tatlıları aşağıya hareket ettir
        board = board.split('\n').slice(1).join('\n') + '\n' + generateRandomRow();
        updateBoard(board);
        await new Promise(resolve => setTimeout(resolve, dropSpeed));
      }

      const isWinning = Math.random() < 0.50; // %30 şansla kazanma
      const finalReward = isWinning ? calculateReward(bet) : 0; // Kazanırsa ödül, kaybederse hiçbir şey kazanmaz

      // Loglama
      console.log(`Oyun Sonu: Kazanma Durumu: ${isWinning}`);
      console.log(`Bahis: ${bet}`);
      console.log(`Final Ödül: ${finalReward}`);

      const newCash = cash - bet + finalReward;
      db.set(`cash_${user}`, newCash); // Kazancı veya kaybı ekleyin

      // Görsel ve animasyon eklemeleri
      let finalMessage = `**Oyun Bitti!**\n\nSonuç:\n${board}\n\n`;
      finalMessage += isWinning ? `Kazandınız ${finalReward} para!` : `Kaybettiniz ${bet} para!`;
      embed.setDescription(finalMessage)
        .setColor(isWinning ? '#FFD700' : '#FF0000');

      // Ödül animasyonu veya patlama efekti ekleme
      if (isWinning) {
        embed.setDescription(`**🎉 Kazandınız ${finalReward} para! 🎉**\n\n${board}`);
      } else {
        embed.setDescription(`**💔 Kaybettiniz ${bet} para. 💔**\n\n${board}`);
      }

      await messageSent.edit({ embeds: [embed] });
    };

    runGame().catch(error => {
      console.error('Sweet Bonanza oyununda hata oluştu:', error);
      message.reply('❌ Oyun oynanırken bir hata oluştu.');
    });
  }
};
