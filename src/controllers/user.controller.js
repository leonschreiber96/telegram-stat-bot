import StatBotUser from "../models/schemas/statBotUser.schema";
import Message from "../models/schemas/message.schema";

export function getUser(id) {
    return new Promise((resolve, reject) => {
        StatBotUser.find({ "id": id })
            .then(result => resolve(result))
            .catch(err => reject(err));
    });
}

export async function getPersonalData(id) {
    let user = (await StatBotUser.find({ "id": id }))[0];
    let messages_per_chat = await Message.aggregate([{
        $match: { "from.id": 37147413 }
    }, {
        $group: { _id: "$chat.id", count: { $sum: 1 } }
    }]);

    return {
        user,
        message_count: messages_per_chat.map(x => x.count).reduce((a, b) => a + b, 0),
        chat_count: messages_per_chat.length,
    };
}

export function upsertUser(user) {
    return new Promise((resolve, reject) => {
        if (user.data_collection_consent && !["full", "restricted", "deny"].includes(user.data_collection_consent)) {
            reject({
                status: 422,
                message: "If the data_collection_consent property is set, it must be one of ['full', 'restricted', 'deny']"
            });
        } else {
            StatBotUser.findOneAndUpdate({ "id": user.id }, user, { upsert: true })
                .then(result => resolve(result))
                .catch(err => reject({
                    status: 500,
                    message: err
                }));
        }
    });
}