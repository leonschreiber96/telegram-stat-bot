import { getBotReplyTranslation } from "../translate";

export default class TextMessage {
    constructor(bot, chat, language, parse_mode, reply_to_message_id) {
        this.bot = bot;
        this.chat = chat;
        this.language = language;
        this.parse_mode = parse_mode;
        this.reply_to_message_id = reply_to_message_id;
        this.lines = [];
    }

    addLine(text) {
        this.lines.push(text);
    }

    addLink(url, display_text) {
        let text = display_text ? `[${display_text}](${url})` : url;
        this.lines.push(text);
    }

    addChart(chart_data) {
        let url = `https://quickchart.io/chart?bkg=black&width=500&height=300&c=${encodeURIComponent(JSON.stringify(chart_data).replace(/"/g, "'"))}`;
        this.addLink(url, "‎");
    }

    addLineTranslated(key, params) {
        this.lines.push(getBotReplyTranslation(key, this.language, params));
    }

    send() {
        try {
            let text = this.lines.join("\n");
            let options = {
                disable_notification: true
            };

            if (this.parse_mode) options.parse_mode = this.parse_mode;
            if (this.reply_to_message_id) options.reply_to_message_id = this.reply_to_message_id;

            this.bot.sendMessage(this.chat, text, options);
        } catch (error) {
            console.log(error);
        }
    }
}