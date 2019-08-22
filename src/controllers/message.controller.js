import config from "../../config.json";
import Message from "../models/schemas/message.schema";
import StatBotUser from "../models/schemas/statBotUser.schema";
import Chat from "../models/schemas/chat.schema";

export async function getMessageTotal(chat_id, extended) {
    if (extended) {
        return new Promise((resolve, reject) => {
            Message.aggregate([{
                $match: { "chat.id": chat_id }
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
                "chat.id": chat_id
            }).countDocuments((err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }
}

// TODO: use param to returne extended stats
// eslint-disable-next-line no-unused-vars
export async function getMessagesByUser(chat_id, extended) {
    return new Promise((resolve, reject) => {
        Message.aggregate([{ $match: { "chat.id": chat_id } },
            {
                $group: {
                    "_id": "$from",
                    "count": { $sum: 1 }
                }
            }
        ], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

export async function getMessagesByWeekday(chat_id) {
    return new Promise((resolve, reject) => {
        try {
            let messagesByWeekday = (Message.aggregate([{ "$match": { "chat.id": chat_id } },
                {
                    "$group": {
                        "_id": {
                            "weekday": {
                                "$dayOfWeek": {
                                    "date": {
                                        "$toDate": {
                                            "$multiply": [1000, "$date"]
                                        }
                                    }
                                }
                            },
                            "count": { "$sum": 1 }
                        }
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

    let save = true;

    if (config.blacklist && config.blacklist.includes(message.chat.id)) save = false;
    if (config.whitelist && !config.whitelist.includes(message.chat.id)) save = false;

    if (save) {
        getConsentLevel(message.from).then(result => {
            let consent_level = result.data_collection_consent;

            if (consent_level !== "deny") {

                upsertMissingDocuments(message);
                let preparedMessage = prepareMessageForDb(message, consent_level);

                console.log();
                console.log("-------------------------------------------------------------");
                console.log();
                console.log("Received message from bot:");
                console.log(preparedMessage);

                let messageSchema = new Message(preparedMessage);
                messageSchema.save(function(err) {
                    if (err) return console.error(err);
                });
            }
        });
    }
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

async function getConsentLevel(user) {
    return new Promise((resolve, reject) => {
        StatBotUser.findOne({ "id": user.id }).select({ "data_collection_consent": 1, "_id": 0 })
            .then(result => resolve(result))
            .catch(err => reject(err));
    });
}

function prepareMessageForDb(message, consent_level) {
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

    if (consent_level === "restricted") {
        delete preparedMessage.text;

        if (message.audio) {
            delete preparedMessage.audio.thumb.file_id;
            delete preparedMessage.audio.file_id;
        }
        if (message.document) {
            delete preparedMessage.document.thumb.file_id;
            delete preparedMessage.document.file_id;
        }
        if (message.animation) {
            delete preparedMessage.animation.thumb.file_id;
            delete preparedMessage.animation.file_id;
        }
        if (message.photo) {
            delete preparedMessage.photo.thumb.file_id;
            delete preparedMessage.photo.file_id;
        }
        if (message.sticker) {
            delete preparedMessage.sticker.thumb.file_id;
            delete preparedMessage.sticker.file_id;
        }
        if (message.video) {
            delete preparedMessage.video.thumb.file_id;
            delete preparedMessage.video.file_id;
        }
        if (message.voice) {
            delete preparedMessage.voice.thumb.file_id;
            delete preparedMessage.voice.file_id;
        }
        if (message.video_note) {
            delete preparedMessage.video_note.thumb.file_id;
            delete preparedMessage.video_note.file_id;
        }
        if (message.caption) {
            delete preparedMessage.caption.thumb.file_id;
            delete preparedMessage.caption.file_id;
        }
        if (message.contact) {
            delete preparedMessage.contact.thumb.file_id;
            delete preparedMessage.contact.file_id;
        }
        if (message.location) {
            delete preparedMessage.location.thumb.file_id;
            delete preparedMessage.location.file_id;
        }
        if (message.venue) {
            delete preparedMessage.venue.thumb.file_id;
            delete preparedMessage.venue.file_id;
        }
        if (message.poll) {
            delete preparedMessage.poll.thumb.file_id;
            delete preparedMessage.poll.file_id;
        }
    }

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

    StatBotUser.findOneAndUpdate(query, user, {
        upsert: true,
        useFindAndModify: false,
        setDefaultsOnInsert: true
    }, function(err) {
        if (err) return console.error(err);
    });
}

function upsertChat(chat) {
    let query = {
        "id": chat.id
    };

    Chat.findOneAndUpdate(query, chat, {
        upsert: true,
        useFindAndModify: false,
        setDefaultsOnInsert: true
    }, function(err) {
        if (err) return console.error(err);
    });
}