// Import internal packages
import TextMessage from "../messages/textMessage";
import DocumentMessage from "../messages/documentMessage";
import MessageCollection from "../messages/messageCollection";
import config from "../../../config.json";

export default function on_new_chat_members(message, stat_bot) {
    let chat = message.chat.id;
    let bot = stat_bot.bot;

    if (message.new_chat_members.some(x => x.id == stat_bot.own_id)) {
        let gif = new DocumentMessage(bot, chat, "CgADBAADfQEAAprc5VLEBzPUauGO4hYE");

        let introduction = new TextMessage("Markdown", bot, chat, config.language_default);
        introduction.add_line_translated("introduction", { group_name: message.chat.title });

        let ask_for_consent = new TextMessage("Markdown", bot, chat, config.language_default);
        ask_for_consent.add_line_translated("ask_for_consent");

        let reply = new MessageCollection([
            gif,
            introduction,
            ask_for_consent
        ]);

        reply.send_all();
    } else {
        let reply = new TextMessage("Markdown", bot, chat, "de");

        reply.send();
    }
}