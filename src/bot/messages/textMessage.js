import { getBotReplyTranslation } from "../translate";

export default class TextMessage {
    constructor(bot, chat, language, parse_mode) {
        this.bot = bot;
        this.chat = chat;
        this.language = language;
        this.parse_mode = parse_mode;
        this.lines = [];
    }

    add_line(text) {
        this.lines.push(text);
    }

    add_link(url, display_text) {
        let text = display_text ? `[${display_text}](${url})` : url;
        this.lines.push(text);
    }

    add_line_translated(key, params) {
        this.lines.push(getBotReplyTranslation(key, this.language, params));
    }

    send() {
        let text = this.lines.join("\n");
        let options = {
            disable_notification: true
        };

        if (this.parse_mode) options.parse_mode = this.parse_mode;

        this.bot.sendMessage(this.chat, text, options);
    }
}