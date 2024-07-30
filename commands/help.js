const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Yardım menüsünü gösterir. 📜',
  aliases: [],
  async execute(message, args, db, client) {
    const commands = client.commands;
    const embed = new EmbedBuilder()
      .setTitle('📜 Yardım Menüsü')
      .setColor('#00FF00');

    commands.forEach(command => {
      if (command.name === command.aliases[0]) return;
      embed.addFields({ 
        name: `${client.prefix}${command.name} (${command.aliases.join(', ')})`, 
        value: command.description 
      });
    });

    message.reply({ embeds: [embed] });
  }
};
