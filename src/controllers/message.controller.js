import Message from "../models/schemas/message.schema";
import User from "../models/schemas/statBotUser.schema";
import Chat from "../models/schemas/chat.schema";

export async function getMessageTotal(chatId, extended) {
    if (extended) {
        return new Promise((resolve, reject) => {
            Message.aggregate([{
                $match: { "chat": chatId }
            },
            {
                $group: {
                    _id: "$message_type",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "count": -1 }
            },
            {
                $project: {
                    "_id": 0,
                    "type": "$_id",
                    "count": 1
                }
            }
            ])
                .then(result => resolve(result))
                .catch(err => reject(err));
        });
    } else {
        return new Promise((resolve, reject) => {
            Message.find({
                "chat": chatId
            }).countDocuments((err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }
}

// TODO: use param to returne extended stats
// eslint-disable-next-line no-unused-vars
export async function getMessagesByUser(chatId, extended) {
    return new Promise((resolve, reject) => {
        Message.aggregate([{
            $match: { "chat": chatId }
        },
        {
            $group: {
                _id: "$from",
                count: { $sum: 1 }
            }
        }
        ], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

export async function getMessagesByWeekday(chatId) {
    return new Promise((resolve, reject) => {
        try {
            let messagesByWeekday = (Message.aggregate([{
                "$match": { chat: chatId }
            },
            {
                "$group": {
                    "_id": {
                        "weekday": {
                            "$dayOfWeek": {
                                "date": {
                                    "$toDate": { "$multiply": [1000, "$date"] }
                                }
                            }
                        }
                    },
                    "count": { "$sum": 1 }
                }
            }
            ])).map(x => {
                return {
                    weekday: {
                        numeric: x._id.weekday - 1,
                        readable: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][x._id.weekday - 1]
                    },
                    count: x.count
                };
            });

            resolve(messagesByWeekday);
        } catch (error) {
            reject({
                message: "Could not read messages per weekday from database",
                error: error
            });
        }
    });
}

export async function getMessagesByHour(chatId) {
    return new Promise((resolve, reject) => {
        try {
            let messagesByHour = (Message.aggregate([{
                "$match": { "chat": chatId }
            }, {
                "$group": {
                    "_id": {
                        hour: {
                            "$hour": {
                                "date": {
                                    "$toDate": { "$multiply": [1000, "$date"] }
                                },
                                "timezone": Intl.DateTimeFormat().resolvedOptions().timeZone
                            }
                        }
                    },
                    "count": { "$sum": 1 }
                }
            }, {
                "$sort": {
                    "_id.hour": 1
                }
            }])).map(x => {
                return {
                    hour: x._id.hour,
                    count: x.count
                };
            });

            resolve(messagesByHour);
        } catch (error) {
            reject({
                message: "Could not read messages per hour from database",
                error: error
            });
        }
    });
}

export async function getWordCount(chatId) {
    return new Promise((resolve, reject) => {
        getAllTexts(chatId)
            .then((result) => {
                let wordCounts = result.map(x => x.text.split(" ").length);
                let wordSum = wordCounts.reduce((x, y) => x + y, 0);
                let average = +(wordSum / result.length).toFixed(2);

                resolve({
                    total: wordSum,
                    avgPerMessage: average
                });
            })
            .catch((error) => reject(error));
    });
}

export async function postMessage(message, metadata) {
    message.message_type = metadata.type === "document" ? (message.animation ? "gif" : "document") : metadata.type;
    
    upsertMissingDocuments(message);
    let preparedMessage = prepareMessageForDb(message);

    console.log("prepared message");
    console.log(preparedMessage);

    let messageSchema = new Message(preparedMessage);
    messageSchema.save(function(err) {
        if (err) return console.error(err);
    });
}

async function getAllTexts(chatId) {
    return new Promise((resolve, reject) => {
        Message.find({
            "chat": chatId,
            "text": { "$exists": true }
        }, {
            "text": 1,
            "_id": 0
        }, (err, result) => {
            if (err) reject(err);
            else(resolve(result));
        });
    });
}

function prepareMessageForDb(message) {
    let preparedMessage = Object.assign({}, message);

    preparedMessage.chat.chat_type = message.chat.type;
    delete preparedMessage.chat.type;

    if (message.reply_to_message) preparedMessage.reply_to_message = message.reply_to_message.message_id;

    if (message.entities && message.entities.length === 0) delete preparedMessage.entities;
    if (message.caption_entities && message.caption_entities.length === 0) delete preparedMessage.caption_entities;
    if (message.photo && message.photo.length === 0) delete preparedMessage.photo;
    if (message.new_chat_members && message.new_chat_members.length === 0) delete preparedMessage.new_chat_members;
    if (message.new_chat_photo && message.new_chat_photo.length === 0) delete preparedMessage.new_chat_photo;
    if (message.game && message.game.text_entities && message.game.text_entities.length === 0) delete preparedMessage.game.text_entities;
    if (message.game && message.game.photo && message.game.photo.length === 0) delete preparedMessage.game.photo;

    return preparedMessage;
}

function upsertMissingDocuments(message) {
    if (message.chat) upsertChat(message.chat);
    if (message.forward_from_chat) upsertChat(message.forward_from_chat);

    if (message.from) upsertUser(message.from);
    if (message.new_chat_members) message.new_chat_members.forEach(x => upsertUser(x));
}

function upsertUser(user) {
    let query = {
        "id": user.id
    };

    User.findOneAndUpdate(query, user, {
        upsert: true,
        useFindAndModify: false
    }, function (err) {
        if (err) return console.error(err);
    });
}

function upsertChat(chat) {
    let query = {
        "id": chat.id
    };

    Chat.findOneAndUpdate(query, chat, {
        upsert: true,
        useFindAndModify: false
    }, function (err) {
        if (err) return console.error(err);
    });
}
