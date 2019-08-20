import User from "../models/entities/user";

export function getUser(id) {
    return new Promise((resolve, reject) => {
        User.find({
            "id": id
        })
            .then(result => resolve(result))
            .catch(err => reject(err));
    });
}