import { get_messages_by_user } from "../../controllers/message.controller";

export default async function get_messages_by_user_route(req, res) {
    let chat_id = parseInt(req.params.chatId);
    // let extended = req.query.extended === "true";

    if (isNaN(chat_id)) {
        res.status(400).send("chatId parameter must be an integer");
    }
    try {
        let result = await get_messages_by_user(chat_id);
        let total_messages = result.map(x => x.count).reduce((sum, value) => sum + value);

        for (let i = 0; i < result.length; i++) {
            result[i].percentage = +((result[i].count / total_messages) * 100).toFixed(2);
        }

        res.status(200).json({
            result: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}