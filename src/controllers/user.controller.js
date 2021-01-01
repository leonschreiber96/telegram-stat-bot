import StatBotUser from "../models/schemas/statBotUser.schema";
import Message from "../models/schemas/message.schema";

export async function get_user(id) {
    try {
        return await StatBotUser.find({ id: id });
    } catch (error) {
        throw new Error(`${error.message} (get_user)`);
    }
}

export async function get_personal_data(id) {
    let user = (await StatBotUser.find({ "id": id }))[0];

    let messages_per_chat = await Message.aggregate([{
        $match: { "from.id": id }
    }, {
        $group: { _id: "$chat.id", count: { $sum: 1 } }
    }]);

    return {
        user,
        message_count: messages_per_chat.map(x => x.count).reduce((a, b) => a + b, 0),
        chat_count: messages_per_chat.length,
    };
}

export async function upsertUser(user) {
    if (user.data_collection_consent && !["full", "restricted", "deny"].includes(user.data_collection_consent)) {
        throw new Error({
            status: 422,
            message: "If the data_collection_consent property is set, it must be one of ['full', 'restricted', 'deny']"
        });
    } else {
        try {
            let result = await StatBotUser.findOneAndUpdate({ "id": user.id }, user, { upsert: true });
            return result;
        } catch (error) {
            throw new Error({
                status: 500,
                message: error
            });
        }
    }
}