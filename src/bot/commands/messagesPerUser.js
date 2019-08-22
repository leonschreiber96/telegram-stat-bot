// Import external packages
import request from "request-promise";

// Import internal packages
import TextMessage from "../messages/textMessage";

export default function messages_per_user(message, stat_bot) {
    let log = [`/messages_per_user || http://localhost:${stat_bot.backend_port}/messages/byuser/${message.chat.id}`];

    request({
        uri: `http://localhost:${stat_bot.backend_port}/messages/byuser/${message.chat.id}`,
        json: true
    }).then((response) => {
        let messages_per_user = response.result;

        log.push(messages_per_user);
        stat_bot.log(log);

        reply(stat_bot, message, messages_per_user);
    }).catch((err) =>
        console.log(err)
    );
}

function reply(stat_bot, message, messages_per_user) {
    let chat = message.chat.id;
    let bot = stat_bot.bot;
    let reply = new TextMessage(bot, chat, "de", "Markdown");

    let chart_data = {
        type: "bar",
        data: {
            labels: [...messages_per_user.map(x => stat_bot.get_user_address(x._id))],
            datasets: [{
                label: "total message percentage",
                data: messages_per_user.map(x => x.percentage)
            }]
        }
    };

    let url = `https://quickchart.io/chart?width=500&height=300&c=${JSON.stringify(chart_data).replace(/"/g, "'")}`;

    reply.add_line_translated("messages_per_user");
    // reply.add_line(url);
    reply.add_link(url, "‎");

    messages_per_user.forEach((x) => {
        reply.add_line(`${messages_per_user.indexOf(x) + 1}. ${stat_bot.get_user_address(x._id)}: \`${x.count}\` messages (\`${x.percentage}%\`)`);
    });

    reply.send();
}