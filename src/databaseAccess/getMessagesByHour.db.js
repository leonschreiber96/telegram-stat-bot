import Message from "../models/schemas/message.schema";

export default async function messages_by_hour(chat_id) {
    let query = [{ $match: { "chat.id": chat_id } },
        {
            $group: {
                _id: {
                    hour: {
                        $hour: {
                            date: {
                                $toDate: {
                                    $multiply: [1000, "$date"]
                                }
                            },
                            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                        }
                    }
                },
                count: { "$sum": 1 }
            }
        },
        {
            $sort: { "_id.hour": 1 }
        }
    ];

    try {
        return await Message.aggregate(query);
    } catch (error) {
        throw new Error(`${error.message} (messages_by_hour)`);
    }
}