// Import external packages
import request from "request-promise";

// Import internal packages
import TextMessage from "../messages/textMessage";

export default function consent(message, consent_level, stat_bot) {
    let chat = message.chat.id;

    request({
        method: "PUT",
        uri: `http://localhost:${stat_bot.backend_port}/users`,
        json: true,
        body: {
            ...message.from,
            data_collection_consent: consent_level
        },
        contentType: "application/json"
    }).then((response) => {
        let reply = new TextMessage(stat_bot.bot, chat, "de", "Markdown");

        reply.add_line_translated("confirm_consent_update", {
            user_name: stat_bot.get_user_address(message.from),
            previous_value: response.result.data_collection_consent,
            new_value: consent_level
        });

        reply.send();
    }).catch(error => {
        console.error(error.message);

        if (error.statusCode === 422) {
            let reply = new TextMessage(stat_bot.bot, chat, "de", "Markdown");

            reply.add_line_translated("invalid_consent_update");

            reply.send();
        }
    });
}