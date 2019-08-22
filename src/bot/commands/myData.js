// Import external packages
import request from "request-promise";
import colors from "colors/safe";

// Import internal packages
import TextMessage from "../messages/textMessage";

export default async function total_messages(message, stat_bot) {
    let log = [`/my_data || http://localhost:${stat_bot.backend_port}/users/${message.from.id}`];

    try {
        let response = await request({
            uri: `http://localhost:${stat_bot.backend_port}/users/${message.from.id}/data`,
            json: true
        });

        log.push(response.result);

        let user_data = response.result.user;
        let message_count = response.result.message_count;
        let chat_count = response.result.chat_count;

        let group_reply = new TextMessage(stat_bot.bot, message.chat.id, "de", "Markdown", message.id);
        group_reply.add_line_translated("personal_data_group");
        group_reply.send();

        let private_reply = new TextMessage(stat_bot.bot, message.from.id, "de", "Markdown");
        private_reply.add_line_translated("personal_data_private", {
            user_address: stat_bot.get_user_address(user_data),
            group_name: message.chat.title,
            message_count: message_count || " ",
            chat_count: chat_count || " ",
            first_name: user_data.first_name || " ",
            last_name: user_data.last_name || " ",
            username: user_data.username || " ", 
            telegram_id: user_data.id || " ",
            consent_level: user_data.data_collection_consent || " ",
            language_code: user_data.language_code || " "
        });
        private_reply.send();

    } catch (error) {
        log.push(colors.bgRed.black("Error"));
        log.push(colors.red(error));
    } finally {
        stat_bot.log(log);
    }
}