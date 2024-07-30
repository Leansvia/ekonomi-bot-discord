module.exports = {
  name: 'sell',
  description: 'Avladığınız hayvanları satın. 💵',
  aliases: [],
  async execute(message, args, db) {
    const user = message.author.id;
    const animal = args[0];

    const animalPrices = {
      'rabbit': 10,
      'deer': 20,
      'fox': 30,
      'bear': 40,
      'wolf': 50
    };

    const emojis = {
      'rabbit': '🐇',
      'deer': '🦌',
      'fox': '🦊',
      'bear': '🐻',
      'wolf': '🐺'
    };

    if (animal === 'all') {
      let totalCash = 0;
      let soldAnimals = '';

      for (const [key, price] of Object.entries(animalPrices)) {
        const count = db.get(`animal_${user}_${key}`) || 0;
        if (count > 0) {
          totalCash += count * price;
          soldAnimals += `${emojis[key]} ${key}: ${count}\n`;
          db.set(`animal_${user}_${key}`, 0);  // Hayvan sayısını sıfırlıyoruz
        }
      }

      if (totalCash === 0) {
        return message.reply('❌ Satılacak hiçbir hayvanınız yok.');
      }

      db.add(`cash_${user}`, totalCash);

      const replyMessage = `💵 Tüm hayvanlarınızı sattınız ve ${totalCash} para kazandınız:\n${soldAnimals}`;
      return message.reply(replyMessage);
    } else {
      if (!animal) {
        return message.reply('❌ Satmak için bir hayvan belirtin veya "sell all" komutunu kullanarak tüm hayvanları satın.');
      }

      const animalCount = db.get(`animal_${user}_${animal}`) || 0;
      const price = animalPrices[animal];

      if (!price) {
        return message.reply('❌ Geçersiz bir hayvan türü belirttiniz.');
      }

      if (animalCount < 1) {
        return message.reply(`❌ Satacak hiç ${animal} hayvanınız yok.`);
      }

      db.add(`animal_${user}_${animal}`, -1);
      db.add(`cash_${user}`, price);

      message.reply(`💵 Bir ${emojis[animal]} ${animal} sattınız ve ${price} para kazandınız.`);
    }
  }
};
