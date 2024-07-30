const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'zindan',
    description: 'Bir zindana girin ve bahis miktarınızın 2 katını kazanma şansı elde edin!',
    aliases: ['dungeon', 'd'],
    cooldown: 5,
    async execute(message, args, db) {
        const user = message.author.id;

        if (args.length < 1) {
            return message.reply('❌ Lütfen bahis miktarınızı belirtin.');
        }

        const amount = parseInt(args[0]);

        if (isNaN(amount) || amount <= 0) {
            return message.reply('❌ Geçerli bir miktar belirtin.');
        }

        // Bahis limiti kontrolü
        const maxAmount = 300000;
        if (amount > maxAmount) {
            return message.reply(`❌ Bahis miktarınız ${maxAmount} para biriminden fazla olamaz.`);
        }

        let cash = db.get(`cash_${user}`) || 0;

        if (cash < amount) {
            return message.reply('❌ Yeterli paranız yok.');
        }

        const events = [
            'Zindanın derinliklerine ilerliyorsunuz...',
            'Bir köşede eski bir hazine sandığı buldunuz. İçinde ne olduğunu merak ediyor musunuz?',
            'Karanlıkta bir çığlık duyuluyor, dikkatli olun!',
            'Sonunda bir canavarla karşılaştınız! Şimdi savaşma zamanı!',
            'Zindanın derinliklerinde büyülü bir kapı buldunuz. İçeri girmeye cesaret edebilir misiniz?',
            'Bir grup hazine avcısının kalıntılarına rastladınız, eski dostlar mı, yoksa düşmanlar mı?'
        ];

        const embed = new EmbedBuilder()
            .setTitle('🗡️ Zindan Macerası')
            .setDescription('**Zindana girdiniz...**\n\nDönüş bekleniyor...')
            .setColor('#FFD700');

        const messageSent = await message.reply({ embeds: [embed] });

        for (let i = 0; i < events.length; i++) {
            setTimeout(async () => {
                embed.setDescription(`**${events[i]}**`);
                await messageSent.edit({ embeds: [embed] });
            }, i * 3000); // Her bir mesaj 3 saniye arayla gösterilecek
        }

        setTimeout(async () => {
            const successChance = Math.random();
            let outcome;
            let color;

            if (successChance <= 0.10) {
                // %10 şansla büyük ödül
                outcome = `**Büyük Başarı!**\n\nZindanın derinliklerinde büyük bir hazine buldunuz ve ${amount * 3} para kazandınız.`;
                db.add(`cash_${user}`, amount * 3);
                color = '#00FF00'; // Yeşil
            } else if (successChance <= 0.30) {
                // %20 şansla başarılı sonuç
                outcome = `**Başarıyla çıktınız!**\n\nZindanın derinliklerinde başarılı oldunuz ve ${amount * 2} para kazandınız.`;
                db.add(`cash_${user}`, amount * 2);
                color = '#1E90FF'; // Mavi
            } else if (successChance <= 0.60) {
                // %30 şansla kısmi başarı
                outcome = `**Kısmi Başarı!**\n\nZindanın derinliklerinde bazı değerli nesneler buldunuz ama ${Math.min(amount, maxAmount)} para kaybettiniz.`;
                db.add(`cash_${user}`, -Math.min(amount, maxAmount)); // Maksimum kayıp miktarını uygula
                color = '#FFA500'; // Turuncu
            } else {
                // %40 şansla büyük zarar
                outcome = `**Başarısızlık!**\n\nZindanın derinliklerinde büyük bir tuzağa düştünüz ve ${Math.min(amount * 2, maxAmount)} para kaybettiniz.`;
                db.add(`cash_${user}`, -Math.min(amount * 2, maxAmount)); // Maksimum kayıp miktarını uygula
                color = '#FF0000'; // Kırmızı
            }

            // Sonuçları güncelle
            embed.setDescription(outcome);
            embed.setColor(color);
            await messageSent.edit({ embeds: [embed] });
        }, events.length * 3000 + 3000); // Oyun tamamlandıktan sonra sonucu göstermek için ek süre
    }
};
