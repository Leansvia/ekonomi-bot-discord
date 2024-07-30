module.exports = {
  name: 'cash',
  description: 'Mevcut paranızı gösterir. 💵',
  aliases: [],
  async execute(message, args, db) {
    const user = message.author.id;
    const cash = db.get(`cash_${user}`) || 0;

    function formatCurrency(amount) {
      if (amount >= 1_000_000_000) {
        return `${(amount / 1_000_000_000).toFixed(1)}B`;
      } else if (amount >= 1_000_000) {
        return `${(amount / 1_000_000).toFixed(1)}M`;
      } else if (amount >= 1_000) {
        return `${(amount / 1_000).toFixed(1)}K`;
      } else {
        return amount.toString();
      }
    }

    message.reply(`💵 Mevcut liranız ${formatCurrency(cash)}.`);
  }
};
