// Import external packages
import request from "request-promise";

// Import internal packages
import TextMessage from "../messages/textMessage";
import { getMessageTypeTranslation } from "../translate";

export default function total_messages_extended(message, stat_bot) {
    let chat = message.chat.id;
    let log = ["/total_messages_extended"];

    request({
        uri: `http://localhost:${stat_bot.backend_port}/messages/total/${chat}?extended=true`,
        json: true
    }).then((response) => {
        let total_messages_grouped = response.result;
        let total_messages = total_messages_grouped.reduce((a, b) => a + (b.count || 0), 0);
        let max_digits = Math.max(...total_messages_grouped.map(x => x.count.toString().length));

        log.push(total_messages_grouped);
        stat_bot.log(log);

        let reply = new TextMessage(stat_bot.bot, chat, "de", "Markdown");
        reply.add_line_translated("total_messages_extended", { total_messages: total_messages });

        total_messages_grouped.forEach((x) => {
            reply.add_line(`\`${(" ".repeat(max_digits) + x.count).slice(-max_digits)} \`` +
                `${getMessageTypeTranslation(x.type, "de", x.count > 1)}`);
        });

        reply.send();

    }).catch((err) => console.log(err));
}