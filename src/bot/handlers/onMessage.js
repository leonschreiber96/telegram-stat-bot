// Import external packages
import request from "request-promise";

export default function on_message(message, metadata) {
    try {
        request({
            method: "POST",
            uri: "http://localhost:5000/messages",
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