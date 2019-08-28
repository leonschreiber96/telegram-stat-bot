import Message from "../models/schemas/message.schema";

export default async function all_texts(chatId) {
    try {
        return await Message.find({
            "chat.id": chatId,
            text: { "$exists": true }
        }, {
            text: 1,
            _id: 0
        });
    } catch (error) {
        throw new Error(`${error.message} (all_texts)`);
    }
}