module.exports = {
   name: 'add',
   description: 'Add cash to a user (admin only). 💸',
   aliases: [],
   args: true,
   usage: '<user> <amount>',
   async execute(message, args, db) {
     // Komutun sadece belirli roller tarafından kullanılmasını sağlamak
     const adminRole = '1129780439087849543'; // Yöneticilerin olduğu rolün ID'sini buraya yazın
     if (!message.member.roles.cache.has(adminRole)) {
       return message.reply('❌ You do not have permission to use this command.');
     }
 
     // Kullanıcı ve miktar argümanlarını al
     const targetUser = message.mentions.users.first();
     const amount = parseInt(args[1]);
 
     if (!targetUser || isNaN(amount) || amount <= 0) {
       return message.reply('❌ Please specify a valid user and amount.');
     }
 
     // Kullanıcının bakiyesini güncelle
     db.add(`cash_${targetUser.id}`, amount);
 
     message.reply(`💸 Successfully added ${amount} cash to ${targetUser.username}.`);
   }
 };
 