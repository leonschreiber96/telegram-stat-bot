import { get_messages_by_user } from "../../controllers/message.controller";

export default function getMessagesByUserRoute(req, res) {
    let chatId = parseInt(req.params.chatId);
    let extended = req.query.extended === "true";

    if (isNaN(chatId)) {
        res.status(400).send("chatId parameter must be an integer");
    }

    get_messages_by_user(chatId, extended)
        .then((result) => {
            let total_messages = result.map(x => x.count).reduce((sum, value) => sum + value);

            for (let i = 0; i < result.length; i++) {
                result[i].percentage = +((result[i].count / total_messages) * 100).toFixed(2);
            }

            res.status(200).json({
                result: result
            });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send(error);
        });
}