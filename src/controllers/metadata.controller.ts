import config from "../../config.json";

import Message from "../models/schemas/message.schema";

const OWNID = config.own_id;
const LEFT = "left";
const JOINED = "joined";

// TODO: put database access in db function in separate file
export async function get_membership_events(chatId) {
    try {
        let relevantMessages = await Message.find({
            $and: [
                { $or: [{ new_chat_members: OWNID }, { left_chat_member: OWNID }] },
                { chat: chatId }
            ]
        }).sort({
            date: 1
        });

        let relevantEvents = relevantMessages.map(x => {
            return {
                date: new Date(x.date * 1000),
                type: x.left_chat_member ? LEFT : JOINED
            };
        });

        return relevantEvents;
    } catch (error) {
        throw new Error(error);
    }
}