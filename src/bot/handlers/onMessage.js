// Import external packages
import request from "request-promise";

export default async function on_message(message, metadata, stat_bot) {
    try {
        await request({
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