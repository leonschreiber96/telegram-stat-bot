// Import external packages
import request from "request-promise";

// Import internal packages
import TextMessage from "../messages/textMessage";

export default async function word_count(message, stat_bot) {
    let chat = message.chat.id;
    let log = ["/word_count"];

    let response = await request({
        uri: `http://localhost:${stat_bot.backend_port}/messages/wordCount/${chat}`,
        json: true
    });

    let result = response.result;

    log.push(result);
    stat_bot.log(log);

    let reply = new TextMessage(stat_bot.bot, chat, "de", "Markdown");

    reply.addLineTranslated("word_count", {
        total_words: result.total,
        avgPerMessage: result.avgPerMessage
    });

    reply.send();
}