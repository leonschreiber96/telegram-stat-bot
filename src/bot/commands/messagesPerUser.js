// Import external packages
import request from "request-promise";

// Import internal packages
import TextMessage from "../messages/textMessage";

export default async function messages_per_user(message, stat_bot) {
    let log = [`/messages_per_user || http://localhost:${stat_bot.backend_port}/messages/byuser/${message.chat.id}`];
    try {
        let response = await request({
            uri: `http://localhost:${stat_bot.backend_port}/messages/byuser/${message.chat.id}`,
            json: true
        });

        let messages_per_user = response.result;

        log.push(messages_per_user);
        stat_bot.log(log);

        reply(stat_bot, message, messages_per_user);
    } catch (err) {
        console.log(err);
    }
}

function reply(stat_bot, message, messages_per_user) {
    let chat = message.chat.id;
    let bot = stat_bot.bot;
    let reply = new TextMessage(bot, chat, "de", "Markdown");

    let chart_data = {
        type: "outlabeledPie",
        data: {
            labels: [...messages_per_user.map(x => stat_bot.get_user_address(x.user))],
            datasets: [{
                label: "total message percentage",
                data: messages_per_user.map(x => x.percentage)
            }]
        },
        options: {
            plugins: {
                legend: false,
                outlabels: {
                    text: "%l %p",
                    color: "white",
                    stretch: 35,
                    font: {
                        resizable: true,
                        minSize: 12,
                        maxSize: 18
                    }
                }
            }
        }
    };

    reply.addLineTranslated("messages_per_user");

    reply.addChart(chart_data);

    messages_per_user.forEach((x) => {
        reply.addLine(`${messages_per_user.indexOf(x) + 1}. ${stat_bot.get_user_address(x._id)}: \`${x.count}\` messages (\`${x.percentage}%\`)`);
    });

    reply.send();
}