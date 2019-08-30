// Import external packages
import request from "request-promise";

export default function on_message(message, metadata, stat_bot) {
    console.log(message);
    try {
        request({
            method: "POST",
            uri: `http://localhost:${stat_bot.backend_port}/messages`,
            json: true,
            body: {
                message: message,
                metadata: metadata
            },
            contentType: "application/json"
        });
    } catch (e) {
        console.log(e);
    }
}