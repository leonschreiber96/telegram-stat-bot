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
        StatBotUser.findOneAndUpdate({ "id": user.id }, user, { upsert: true })
            .then(resolve(true))
            .catch(err => reject(err));
    });
}