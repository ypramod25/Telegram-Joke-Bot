const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const TOKEN = process.env.BOT_TOKEN;

if (!TOKEN) {
  console.error("❌ BOT_TOKEN not found. Check your .env file.");
  process.exit(1);
}

const bot = new TelegramBot(TOKEN, { polling: true });

bot.on('message', (msg) => {
  const text = msg.text;
  console.log("Message received:", text);
  bot.sendMessage(msg.chat.id, `You said: ${text}`);
});

// /start command
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Welcome! I’m your friendly Telegram bot. Send /joke to get a random joke.");
});

// /joke command using native fetch
bot.onText(/\/joke/, async (msg) => {
  try {
    const res = await fetch('https://official-joke-api.appspot.com/random_joke');
    
    // If response is not OK
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    const data = await res.json();
    const { setup, punchline } = data;

    await bot.sendMessage(msg.chat.id, `${setup}\n\n${punchline} 😂`);
  } catch (error) {
    console.error("Error fetching joke:", error);
    await bot.sendMessage(msg.chat.id, "😞 Sorry, I couldn't fetch a joke right now.");
  }
});
