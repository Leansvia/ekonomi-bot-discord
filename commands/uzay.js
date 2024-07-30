const { EmbedBuilder } = require('discord.js');

const discoveries = [
    { name: 'Küçük Meteor Parçası', emoji: '☄️', value: 100 },
    { name: 'Nadir Mineral', emoji: '🔮', value: 500 },
    { name: 'Uzaylı', emoji: '👽', value: 3000 },
    { name: 'Galaktik Elmas', emoji: '💎', value: 5000 },
    { name: 'Antik Uzay Haritası', emoji: '🗺️', value: 10000 },
    { name: 'Kayıp Uzay Gemisi', emoji: '🚀', value: -1500 }, 
    { name: 'Küçük Yıldız Parçası', emoji: '⭐', value: 250 }, 
    { name: 'Karanlık Madde', emoji: '🌑', value: -500 }, 
    { name: 'Yıldız Tozu', emoji: '✨', value: 750 }, 
    { name: 'Eski Yıldız Haritası', emoji: '🗺️', value: 1500 } 
];

module.exports = {
    name: 'uzay',
    description: 'Uzayda keşif yapın ve değerli ödüller bulun! 🚀',
    aliases: ['spaceexplore', 'uzay'],
    cooldown: 5,
    async execute(message, args, db) {
        const user = message.author.id;

        // Keşifleri rastgele seçme
        const randomChance = Math.random() * 100;
        let discovery = discoveries[0]; // Varsayılan keşif (Küçük Meteor Parçası)

        if (randomChance <= 1) {
            discovery = discoveries[4]; // Antik Uzay Haritası (En nadir)
        } else if (randomChance <= 5) {
            discovery = discoveries[3]; // Galaktik Elmas
        } else if (randomChance <= 15) {
            discovery = discoveries[7]; // Yıldız Tozu
        } else if (randomChance <= 30) {
            discovery = discoveries[6]; // Kayıp Uzay Gemisi
        } else if (randomChance <= 45) {
            discovery = discoveries[5]; // Karanlık Madde
        } else if (randomChance <= 60) {
            discovery = discoveries[2]; // Uzaylı
        } else if (randomChance <= 80) {
            discovery = discoveries[1]; // Nadir Mineral
        } else if (randomChance <= 90) {
            discovery = discoveries[8]; // Eski Yıldız Haritası
        } else {
            discovery = discoveries[9]; // Küçük Yıldız Parçası
        }

        // Kullanıcının ödülünü güncelleme
        try {
            db.add(`cash_${user}`, discovery.value);
            const embed = new EmbedBuilder()
                .setTitle('🚀 Uzay Keşfi Sonucu')
                .setDescription(`**Tebrikler!**\n\nKeşfettiğiniz şey: ${discovery.emoji} ${discovery.name}\nDeğeri: ${discovery.value} para\n\nParanız güncellendi.`)
                .setColor(discovery.value < 0 ? '#FF0000' : '#1E90FF'); // Zararlı keşifler kırmızı

            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Veritabanı güncellenirken bir hata oluştu:', error);
            message.reply('❌ Talebinizi işlerken bir hata oluştu.');
        }
    }
};
