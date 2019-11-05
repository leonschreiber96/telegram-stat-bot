import Message from "../models/schemas/message.schema";

export default async function messages_by_user(chat_id) {
    let query = [{ $match: { "chat.id": chat_id } },
        {
            $group: {
                "_id": "$from.id",
                "count": { $sum: 1 },
                "user": { $first: "$from" }
            }
        },
        {
            $sort: { "count": -1 }
        }
    ];

    try {
        return await Message.aggregate(query);
    } catch (error) {
        throw new Error(`${error.message} (messages_by_user)`);
    }
}