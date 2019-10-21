import Message from "../models/schemas/message.schema";

export default async function save_message(message) {
    try {
        await new Message(message).save();
    } catch (error) {
        throw new Error(`${error.message} (save_message)`);
    }
}