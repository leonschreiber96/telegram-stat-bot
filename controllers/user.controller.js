import User from "../models/schemas/user.schema";

export function getUser(id) {
    return new Promise((resolve, reject) => {
        User.find({
            "id": id
        })
            .then(result => resolve(result))
            .catch(err => reject(err));
    });
}