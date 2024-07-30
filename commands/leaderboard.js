const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'top',
    description: 'Sunucudaki en çok parası olan kullanıcıları sıralar.',
    cooldown: 5,
    async execute(message, args, db) {
        const guildId = message.guild.id;
        const users = db.get(`users_${guildId}`) || {}; // Sunucuya ait kullanıcı bilgileri

        // Kullanıcıları para miktarına göre sırala
        const sortedUsers = Object.entries(users)
            .map(([userId, cash]) => ({ userId, cash }))
            .sort((a, b) => b.cash - a.cash);

        // İlk 10 kullanıcıyı al
        const topUsers = sortedUsers.slice(0, 10);

        // Embed oluştur
        const embed = new EmbedBuilder()
            .setTitle('🏆 En Çok Parası Olanlar')
            .setColor('#FFD700')
            .setDescription(await Promise.all(topUsers.map(async (user, index) => {
                const member = await message.guild.members.fetch(user.userId).catch(() => null);
                const userTag = member ? member.user.tag : 'Bilinmeyen';
                return `**${index + 1}.** ${userTag} - ${user.cash} para`;
            })).then(lines => lines.join('\n')));

        message.reply({ embeds: [embed] });
    }
};
