// Import external packages
import TelegramBot from "node-telegram-bot-api";

// Import bot command and handler fundtions
import chat_info from "./commands/chatInfo";
import consent from "./commands/consent";
import messages_per_user from "./commands/messagesPerUser";
import my_data from "./commands/myData";
import on_message from "./handlers/onMessage";
import on_new_chat_members from "./handlers/onNewChatMembers";
import total_messages from "./commands/totalMessages";
import total_messages_extended from "./commands/totalMessagesExtended";
import word_count from "./commands/wordCount";

export default class StatBot {
    constructor(token, own_id, backend_port) {
        this.bot = new TelegramBot(token, { autoStart: false });
        this.own_id = own_id;
        this.backend_port = backend_port;
    }

    async try_start() {
        try {
            let update = await this.bot.getUpdates();
            await this.bot.processUpdate(update);
            await this.bot.startPolling();
        } catch (error) {
            throw new Error(401);
        }
    }

    register_handlers() {
        this.bot.on("message", (message, metadata) => on_message(message, metadata, this));
        this.bot.on("new_chat_members", async message => await on_new_chat_members(message, this));

        this.bot.onText(/^\/consent (\w+)$/, (message, match) => consent(message, match[1], this));
        this.bot.onText(/^\/chat_info$/, async message => await chat_info(message, this));
        this.bot.onText(/^\/messages_per_user$/, message => messages_per_user(message, this));
        this.bot.onText(/^\/my_data$/, async message => await my_data(message, this));
        // TODO: special text in case there are zero messages yet (e.g. if nobody gave consent yet)
        this.bot.onText(/^\/total_messages$/, message => total_messages(message, this));
        this.bot.onText(/^\/total_messages_extended$/, message => total_messages_extended(message, this));
        this.bot.onText(/^\/word_count$/, async message => await word_count(message, this));
    }

    get_user_address(user) {
        if (user.first_name) {
            return `${user.first_name} ${user.last_name || ""}`.trim();
        } else {
            return `@${user.username.trim()}`;
        }
    }

    log(lines) {
        console.log();
        console.log("-------------------------------------------------------------");
        console.log();
        lines.forEach(x => console.log(x));
    }
}