const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'yarış',
    description: 'Yarışa katılın ve bahis yapın! 🏁',
    aliases: ['race'],
    cooldown: 5,
    async execute(message, args, db) {
        const user = message.author.id;

        // Bahis miktarını al
        const amount = parseInt(args[0]);

        if (isNaN(amount) || amount <= 0) {
            return message.reply('❌ Geçerli bir miktar belirtin.');
        }

        // Maksimum bahis limitini kontrol et
        const maxBet = 300000;
        if (amount > maxBet) {
            return message.reply(`❌ Maksimum bahis limiti ${maxBet} para birimidir.`);
        }

        let cash = db.get(`cash_${user}`) || 0;

        if (cash < amount) {
            return message.reply('❌ Yeterli paranız yok.');
        }

        // Yarış sonucu belirleme
        const result = Math.random();
        const win = result < 0.5; // %40 kazanma şansı, %60 kaybetme şansı

        try {
            // Yarış başlangıç mesajı
            const embed = new EmbedBuilder()
                .setTitle('🏁 Yarış Başlıyor!')
                .setDescription(`**Yarış başlıyor!**\n\n🏃‍♂️🏃‍♀️🏃‍♂️`)
                .setColor('#00FF00');

            const messageSent = await message.reply({ embeds: [embed] });

            // Yarış sonucunu bekleyin
            setTimeout(async () => {
                let resultMessage = '';
                let resultDescription = '';

                if (win) {
                    resultDescription = '🎉 Kazandınız!';
                    resultMessage = `Yarışı kazandınız! Bahsinizin 2 katını aldınız. Toplam kazanç: ${amount * 2} para.`;
                    db.add(`cash_${user}`, amount * 2);
                } else {
                    resultDescription = '❌ Kaybettiniz!';
                    resultMessage = `Yarışı kaybettiniz. Bahsiniz gitti. ${Math.min(amount, maxBet)} para kaybettiniz.`; // Kaybedilen miktarı maksimum limit ile sınırla
                    db.add(`cash_${user}`, -Math.min(amount, maxBet)); // Maksimum kayıp miktarını uygula
                }

                // Sonuçları güncelle
                embed.setDescription(`**Sonuçlar:**\n\n${resultDescription}\n\n${resultMessage}`);
                embed.setColor(win ? '#00FF00' : '#FF0000'); // Kazanırsa yeşil, kaybederse kırmızı
                await messageSent.edit({ embeds: [embed] });
            }, 5000); // 5 saniye sonra sonuç

        } catch (error) {
            console.error('Veritabanı güncellenirken bir hata oluştu:', error);
            message.reply('❌ Talebinizi işlerken bir hata oluştu.');
        }
    }
};
