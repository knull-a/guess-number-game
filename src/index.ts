import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import { againOptions, gameOptions } from "./options.js";

dotenv.config();

const bot = new TelegramBot(process.env.BOT_TOKEN ?? "", {
  polling: true,
});

let chats = ["1"];

bot.setMyCommands([
  {
    command: "/start",
    description: "Greetings",
  },
  {
    command: "/info",
    description: "User info",
  },
  {
    command: "/game",
    description: "Start game",
  },
]);

bot.on("message", async (msg) => {
  const { text } = msg;
  const chatId = msg.chat.id;

  try {
    if (text === "/start") {
      await bot.sendMessage(chatId, `Welcome, ${msg.from?.first_name}!`);
      return await bot.sendSticker(
        chatId,
        "CAACAgIAAxkBAAEKmT9lON1ybAJkZkNfYInsQ7QMhs19rwAC0Q8AAqeAyEtx1lPcgJ-pWTAE"
      );
    }

    if (text === "/info") {
      return await bot.sendMessage(chatId, `Your id is: ${msg.from?.id}!`);
    }

    if (text === "/game") {
      await bot.sendMessage(chatId, "Try to guess number from 0 to 9!");
      return await startGame(chatId);
    }

    return bot.sendMessage(chatId, "I don't understand. Try again!");
  } catch (error) {
    bot.sendMessage(
      chatId,
      "An error occured. Please refer to our technical support. @iz8jnek"
    );
    console.error(error);
  }
});

bot.on("callback_query", async (msg) => {
  const { data } = msg;
  const chatId = msg.message?.chat.id;
  if (chatId) {
    if (data === "/again") {
      return startGame(chatId);
    }
    if (data === chats[chatId]) {
      return await bot.sendMessage(chatId, `You've guessed ${msg.data}!`, againOptions);
    } else {
      return await bot.sendMessage(
        chatId,
        `Unfortunately, you didn't guess the number. It was ${chats[chatId]}. Try again!`, againOptions
      );
    }
  }
});

async function startGame(chatId: number) {
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = String(randomNumber);
  return await bot.sendMessage(chatId, "Choose the number: ", gameOptions);
}
