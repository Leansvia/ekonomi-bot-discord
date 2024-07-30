const { Client, GatewayIntentBits, Collection, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const db = require('croxydb');
const config = require('./config.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Komutlar ve soğuma süreleri için koleksiyonlar oluşturuyoruz
client.commands = new Collection();
client.cooldowns = new Collection();
client.defaultPrefix = config.prefix;
client.prefix = db.get('prefix') || client.defaultPrefix;

// Belirli kanallarda komutların çalışmasını sağlamak için kanal ID'leri
const allowedChannels = ['1267794041706119219', '1267637753185570898', '1267849173517205544']; // Buraya izin verilen kanal ID'lerini ekleyin

// Komut dosyalarını yükleyin
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
  if (command.aliases) {
    command.aliases.forEach(alias => client.commands.set(alias, command));
  }
}

// Bot hazır olduğunda çalışacak fonksiyon
client.once('ready', () => {
  console.log(`Giriş yapıldı: ${client.user.tag}!`);

  // Belirli kanallara her 20 saniyede bir mesaj gönderme
  setInterval(() => {
    allowedChannels.forEach(channelId => {
      const channel = client.channels.cache.get(channelId);
      if (channel) {
        channel.send('** 🛡️  Bahislerde kaybetme ihtimalin var dikkatli olmalısın! 🛡️  **');
      }
    });
  }, 900000); // 20 saniye (20,000 ms)
});

// Mesajlar üzerinde komutları işlemek için fonksiyon
client.on('messageCreate', async message => {
  if (message.author.bot) return;

  // Kanal kontrolü
  if (!allowedChannels.includes(message.channel.id)) {
    return; // Eğer mesaj izin verilen kanallardan birinde değilse, işleme devam etme
  }

  // Prefix belirleme
  const prefixes = [client.prefix, client.defaultPrefix];
  const prefix = prefixes.find(p => message.content.startsWith(p));

  if (!prefix) return;

  // Komutları ve argümanları ayrıştırma
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  // Komut soğuma süresini kontrol etme
  const now = Date.now();
  const timestamps = client.cooldowns.get(command.name) || new Map();
  const cooldownAmount = (command.cooldown || 0) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      const reply = await message.reply(`Lütfen \`${command.name}\` komutunu tekrar kullanmadan önce ${timeLeft.toFixed(1)} saniye bekleyin.`);
      setTimeout(() => reply.delete(), timeLeft * 1000);
      return;
    }
  }

  timestamps.set(message.author.id, now);
  client.cooldowns.set(command.name, timestamps);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  // Komutu çalıştırma
  try {
    await command.execute(message, args, db, client);
  } catch (error) {
    console.error(error);
    message.reply('❌ Komutu çalıştırırken bir hata oluştu.');
  }
});

client.login(config.token);
