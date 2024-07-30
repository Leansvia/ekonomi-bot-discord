const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'remove',
  description: 'Remove cash from a user (admin only). 💸',
  aliases: [],
  args: true,
  usage: '<user> <amount>',
  async execute(message, args, db) {
    // Komutun sadece belirli roller tarafından kullanılmasını sağlamak
    const adminRole = '1129780439087849543'; // Yöneticilerin olduğu rolün ID'sini buraya yazın
    if (!message.member.roles.cache.has(adminRole)) {
      return message.reply('❌ Bu komutu kullanma izniniz yok.');
    }

    // Kullanıcı ve miktar argümanlarını al
    const targetUser = message.mentions.users.first();
    const amount = parseInt(args[1]);

    if (!targetUser || isNaN(amount) || amount <= 0) {
      return message.reply('❌ Geçerli bir kullanıcı ve miktar belirtin.');
    }

    // Kullanıcının bakiyesini güncelleme
    db.add(`cash_${targetUser.id}`, -amount);

    message.reply(`💸 Başarıyla ${targetUser.username} kullanıcısından ${amount} para silindi.`);
  }
};
