import { getBotReplyTranslation } from "./translate";

export default class bot_response {
    constructor(parse_mode, bot, chat, language) {
        this.parse_mode = parse_mode;
        this.bot = bot;
        this.chat = chat;
        this.language = language;
        this.lines = [];
    }

    add_line(text) {
        this.lines.push(text);
    }

    add_link(url, display_text) {
        let text = display_text ? `[${display_text}](${url})` : url;
        this.lines.push(text);
    }

    use_translation(key, params) {
        this.lines.push(getBotReplyTranslation(key, this.language, params));
    }

    send() {
        let text = this.lines.join("\n");
        this.bot.sendMessage(this.chat, text, {
            parse_mode: this.parse_mode,
            disable_notification: true
        });
    }
}