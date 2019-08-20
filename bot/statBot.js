// Import external packages
import TelegramBot from "node-telegram-bot-api";
import request from "request-promise";

// Import bot command handler functions
import total_messages from "./commands/totalMessages";
import total_messages_extended from "./commands/totalMessagesExtended";

export default class StatBot {
    constructor(token) {
        this.bot = new TelegramBot(token, { polling: true });
    }

    start() {
        this.bot.on("message", (message, metadata) => {
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
        
        this.bot.onText(/^\/total_messages$/, (message) => total_messages(message, this.bot));
        this.bot.onText(/^\/total_messages_extended$/, (message) => total_messages_extended(message, this.bot));
    }
}

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