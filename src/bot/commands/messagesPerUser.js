// Import external packages
import request from "request-promise";

// Import internal packages
import TextMessage from "../messages/textMessage";

export default function messages_per_user(message, stat_bot) {
    let chat = message.chat.id;
    let bot = stat_bot.bot;
    let log = ["/total_messages_extended"];

    console.log(`http://localhost:${stat_bot.backend_port}/messages/byuser/${chat}`);

    request({
        uri: `http://localhost:${stat_bot.backend_port}/messages/byuser/${chat}`,
        json: true
    }).then((response) => {
        let messages_per_user = response.result;
        let reply = new TextMessage(bot, chat, "de", "Markdown");

        log.push(messages_per_user);
        stat_bot.log(log);
        
        reply.add_line_translated("messages_per_user");

        messages_per_user.forEach((x) => {
            reply.add_line(`${messages_per_user.indexOf(x) + 1}. ${stat_bot.get_user_address(x._id)}: \`${x.count}\` messages (\`${x.percentage}%\`)`);
        });

        reply.send();
    }).catch((err) =>
        console.log(err)
    );
}