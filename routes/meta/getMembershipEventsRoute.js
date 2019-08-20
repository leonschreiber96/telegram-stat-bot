import { getMembershipEvents } from "../../controllers/metadata.controller";

export default function getMembershipEventsRoute(req, res) {
    let chatId = parseInt(req.params.chatId);

    if (isNaN(chatId)) {
        res.status(400).send("chatId parameter must be an integer");
    }

    getMembershipEvents(chatId)
        .then((result) => {
            res.status(200).json({
                result: result
            });
        }).catch((error) => {
            console.error(error);
            res.status(500).send(error);
        });
}