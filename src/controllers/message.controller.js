import config from "../../config.json";
import all_texts from "../databaseAccess/getAllTexts.db";
import consent_level from "../databaseAccess/getConsentLevel.db";
import messages_by_hour from "../databaseAccess/getMessagesByHour.db";
import messages_by_user from "../databaseAccess/getMessagesByUser.db";
import messages_by_weekday from "../databaseAccess/getMessagesByWeekday.db";
import { message_total, message_total_extended } from "../databaseAccess/getMessageTotal.db";
import save_message from "../databaseAccess/postMessage.db";
import upsert_chat from "../databaseAccess/upsertChat.db";
import upsert_user from "../databaseAccess/upsertUser.db";


export async function get_message_total(chat_id) {
    return await message_total(chat_id);
}

export async function get_message_total_extended(chat_id) {
    return await message_total_extended(chat_id);
}

export async function get_messages_by_user(chat_id) {
    return await messages_by_user(chat_id);
}

export async function get_messages_by_user_extended(chat_id) {
    console.log(`Get messages by user extended for ${chat_id} not implemented`);
    // TODO: implement extended function
}

export async function get_messages_by_weekday(chat_id) {
    try {
        let messagesByWeekday = await messages_by_weekday(chat_id);

        return messagesByWeekday.map(x => {
            return {
                weekday: {
                    numeric: x._id.weekday - 1,
                    readable: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][x._id.weekday - 1]
                },
                count: x.count
            };
        });
    } catch (error) {
        throw new Error(error);
    }
}

export async function get_messages_by_hour(chat_id) {
    try {
        let db_result = await messages_by_hour(chat_id);
        let return_value = db_result.map(x => {
            return {
                hour: x._id.hour,
                count: x.count
            };
        });

        return return_value;
    } catch (error) {
        throw new Error(error);
    }
}

export async function get_word_count(chat_id) {
    try {
        let db_result = await all_texts(chat_id);

        let word_counts = db_result.map(x => x.text.split(" ").length);
        let word_sum = word_counts.reduce((x, y) => x + y, 0);
        let words_per_message = +(word_sum / db_result.length).toFixed(2);

        return {
            total: word_sum,
            avgPerMessage: words_per_message
        };
    } catch (error) {
        throw new Error(error);
    }
}

export async function post_message(message, metadata) {
    try {
        message.message_type = metadata.type === "document" ? (message.animation ? "gif" : "document") : metadata.type;

        let save = true;

        if (config.blacklist && config.blacklist.includes(message.chat.id)) save = false;
        if (config.whitelist && !config.whitelist.includes(message.chat.id)) save = false;

        if (save) {
            let consent = await consent_level(message.from).data_collection_consent;

            if (consent !== "deny") {
                await upsert_missing_documents(message);
                let preparedMessage = prepareMessageForDb(message, consent_level);

                console.log();
                console.log("-------------------------------------------------------------");
                console.log();
                console.log("Received message from bot:");
                console.log(preparedMessage);

                await save_message(message);
            }
        }
    } catch (error) {
        throw new Error(error);
    }
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

async function upsert_missing_documents(message) {
    if (message.chat) upsert_chat(message.chat);
    if (message.forward_from_chat) upsert_chat(message.forward_from_chat);

    if (message.from) await upsert_user(message.from);
    if (message.new_chat_members) message.new_chat_members.forEach(async user => await upsert_user(user));
}