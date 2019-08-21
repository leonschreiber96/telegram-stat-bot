// Import external packages
import TelegramBot from "node-telegram-bot-api";

// Import bot command and handler fundtions
import total_messages from "./commands/totalMessages";
import total_messages_extended from "./commands/totalMessagesExtended";
import on_message from "./handlers/onMessage";
import on_new_chat_members from "./handlers/onNewChatMembers";
import consent from "./commands/consent";

export default class StatBot {
    constructor(token, own_id, backend_port) {
        this.bot = new TelegramBot(token, { polling: true });
        this.own_id = own_id;
        this.backend_port = backend_port;
    }

    registerHandlers() {
        this.bot.on("message", (message, metadata) => on_message(message, metadata, this));
        this.bot.on("new_chat_members", message => on_new_chat_members(message, this));
        // TODO: special text in case there are zero messages yet (e.g. if nobody gave consent yet)
        this.bot.onText(/\/total_messages$/, message => total_messages(message, this));
        this.bot.onText(/\/total_messages_extended$/, message => total_messages_extended(message, this));
        this.bot.onText(/\/consent (\w+)$/, (message, match) => consent(message, match[1], this));
    }

    getUserAddress(user) {
        if (user.first_name) {
            return `${user.first_name} ${user.last_name || ""}`.trim();
        } else {
            return `@${user.username.trim()}`;
        }
    }
}

// bot.onText(/^\/messages_per_user$/, (message) => {
//     let chat = message.chat.id;
//     request({
//         uri: `http://localhost:5000/messages/byuser/${chat}`,
//         json: true
//     }).then((response) => {
//         let messages_per_user = response.result;
//         let reply = new text_response("Markdown", bot, chat, "de");
//         reply.use_translation("messages_per_user");
//     }).catch((err) => console.log(err));
// });