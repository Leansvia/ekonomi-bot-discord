module.exports = {
  name: 'prefix',
  description: 'Botun prefix\'ini değiştirir. ✏️',
  aliases: [],
  async execute(message, args, db, client) {
    if (!args[0]) {
      return message.reply('❌ Lütfen yeni bir prefix belirtin.');
    }

    const newPrefix = args[0];

    // Prefix uzunluğu kontrolü ve geçerli karakterler
    if (newPrefix.length > 5) {
      return message.reply('❌ Prefix çok uzun. En fazla 5 karakter olabilir.');
    }

    if (!/^[\w-]+$/.test(newPrefix)) {
      return message.reply('❌ Prefix yalnızca harf, rakam ve tire (-) içerebilir.');
    }

    client.prefix = newPrefix;
    db.set('prefix', newPrefix);

    message.reply(`✅ Prefix başarıyla ${newPrefix} olarak değiştirildi.`);
  }
};
