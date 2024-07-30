const { EmbedBuilder } = require('discord.js');

const minerals = [
    { name: 'Kömür', emoji: '🪨', value: 100 },
    { name: 'Demir', emoji: '⛏️', value: 200 },
    { name: 'Altın', emoji: '🏅', value: 500 },
    { name: 'Elmas', emoji: '💎', value: 1000 },
    { name: 'Zümrüt', emoji: '🟢', value: 2000 },
    { name: 'Ruby', emoji: '🔴', value: 3000 },
    { name: 'Safir', emoji: '🔵', value: 5000 },
    { name: 'Antik Kalıntılar', emoji: '🏺', value: 200000 },
    { name: 'Çöp', emoji: '🗑️', value: 2000 },
    { name: 'Aletin kırıldı', emoji: '🪓', value: -1500 },
    { name: 'Gümüş', emoji: '🥈', value: 250 }, 
    { name: 'Kükürt', emoji: '🟡', value: 300 }, 
    { name: 'Toprak', emoji: '🌍', value: -100 },
    { name: 'Asbest', emoji: '🧼', value: 300 }
];

module.exports = {
    name: 'madencilik',
    description: 'Rastgele madencilik yapın ve ödüller kazanın! ⛏️',
    aliases: ['maden', 'mine'],
    cooldown: 5,
    async execute(message, args, db) {
        const user = message.author.id;

        // Mineralleri rastgele seçme
        const randomChance = Math.random() * 100;
        let mineral = minerals[0]; // Varsayılan mineral (Kömür)

        if (randomChance <= 1) {
            mineral = minerals[7]; // Antik Kalıntılar (En nadir)
        } else if (randomChance <= 3) {
            mineral = minerals[6]; // Safir
        } else if (randomChance <= 6) {
            mineral = minerals[5]; // Ruby
        } else if (randomChance <= 10) {
            mineral = minerals[4]; // Zümrüt
        } else if (randomChance <= 20) {
            mineral = minerals[3]; // Elmas
        } else if (randomChance <= 30) {
            mineral = minerals[2]; // Altın
        } else if (randomChance <= 40) {
            mineral = minerals[1]; // Demir
        } else if (randomChance <= 50) {
            mineral = minerals[10]; // Gümüş
        } else if (randomChance <= 60) {
            mineral = minerals[11]; // Kükürt
        } else if (randomChance <= 70) {
            mineral = minerals[12]; // Toprak
        } else if (randomChance <= 80) {
            mineral = minerals[13]; // Asbest
        } else if (randomChance <= 85) {
            mineral = minerals[8]; // Aletin kırılması
        } else {
            mineral = minerals[9]; // Çöp
        }

        // Kullanıcının ödülünü güncelleme
        try {
            db.add(`cash_${user}`, mineral.value);
            const embed = new EmbedBuilder()
                .setTitle('⛏️ Madencilik Sonucu')
                .setDescription(`**Tebrikler!**\n\nBulduğunuz mineral: ${mineral.emoji} ${mineral.name}\nDeğeri: ${mineral.value} para\n\nParanız güncellendi.`)
                .setColor(mineral.value < 0 ? '#FF0000' : '#1E90FF'); // Zararlı mineraller kırmızı

            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Veritabanı güncellenirken bir hata oluştu:', error);
            message.reply('❌ Talebinizi işlerken bir hata oluştu.');
        }
    }
};
