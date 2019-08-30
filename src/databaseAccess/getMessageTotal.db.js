import Message from "../models/schemas/message.schema";

export async function message_total(chat_id) {
    try {
        return await Message.find({ "chat.id": chat_id }).countDocuments();
    } catch (error) {
        throw new Error(`${error.message} (message_total))`);
    }
}

export async function message_total_extended(chat_id) {
    let query = [{ $match: { "chat.id": chat_id } },
        {
            $group: {
                _id: "$message.type",
                count: { $sum: 1 }
            }
        }, {
            $sort: { count: -1 }
        }, {
            $project: {
                _id: 0,
                type: "$_id",
                count: 1
            }
        }
    ];

    try {
        return await Message.aggregate(query);
    } catch (error) {
        throw new Error(`${error.message} (message_total_extended))`);
    }
}