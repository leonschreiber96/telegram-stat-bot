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

        let introduction = new TextMessage(bot, chat, config.language_default, "Markdown");
        introduction.add_line_translated("introduction_group", { group_name: message.chat.title });

        let ask_for_consent = new TextMessage(bot, chat, config.language_default);
        ask_for_consent.add_line_translated("ask_for_consent_multiple_members");

        let reply = new MessageCollection([
            gif,
            introduction,
            ask_for_consent
        ]);

        reply.send_all();
    } else if (message.new_chat_members.some(x => !x.is_bot)) {
        let human_new_members = message.new_chat_members.filter(x => !x.is_bot);

        let introduction = new TextMessage(bot, chat, config.language_default, "Markdown");
        introduction.add_line_translated("introduction_new_members", { new_members: human_new_members.map(x => getUserAddress(x)).join(", ") });

        let ask_for_consent = new TextMessage(bot, chat, config.language_default);
        ask_for_consent.add_line_translated(human_new_members.length > 1 ? "ask_for_consent_multiple_members" : "ask_for_consent_single_member");

        let reply = new MessageCollection([
            introduction,
            ask_for_consent
        ]);

        reply.send_all();
    }
}

function getUserAddress(user) {
    if (user.first_name) {
        return `${user.first_name} ${user.last_name || ""}`.trim();
    } else {
        return user.username.trim();
    }
}