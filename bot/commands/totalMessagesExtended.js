// Import external packages
import request from "request-promise";

// Import internal packages
import bot_response from "../botResponse";
import { getMessageTypeTranslation } from "../translate";

export default function total_messages_extended(message, bot) {
    let chat = message.chat.id;
    request({
        uri: `http://localhost:5000/messages/total/${chat}?extended=true`,
        json: true
    }).then((response) => {
        let total_messages_grouped = response.result;
        let total_messages = total_messages_grouped.reduce((a, b) => a + (b.count || 0), 0);
        let max_digits = Math.max(...total_messages_grouped.map(x => x.count.toString().length));

        let reply = new bot_response("Markdown", bot, chat, "de");
        reply.use_translation("total_messages_extended", {
            total_messages: total_messages
        });

        total_messages_grouped.forEach((x) => {
            reply.add_line(`\`${(" ".repeat(max_digits) + x.count).slice(-max_digits)} \`` +
                `${getMessageTypeTranslation(x.type, "de", x.count > 1)}`);
        });

        reply.send();

    }).catch((err) => console.log(err));
}