import Message from "../models/schemas/message.schema";

export default async function messages_by_weekday(chat_id) {
    let query = [{ $match: { "chat.id": chat_id } },
        {
            $group: {
                _id: {
                    weekday: {
                        $dayOfWeek: {
                            date: {
                                $toDate: {
                                    $multiply: [1000, "$date"]
                                }
                            }
                        }
                    },
                    count: { "$sum": 1 }
                }
            }
        }
    ];

    try {
        return await Message.aggregate(query);
    } catch (error) {
        throw new Error(`${error.message} (messages_by_weekday)`);
    }
}