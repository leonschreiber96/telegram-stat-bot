// Import external packages
import request from "request-promise";

// Import internal packages
import TextMessage from "../messages/textMessage";

export default async function messages_per_user(message, stat_bot) {
    let log = [`/messages_per_weekday || http://localhost:${stat_bot.backend_port}/messages/byWeekday/${message.chat.id}`];
    try {
        let response = await request({
            uri: `http://localhost:${stat_bot.backend_port}/messages/byWeekday/${message.chat.id}`,
            json: true
        });

        let messages_per_weekday = response.result;

        // Sunday is indexed with 0 by defaul. Make it 7 and then sort ascending to get an ordered result
        messages_per_weekday = messages_per_weekday.map(x => {
            if (x.weekday.numeric === 0) {
                x.weekday.numeric = 7;
            }

            return x;
        }).sort((a, b) => a.weekday.numeric - b.weekday.numeric);

        log.push(messages_per_weekday);
        stat_bot.log(log);

        reply(stat_bot, message, messages_per_weekday);
    } catch (err) {
        console.log(err);
    }
}

function reply(stat_bot, message, messages_per_weekday) {
    let chat = message.chat.id;
    let bot = stat_bot.bot;
    let reply = new TextMessage(bot, chat, "de", "Markdown");

    let chart_data = {
        type: "bar",
        data: {
            labels: [...messages_per_weekday.map(x => x.weekday.readable)],
            datasets: [{
                label: "total message percentage",
                data: messages_per_weekday.map(x => x.count)
            }]
        }
    };

    reply.addLineTranslated("messages_per_weekday");

    reply.addChart(chart_data);

    messages_per_weekday.forEach((x) => {
        reply.addLine(`${x.weekday.readable}: \`${x.count}\` messages (\`${x.percentage}%\`)`);
    });

    reply.send();
}