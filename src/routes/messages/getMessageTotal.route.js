import { getMessageTotal } from "../../controllers/message.controller";

export default function getMessageTotalRoute(req, res) {
    let chatId = parseInt(req.params.chatId);
    let extended = req.query.extended === "true";

    if (isNaN(chatId)) {
        res.status(400).send("chatId parameter must be an integer");
    }

    getMessageTotal(chatId, extended)
        .then((result) => res.status(200).json({
            result: result
        }))
        .catch((error) => {
            console.error(error);
            res.status(500).send(error);
        });
}