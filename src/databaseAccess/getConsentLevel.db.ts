import StatBotUser from "../models/schemas/statBotUser.schema";

export default async function consent_level(user) {
    try {
        return await StatBotUser.findOne({ id: user.id }).select({ data_collection_consent: 1, _id: 0 });
    } catch (error) {
        throw new Error(`${error.message} (consent_level)`);
    }
}