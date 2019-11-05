import { get_membership_events } from "../../controllers/metadata.controller";

export default async function get_membership_events_route(req, res) {
    let chat_id = parseInt(req.params.chatId);

    if (isNaN(chat_id)) {
        res.status(400).send("chatId parameter must be an integer");
    }

    try {
        let result = await get_membership_events(chat_id);

        res.status(200).json({
            result: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
}