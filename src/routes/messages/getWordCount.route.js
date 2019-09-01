import { get_word_count } from "../../controllers/message.controller";

export default async function get_word_count_route(req, res) {
    let chatId = parseInt(req.params.chatId);

    if (isNaN(chatId)) {
        res.status(400).send("chatId parameter must be an integer");
    }
    try {
        let result = await get_word_count(chatId);

        res.status(200).json({
            result: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}