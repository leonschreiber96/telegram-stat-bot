import StatBotUser from "../models/schemas/statBotUser.schema";

export default async function consent_level(user) {
    try {
        let foundUser = await StatBotUser.findOne({ id: user.id });
        return foundUser.data_collection_consent;
    } catch (error) {
        throw new Error(`${error.message} (consent_level)`);
    }
}