module.exports = {
  name: 'hunt',
  description: 'Hayvan avlayın. 🐾',
  aliases: ['h'],
  cooldown: 5,
  async execute(message, args, db) {
    const user = message.author.id;
    let cash = db.get(`cash_${user}`) || 0;

    if (cash < 5) {
      return message.reply('❌ Av yapmak için en az 5 birim paraya ihtiyacınız var.');
    }

    const animals = ['rabbit', 'deer', 'fox', 'bear', 'wolf'];
    const emojis = {
      'rabbit': '🐇',
      'deer': '🦌',
      'fox': '🦊',
      'bear': '🐻',
      'wolf': '🐺'
    };
    const huntedAnimal = animals[Math.floor(Math.random() * animals.length)];

    db.add(`cash_${user}`, -5);
    db.add(`animal_${user}_${huntedAnimal}`, 1);
    db.push(`zoo_${user}`, huntedAnimal);

    message.reply(`🎯 ${emojis[huntedAnimal]} ${huntedAnimal} avladınız!`);
  }
};
