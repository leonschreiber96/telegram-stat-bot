import Chat from "../models/schemas/chat.schema";

export default async function upsert_chat(chat) {
    try {
        await Chat.findOneAndUpdate({ id: chat.id }, chat, {
            upsert: true,
            useFindAndModify: false,
            setDefaultsOnInsert: true
        });
    } catch (error) {
        throw new Error(`${error.message} (upsert_chat)`);
    }
}