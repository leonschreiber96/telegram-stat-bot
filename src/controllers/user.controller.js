import StatBotUser from "../models/schemas/statBotUser.schema";

export function getUser(id) {
    return new Promise((resolve, reject) => {
        StatBotUser.find({ "id": id })
            .then(result => resolve(result))
            .catch(err => reject(err));
    });
}

export function upsertUser(user) {
    return new Promise((resolve, reject) => {
        if (user.data_collection_consent && !["full", "restricted", "deny"].includes(user.data_collection_consent)) {
            reject({
                status: 422,
                message: "If the data_collection_consent property is set, it must be one of ['full', 'restricted', 'deny']"
            });
        } else {
            StatBotUser.findOneAndUpdate({ "id": user.id }, user, { upsert: true })
                .then(result => resolve(result))
                .catch(err => reject({
                    status: 500,
                    message: err
                }));
        }
    });
}