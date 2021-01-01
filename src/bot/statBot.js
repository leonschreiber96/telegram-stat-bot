// Import external packages
import TelegramBot from "node-telegram-bot-api";

// Import bot command and handler fundtions
import chat_info from "./commands/chatInfo";
import consent from "./commands/consent";
import messages_per_weekday from "./commands/messagesPerWeekday";
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
            this.info = await this.bot.getMe();
        } catch (error) {
            throw new Error(401);
        }
    }

    command_regex(command_text) {
        return new RegExp(`^/${command_text}(@${this.info.username})?$`, "i");
    }

    register_handlers() {
        this.bot.on("message", async (message, metadata) => await on_message(message, metadata, this));
        this.bot.on("new_chat_members", async message => await on_new_chat_members(message, this));

        this.bot.onText(this.command_regex("consent_deny"), async message => await consent(message, "deny", this));
        this.bot.onText(this.command_regex("consent_restricted"), async message => await consent(message, "restricted", this));
        this.bot.onText(this.command_regex("consent_full"), async message => await consent(message, "full", this));
        this.bot.onText(this.command_regex("chat_info"), async message => await chat_info(message, this));
        this.bot.onText(this.command_regex("messages_per_weekday"), async message => await messages_per_weekday(message, this));
        this.bot.onText(this.command_regex("messages_per_user"), async message => await messages_per_user(message, this));
        this.bot.onText(this.command_regex("my_data"), async message => await my_data(message, this));
        // TODO: special text in case there are zero messages yet (e.g. if nobody gave consent yet)
        this.bot.onText(this.command_regex("total_messages"), async message => await total_messages(message, this));
        this.bot.onText(this.command_regex("total_messages_extended"), async message => await total_messages_extended(message, this));
        this.bot.onText(this.command_regex("word_count"), async message => await word_count(message, this));
    }

    get_user_address(user) {
        if (user.first_name) {
            return `${user.first_name} ${user.last_name || ""}`.trim();
        } else if (user.username) {
            return `@${user.username.trim()}`;
        } else {
            return "";
        }
    }

    log(lines) {
        console.log();
        console.log("-------------------------------------------------------------");
        console.log();
        lines.forEach(x => console.log(x));
    }
}