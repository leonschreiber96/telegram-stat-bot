import { getBotReplyTranslation } from "../translate";

export default class DocumentMessage {
    constructor(bot, chat, document) {
        this.bot = bot;
        this.chat = chat;
        this.document = document;
    }

    set_caption(parse_mode, caption) {
        this.parse_mode = parse_mode;
        this.caption = caption;
    }

    set_caption_translated(parse_mode, key, language, params) {
        this.parse_mode = parse_mode;
        this.caption = getBotReplyTranslation(key, language, params);
    }

    send() {
        let options = { disable_notification: true };
        if (this.parse_mode) options.parse_mode = this.parse_mode;

        this.bot.sendDocument(this.chat, this.document, options);
    }
}