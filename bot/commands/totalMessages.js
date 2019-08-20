// Import external packages
import request from "request-promise";

// Import internal packages
import bot_response from "../botResponse";

export default function total_messages(message, bot) {
    let chat = message.chat.id;
    request({
        uri: `http://localhost:5000/messages/total/${chat}`,
        json: true
    }).then((response) => {
        let total_messages = response.result;

        let reply = new bot_response("Markdown", bot, chat, "de");

        reply.use_translation("total_messages", {
            total_messages: total_messages
        });

        reply.send();

    }).catch((err) => console.log(err));
}