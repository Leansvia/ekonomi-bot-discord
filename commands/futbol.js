const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'futbol',
    description: 'Futbol maçına bahis yapın ve sonucu izleyin. 🏆',
    aliases: ['fb'],
    cooldown: 5,
    async execute(message, args, db) {
        const user = message.author.id;

        // Bahis miktarını al
        const amount = parseInt(args[0]);

        if (isNaN(amount) || amount <= 0) {
            return message.reply('❌ Geçerli bir bahis miktarı belirtin.');
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

        // Maç sonucu belirleme (kazanma ihtimali %40)
        const matchResult = Math.random() < 0.5 ? 'kazandı' : 'kaybetti';

        try {
            // Başlangıç mesajı
            const embed = new EmbedBuilder()
                .setTitle('⚽ Futbol Maçı Başlıyor!')
                .setDescription(`**Maç başlıyor!**\n\n🏟️ Maçın başlama düdüğü çaldı, heyecan dolu dakikalar başladı!`)
                .setColor('#008000');

            const messageSent = await message.reply({ embeds: [embed] });

            // Maç ortasında olay simülasyonları
            const events = [
                {
                    emoji: '🔝',
                    description: 'Takımınız hızla rakip kaleye doğru ilerliyor! Kaleci dikkatli olmalı!',
                },
                {
                    emoji: '⚽',
                    description: 'Tebrikler! Takımınızın golüyle stadyum yerinden oynayacak gibi görünüyor! 🎉',
                },
                {
                    emoji: '🛑',
                    description: 'Rakip kaleci müthiş bir refleksle topu kornere gönderdi. Şansınız devam ediyor!',
                },
                {
                    emoji: '🔥',
                    description: 'Sahada müthiş bir şut gerçekleşti! Her şey olabilir, gözlerinizi ekrandan ayırmayın!',
                },
                {
                    emoji: '⏳',
                    description: 'Maçın son dakikalarına giriyoruz. Heyecan dorukta, sonuç her an açıklanabilir!',
                },
                {
                    emoji: '🛡️',
                    description: 'Savunma oyuncuları topu müthiş bir şekilde uzaklaştırdı! Rakip bir gol fırsatını kaçırdı.',
                },
                {
                    emoji: '📈',
                    description: 'Takımınız oyunda büyük bir baskı kurdu ve rakip defansını zor durumda bırakıyor!',
                },
                {
                    emoji: '⚠️',
                    description: 'Rakip takımın oyuncusundan sert bir faul geldi! Maçta gerilim yükseldi!',
                },
                {
                    emoji: '🎯',
                    description: 'Takımınızın oyuncusundan müthiş bir şut! Top kaleye doğru hızla ilerliyor!',
                },
                {
                    emoji: '💔',
                    description: 'Üzgünüz, top direkten döndü! Maçın kader anlarından biri yaşandı.',
                }
            ];

            const randomEvent = () => events[Math.floor(Math.random() * events.length)];

            // Olay simülasyonları
            const simulateEvent = (delay) => {
                setTimeout(async () => {
                    const event = randomEvent();
                    embed.setDescription(`${event.emoji} **Olay:**\n\n${event.description}`);
                    await messageSent.edit({ embeds: [embed] });
                }, delay);
            };

            simulateEvent(2000); // 2 saniye sonra ilk olay
            simulateEvent(4000); // 4 saniye sonra ikinci olay
            simulateEvent(6000); // 6 saniye sonra üçüncü olay
            simulateEvent(8000); // 8 saniye sonra dördüncü olay

            // Maç sonucunu bekleyin
            setTimeout(async () => {
                let resultMessage = '';
                let resultDescription = '';

                if (matchResult === 'kazandı') {
                    resultDescription = '🎉 GOOOOL! 🎉';
                    resultMessage = `Tebrikler! Takımınız maçı kazandı! Bahsinizin **2 katını** kazandınız. Toplam kazanç: **${amount * 2}** para.`;
                    db.add(`cash_${user}`, amount * 2);
                } else {
                    resultDescription = '❌ Maç Sonu: Üzgünüz! ❌';
                    resultMessage = `Maalesef takımınız maçı kaybetti. Bahsiniz gitti ve **${amount}** para kaybettiniz. Bir sonraki maçı daha dikkatli izleyin!`;
                    db.add(`cash_${user}`, -amount);

                    // Kaybettikleri durumda, paranın negatif olmamasını sağla
                    if (db.get(`cash_${user}`) < 0) {
                        db.set(`cash_${user}`, 0);
                    }
                }

                // Sonuçları güncelle
                embed.setDescription(`**Sonuçlar:**\n\n${resultDescription}\n\n${resultMessage}`)
                     .setColor(matchResult === 'kazandı' ? '#00FF00' : '#FF0000') // Kazanırsa yeşil, kaybederse kırmızı
                     .setTimestamp();
                await messageSent.edit({ embeds: [embed] });
            }, 10000); // 10 saniye sonra maç sonucu

        } catch (error) {
            console.error('Veritabanı güncellenirken bir hata oluştu:', error);
            message.reply('❌ Talebinizi işlerken bir hata oluştu.');
        }
    }
};
