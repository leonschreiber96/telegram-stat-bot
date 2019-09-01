import { get_message_total, get_message_total_extended } from "../../controllers/message.controller";

export default async function get_message_total_route(req, res) {
    let chat_id = parseInt(req.params.chatId);
    let extended = req.query.extended === "true";

    if (isNaN(chat_id)) {
        res.status(400).send("chatId parameter must be an integer");
    }

    let handler = extended ? get_message_total_extended : get_message_total;
    try {
        let result = await handler(chat_id);
        res.status(200).json({
            result: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}