import { getBotReplyTranslation } from "../translate";

export default class DocumentMessage {
    constructor(bot, chat, document) {
        this.bot = bot;
        this.chat = chat;
        this.document = document;
    }

    set_caption(caption, parse_mode) {
        this.caption = caption;
        this.parse_mode = parse_mode;
    }

    set_caption_translated(key, language, params, parse_mode) {
        this.caption = getBotReplyTranslation(key, language, params);
        this.parse_mode = parse_mode;
    }

    send() {
        let options = { disable_notification: true };
        if (this.parse_mode) options.parse_mode = this.parse_mode;

        this.bot.sendDocument(this.chat, this.document, options);
    }
}