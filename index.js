const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv');
const axios = require('axios')
// load variables from .env file into process.env
dotenv.config();

//TOKEN fetched using @BotFather to create  a new bot
const TOKEN = process.env.BOT_TOKEN;

if (!TOKEN) {
  console.error("❌ BOT_TOKEN not found. Check your .env file.");
  process.exit(1);
}

//create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(TOKEN, {polling: true});

bot.on('message', (msg) => {//message event listener
    const text = msg.text;
    console.log("Message received: ", text);
    bot.sendMessage(msg.chat.id, `You said :  ${text}`);
});

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Welcome! I am your friendly Telegram bot. Send me any message and I'll echo it back to you.");
});

bot.onText(/\/joke/, async (msg) => {
    try {
        const response = await axios.get('https://official-joke-api.appspot.com/random_joke');

        const setup = response.data.setup;
        const punchLine = response.data.punchline;

        bot.sendMessage(msg.chat.id, `${setup}\n\n${punchLine} 😂`);
    } catch (error) {
        console.error("Error fetching joke: ", error);
        bot.sendMessage(msg.chat.id, "Sorry, I couldn't fetch a joke for you at the moment.");
    }
});