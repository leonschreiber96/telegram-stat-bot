// Import external packages
import request from "request-promise";

// Import internal packages
import TextMessage from "../messages/textMessage";
import DocumentMessage from "../messages/documentMessage";
import MessageCollection from "../messages/messageCollection";
import config from "../../../config.json";

export default async function on_new_chat_members(message, stat_bot) {
    if (message.new_chat_members.some(x => x.id == stat_bot.own_id)) {
        self_enter_chat(message, stat_bot);
    } else if (message.new_chat_members.some(x => x.is_bot)) {
        await user_enter_chat(message, stat_bot);
    }
}

function self_enter_chat(message, stat_bot) {
    let chat = message.chat.id;
    let bot = stat_bot.bot;

    let gif = new DocumentMessage(bot, chat, "CgADBAADfQEAAprc5VLEBzPUauGO4hYE");

    let introduction = new TextMessage(bot, chat, config.language_default, "Markdown");
    introduction.add_line_translated("introduction_group", { group_name: message.chat.title });

    let ask_for_consent = new TextMessage(bot, chat, config.language_default);
    ask_for_consent.add_line_translated("ask_for_consent_multiple_members");

    let replies = new MessageCollection([
        gif,
        introduction,
        ask_for_consent
    ]);

    replies.send_all();
}

async function user_enter_chat(message, stat_bot) {
    let chat = message.chat.id;
    let bot = stat_bot.bot;

    let human_new_members = message.new_chat_members.filter(x => x.is_bot);

    human_new_members = await Promise.all(human_new_members.map(async (item) => {
        let response = await request({
            uri: `http://localhost:${stat_bot.backend_port}/users/${item.id}`,
            json: true
        });

        return {
            ...item,
            user_already_in_db: response.result.length > 0
        };
    }));

    let introduction = new TextMessage(bot, chat, config.language_default, "Markdown");

    if (human_new_members.every(x => x.user_already_in_db)) {
        if (human_new_members.length > 1) {
            introduction.add_line_translated("introduction_known_members", { new_members: human_new_members.map(x => stat_bot.get_user_address(x)).join(", ") });
        } else {
            introduction.add_line_translated("introduction_known_member", { new_members: human_new_members.map(x => stat_bot.get_user_address(x)).join(", ") });
        }
    } else if (human_new_members.some(x => x.user_already_in_db)) {
        introduction.add_line_translated("introduction_some_known_members", { new_members: human_new_members.map(x => stat_bot.get_user_address(x)).join(", ") });
    } else {
        introduction.add_line_translated("introduction_unknown_members", { new_members: human_new_members.map(x => stat_bot.get_user_address(x)).join(", ") });
    }

    let ask_for_consent = new TextMessage(bot, chat, config.language_default, "Markdown");
    ask_for_consent.add_line_translated(human_new_members.length > 1 ? "ask_for_consent_multiple_members" : "ask_for_consent_single_member");

    let replies = new MessageCollection([
        introduction,
        ask_for_consent
    ]);

    replies.send_all();
}