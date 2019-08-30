import { post_message } from "../../controllers/message.controller";

export default function postMessageRoute(req, res) {
    let contentData = [];
    req.on("data", chunk => {
        contentData.push(chunk);
    });

    req.on("end", () => {
        let content = JSON.parse(contentData);
        let message = content.message;
        let metadata = content.metadata;

        post_message(message, metadata)
            .catch((error) => {
                console.error(error);
                res.status(500).send(error);
            });
    });
}