require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const path = require('path');

// Initialize the bot
const bot = new Telegraf(process.env.BOT_TOKEN);

// Admin ID
const adminId = 2142342772; // Updated Admin ID

// Wallet Addresses
const wallets = {
  BEP20: '0x43d9cae1a55671f3650ae0ab08b9980750b33dbb',
  ERC20: '0x43d9cae1a55671f3650ae0ab08b9980750b33dbb',
  SOL: 'HfpXtbsEGn93Mbr8SwxZ8qVcuNpnAtkEt7bKYV3QEoGH',
  TRC20: 'TYERAZJthxMe6PFeu6TfVWrPeBuh3wJDM7',
};

// Welcome Message with Image
bot.start(async (ctx) => {
  try {
    const username = ctx.message.from.username || 'User';
    const userId = ctx.message.from.id;

    await ctx.replyWithPhoto('https://ibb.co/rMdN2qq', {
      caption: `Hello **@${username}** (ID: ${userId})\n
Welcome to 🚨 **BSC Gems Alert Team** 🚨\n

If you are interested in marketing your project, you've come to the right place.
Here at BSC Gems, we specialize in providing top-tier marketing services for your project, with a proven track record in the crypto space.

For more information on our analytics, check out our YouTube channel here: https://www.youtube.com/@BscGemsAlert/videos

To see our work and the success we've built in the crypto industry since 2021, you can view the following posts:

https://x.com/BSCGemsAlert/status/1463167574355681293

https://x.com/BSCGemsAlert/status/1462531558368288786

https://x.com/BSCGemsAlert/status/1476256353274499084

And for more information, contact us: https://t.me/BscGemsAlertSupport`,
      parse_mode: 'Markdown',
      reply_markup: Markup.inlineKeyboard([
        Markup.button.callback('Proceed', 'SHOW_PACKAGES'),
      ]),
    });
  } catch (error) {
    console.error('Error sending welcome image:', error);
    ctx.reply('Sorry, something went wrong. Please try again later.');
  }
});

// Show Business Packages
bot.action('SHOW_PACKAGES', async (ctx) => {
  try {
    await ctx.reply(
      `📢 Here are our **Business Packages & Rates**:\n\n` +
        `🥉🟪 **Daily Package**\n- 1 Tweet: $400\n- Pinned Tweet (24 Hours): $650\n- 1 Quote Tweet: $400\n- Retweet: $250\n- 1 post on Telegram: $300\n- 1 tweet + 1 post on Telegram: $600\n- Tag your project in our bio for 1 day: $200\n- Tag your project in our bio for 3 days: $500 \n` +
        `🥈🟦 **Weekly Package**\n- 3 Tweets: $900\n- Tag your project in our bio for 1 week: $700\n` +
        `🥇🟩 **Monthly Package**\n- 10 Tweets: $2,500\n\n` +
        `🏆🟨 **VIP Package**\n- 50 Tweets: $9,000 (Unlimited posting period)\n\n` +
        `✨ **Additional Perks:**\n💦 Tweets can be post, quote, retweet, or poll.\n📊 Choose the Monthly Package and get 15 days of FREE tagging in our bio!\n\n` +
        `Select a package below:`,
      Markup.inlineKeyboard([
        Markup.button.callback('🟪 🥉 Daily', 'SHOW_DAILY'),
        Markup.button.callback('🟦 🥈 Weekly', 'SHOW_WEEKLY'),
        Markup.button.callback('🟩 🥇 Monthly', 'SHOW_MONTHLY'),
        Markup.button.callback('🟨 🏆 VIP', 'SHOW_VIP'),
      ])
    );
  } catch (error) {
    console.error('Error showing packages:', error);
    ctx.reply('Sorry, something went wrong. Please try again later.');
  }
});

// Individual Packages Details
const packages = {
  SHOW_DAILY: {
    name: 'Daily Package',
    price: '$400 - $650',
    details:
      '- 1 Tweet: $400\n- Pinned Tweet (24 Hours): $650\n- 1 Quote Tweet: $400\n- Retweet: $250\n- 1 post on Telegram: $300\n- 1 tweet + 1 post on Telegram: $600\n- Tag your project in our bio for 1 day: $200\n- Tag your project in our bio for 3 days: $500',
  },
  SHOW_WEEKLY: {
    name: 'Weekly Package',
    price: '$900',
    details:
      '- 3 Tweets: $900\n- Tag your project in our bio for 1 week: $700',
  },
  SHOW_MONTHLY: {
    name: 'Monthly Package',
    price: '$2,500',
    details: '- 10 Tweets: $2,500',
  },
  SHOW_VIP: {
    name: 'VIP Package',
    price: '$9,000',
    details:
      '- 50 Tweets: $9,000\n(Unlimited posting period)',
  },
};

// Show Package Details
Object.keys(packages).forEach((key) => {
  bot.action(key, async (ctx) => {
    const { name, price, details } = packages[key];
    await ctx.reply(
      `🥇 **${name}**\n\n${details}\n\nClick below to proceed to payment.`,
      Markup.inlineKeyboard([
        Markup.button.callback('💰 Proceed to Payment', `PAY_${key}`),
      ])
    );
  });
});

// Payment Methods
['BEP20', 'ERC20', 'SOL', 'TRC20'].forEach((method) => {
  Object.keys(packages).forEach((key) => {
    bot.action(`PAY_${key}`, async (ctx) => {
      const { name, price } = packages[key];
      await ctx.reply(
        `You selected **${name}** (${price}).\n\nPlease confirm by selecting your payment method:`,
        Markup.inlineKeyboard([
          Markup.button.callback('🟦 BEP20', `PAYMENT_METHOD_BEP20_${key}`),
          Markup.button.callback('🟩 ERC20', `PAYMENT_METHOD_ERC20_${key}`),
          Markup.button.callback('🟨 SOL', `PAYMENT_METHOD_SOL_${key}`),
          Markup.button.callback('🟧 TRX (TRC20)', `PAYMENT_METHOD_TRC20_${key}`),
        ])
      );
    });

    bot.action(`PAYMENT_METHOD_${method}_${key}`, async (ctx) => {
      const { name, price } = packages[key];
      await ctx.reply(
        `You selected **${method}** for the **${name}** (${price}).\n\n` +
          `Wallet Address:\n\`${wallets[method]}\`\n\nClick "I've Paid" after completing the payment.`,
        Markup.inlineKeyboard([
          Markup.button.callback("I've Paid", `CONFIRM_PAYMENT_${key}_${method}`),
        ])
      );
    });

    bot.action(`CONFIRM_PAYMENT_${key}_${method}`, async (ctx) => {
      try {
        const user = ctx.from;
        const packageDetails = packages[key];
        await bot.telegram.sendMessage(
          adminId,
          `💰 **Payment Confirmation**\n\nUser: ${user.first_name} (@${user.username})\n` +
          `Package: ${packageDetails.name}\nPrice: ${packageDetails.price}\nPayment Method: ${method}`
        );

        await ctx.reply(
          `Thank you for your payment! Please send proof and post details to our support: https://t.me/BscGemsAlertSupport`
        );
      } catch (error) {
        console.error('Error during payment confirmation:', error);
      }
    });
  });
});

// Start the bot
bot.launch()
  .then(() => console.log('Bot is running...'))
  .catch((err) => {
    console.error('Error launching bot:', err);
    process.exit(1);
  });