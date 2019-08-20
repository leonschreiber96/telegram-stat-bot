// Import external packages
import TelegramBot from "node-telegram-bot-api";
import request from "request-promise";

// Import internal packages
import bot_response from "./bot_response";
import { getMessageTypeTranslation } from "./translate";
import config from "./config.json";

const bot = new TelegramBot(config.telegram_bot_token, {
    polling: true
});

bot.on("message", (message, metadata) => {
    try {
        console.log(metadata);
        console.log(message);
        request({
            method: "POST",
            uri: "http://localhost:5000/messages",
            json: true,
            body: {
                message: message,
                metadata: metadata
            },
            contentType: "application/json"
        });
    } catch (e) {
        console.log(e);
    }
});

bot.onText(/^\/total_messages$/, (message) => {
    let chat = message.chat.id;
    request({
        uri: `http://localhost:5000/messages/total/${chat}`,
        json: true
    }).then((response) => {
        let total_messages = response.result;

        let reply = new bot_response("Markdown", bot, chat, "de");

        reply.use_translation("total_messages", {
            total_messages: total_messages
        });

        reply.send();

    }).catch((err) => console.log(err));
});

bot.onText(/^\/total_messages_extended$/, (message) => {
    let chat = message.chat.id;
    request({
        uri: `http://localhost:5000/messages/total/${chat}?extended=true`,
        json: true
    }).then((response) => {
        let total_messages_grouped = response.result;
        let total_messages = total_messages_grouped.reduce((a, b) => a + (b.count || 0), 0);
        let max_digits = Math.max(...total_messages_grouped.map(x => x.count.toString().length));

        let reply = new bot_response("Markdown", bot, chat, "de");
        reply.use_translation("total_messages_extended", {
            total_messages: total_messages
        });

        total_messages_grouped.forEach((x) => {
            reply.add_line(`\`${(" ".repeat(max_digits) + x.count).slice(-max_digits)} \`` +
                `${getMessageTypeTranslation(x.type, "de", x.count > 1)}`);
        });

        reply.send();

    }).catch((err) => console.log(err));
});

// bot.onText(/^\/messages_per_user$/, (message) => {
//     let chat = message.chat.id;
//     request({
//         uri: `http://localhost:5000/messages/byuser/${chat}`,
//         json: true
//     }).then((response) => {
//         let messages_per_user = response.result;
//         let reply = new bot_response("Markdown", bot, chat, "de");
//         reply.use_translation("messages_per_user");
//     }).catch((err) => console.log(err));
// });