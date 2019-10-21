import StatBotUser from "../models/schemas/statBotUser.schema";

export default async function upsert_user(user) {
    try {
        await StatBotUser.findOneAndUpdate({ id: user.id }, user, {
            upsert: true,
            useFindAndModify: false,
            setDefaultsOnInsert: true
        });
    } catch (error) {
        throw new Error(`${error.message} (upsert_user)`);
    }
}