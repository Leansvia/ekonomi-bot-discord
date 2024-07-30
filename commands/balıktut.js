const { EmbedBuilder } = require('discord.js');

const fishTypes = [
    { name: 'Gümüş Balık', emoji: '🐟', value: 100 },
    { name: 'Altın Balık', emoji: '🐠', value: 200 },
    { name: 'Elmas Balık', emoji: '🐡', value: 1000 },
    { name: 'Yılan Balığı', emoji: '🐍', value: 3000 }, // Zararlı
    { name: 'Kral Balığı', emoji: '🐋', value: 50000 },
    { name: 'Çöp', emoji: '🗑️', value: -50 }, // Zararlı
    { name: 'Eski Ayakkabı', emoji: '👞', value: -100 }, // Zararlı
    { name: 'Deniz Kabukları', emoji: '🐚', value: 50 },
    { name: 'Deniz Yıldızı', emoji: '🌟', value: 150 },
    { name: 'Hazine Sandığı', emoji: '🗃️', value: 5000 },
    { name: 'İskorpit', emoji: '🦑', value: 250 },
    { name: 'Kılıç Balığı', emoji: '🔪', value: 600 },
    { name: 'Ahtapot', emoji: '🐙', value: 350 },
    { name: 'Kerevit', emoji: '🦐', value: 400 },
    { name: 'Denizanası', emoji: ' medusa:', value: 150 }, // Zararlı
    { name: 'Mercan', emoji: '🌊', value: 200 },
    { name: 'Kalkan Balığı', emoji: '🦈', value: 800 },
    { name: 'Palamut', emoji: '🐟', value: 500 },
    { name: 'Sazan Balığı', emoji: '🐠', value: 250 },
    { name: 'Mürekkep Balığı', emoji: '🦑', value: 300 },
    { name: 'Hamsi', emoji: '🐟', value: 150 },
    { name: 'Sünger', emoji: '🧽', value: 50 },
    { name: 'Köpekbalığı', emoji: '🦈', value: 1000 },
    { name: 'Mavi Yengeç', emoji: '🦀', value: 350 },
    { name: 'Deniz Terebenti', emoji: '🐢', value: 200 },
    { name: 'Büyük İskorpit', emoji: '🦑', value: 400 },
    { name: 'Deniz Atı', emoji: '🐎', value: 600 },
    { name: 'Küçük İskorpit', emoji: '🦑', value: 150 },
    { name: 'Deniz Yıldızı', emoji: '⭐', value: 1000 }
];

module.exports = {
    name: 'balıktut',
    description: 'Rastgele balık tutun ve ödüller kazanın! 🎣',
    aliases: ['balıktut', 'fish'],
    cooldown: 5,
    async execute(message, args, db) {
        const user = message.author.id;

        // Balıkları rastgele seçme
        const randomChance = Math.random() * 100;
        let fish = fishTypes[0]; // Varsayılan balık (Gümüş Balık)

        if (randomChance <= 1) {
            fish = fishTypes[4]; // Kral Balığı (En nadir)
        } else if (randomChance <= 3) {
            fish = fishTypes[3]; // Yılan Balığı
        } else if (randomChance <= 6) {
            fish = fishTypes[2]; // Elmas Balık
        } else if (randomChance <= 15) {
            fish = fishTypes[1]; // Altın Balık
        } else if (randomChance <= 30) {
            fish = fishTypes[8]; // Deniz Yıldızı
        } else if (randomChance <= 50) {
            fish = fishTypes[7]; // Deniz Kabukları
        } else if (randomChance <= 70) {
            fish = fishTypes[0]; // Gümüş Balık
        } else if (randomChance <= 85) {
            fish = fishTypes[9]; // Hazine Sandığı
        } else if (randomChance <= 95) {
            fish = fishTypes[5]; // Çöp
        } else {
            fish = fishTypes[6]; // Eski Ayakkabı
        }

        // Kullanıcının ödülünü güncelleme
        try {
            db.add(`cash_${user}`, fish.value);
            const embed = new EmbedBuilder()
                .setTitle('🎣 Balık Tutma Sonucu')
                .setDescription(`**Tebrikler!**\n\nYakaladığınız balık: ${fish.emoji} ${fish.name}\nDeğeri: ${fish.value} para\n\nParanız güncellendi.`)
                .setColor(fish.value >= 0 ? '#1E90FF' : '#FF4500'); // Zararlı balıklar için kırmızı, diğerleri için mavi

            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error updating database:', error);
            message.reply('❌ Talebinizi işlerken bir hata oluştu.');
        }
    }
};
