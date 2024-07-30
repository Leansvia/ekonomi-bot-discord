module.exports = {
  name: 'autohunt',
  description: 'Belirtilen sayıda hayvanı otomatik olarak avlayın. 🦊',
  aliases: ['ah', 'hb'],
  async execute(message, args, db) {
    const user = message.author.id;
    const cash = db.get(`cash_${user}`) || 0;
    const amount = parseInt(args[0]);

    if (isNaN(amount) || amount <= 0) {
      return message.reply('❌ Geçerli bir miktar girin.');
    }

    const totalCost = amount * 10;

    if (cash < totalCost) {
      return message.reply(`❌ ${amount} hayvan avlamak için ${totalCost} birime ihtiyacınız var.`);
    }

    db.add(`cash_${user}`, -totalCost);
    message.reply(`🔄 ${amount} hayvan için av başlatıldı. Bu işlem ${amount * 5} dakika sürecek.`);

    for (let i = 1; i <= amount; i++) {
      setTimeout(() => {
        const animals = ['rabbit', 'deer', 'fox', 'bear', 'wolf'];
        const emojis = {
          'rabbit': '🐇',
          'deer': '🦌',
          'fox': '🦊',
          'bear': '🐻',
          'wolf': '🐺'
        };
        const huntedAnimal = animals[Math.floor(Math.random() * animals.length)];
        db.add(`animal_${user}_${huntedAnimal}`, 1);
        db.push(`zoo_${user}`, huntedAnimal);
        message.reply(`🎯 ${emojis[huntedAnimal]} ${huntedAnimal} avladınız!`);
      }, i * 300000); // 5 dakika (300000 ms)
    }
  }
};
