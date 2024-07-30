module.exports = {
  name: 'give',
  description: 'Başka bir kullanıcıya para gönderir. 💸',
  aliases: [],
  async execute(message, args, db) {
    const user = message.author.id;
    const target = message.mentions.users.first();
    const amountInput = args[1];

    if (!target || !amountInput) {
      return message.reply('❌ Geçerli bir kullanıcı ve miktar belirtin.');
    }

    // Miktarı analiz eden fonksiyon
    function parseAmount(amountStr) {
      const amount = parseInt(amountStr.replace(/k/i, '000').replace(/m/i, '000000').replace(/b/i, '000000000').replace(/[^0-9]/g, ''), 10);
      return isNaN(amount) ? 0 : amount;
    }

    const amount = parseAmount(amountInput);

    if (amount <= 0) {
      return message.reply('❌ Geçerli bir miktar belirtin.');
    }

    let cash = db.get(`cash_${user}`) || 0;

    if (cash < amount) {
      return message.reply('❌ Yeterli paranız yok.');
    }

    db.add(`cash_${user}`, -amount);
    db.add(`cash_${target.id}`, amount);

    message.reply(`💸 ${amount.toLocaleString()} birim parayı ${target.username} kullanıcısına gönderdiniz.`);
  }
};
