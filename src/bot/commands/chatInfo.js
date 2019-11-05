// Import external packages
import colors from "colors/safe";

// Import internal packages
import TextMessage from "../messages/textMessage";

export default async function chat_info(message, stat_bot) {
    let log = ["/chat_info || <no request>"];
    log.push(message.chat);

    try {
        let reply = new TextMessage(stat_bot.bot, message.chat.id, "de", "Markdown");

        if (message.chat.type === "private") {
            reply.addLineTranslated("private_chat_data", {
                id: message.chat.id || " ",
                first_name: message.chat.first_name || " ",
                last_name: message.chat.last_name || " ",
                username: message.chat.username || " ",
            });
        } else {
            reply.addLineTranslated("group_chat_data", {
                id: message.chat.id || " ",
                title: message.chat.title || " ",
                all_members_are_administrators: message.chat.all_members_are_administrators || " "
            });
        }
        reply.send();
    } catch (error) {
        log.push(colors.bgRed.black("Error"));
        log.push(colors.red(error));
    } finally {
        stat_bot.log(log);
    }
}