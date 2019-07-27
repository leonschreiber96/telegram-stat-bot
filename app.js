import mongoose from 'mongoose';
import TelegramBot from 'node-telegram-bot-api'

import Message from './models/schemas/message.schema'
import Chat from './models/schemas/chat.schema'
import User from './models/schemas/user.schema'

mongoose.connect('mongodb://localhost/statbottest', {
    useNewUrlParser: true
});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
    const bot = new TelegramBot('772396754:AAE59fupmSDD9TQfbBBiBv-XN6lA3KMzirA', {
        polling: true
    });

    bot.on('message', (message) => {
        try {
            insertMissingDocuments(message);
        } catch (e) {
            console.log(e);
        }

        console.log(message)

        let preparedMessage = prepareMessageForDb(message);

        let messageSchema = new Message(preparedMessage);

        messageSchema.save(function (err) {
            if (err) return console.error(err);
        })
    });
});

function prepareMessageForDb(message) {
    let preparedMessage = Object.assign({}, message);

    preparedMessage.chat = message.chat.id;
    if (message.forward_from_chat) preparedMessage.forward_from_chat = message.forward_from_chat.id;

    if (message.from) preparedMessage.from = message.from.id;
    if (message.left_chat_member) preparedMessage.left_chat_member = message.left_chat_member.id;
    if (message.new_chat_members) preparedMessage.new_chat_members = message.new_chat_members.map(x => x.id);

    if (message.pinned_message) preparedMessage.pinned_message = message.pinned_message.message_id;
    if (message.reply_to_message) preparedMessage.reply_to_message = message.reply_to_message.message_id;

    if (message.entities && message.entities.length === 0) delete preparedMessage.entities;
    if (message.caption_entities && message.caption_entities.length === 0) delete preparedMessage.caption_entities;
    if (message.photo && message.photo.length === 0) delete preparedMessage.photo;
    if (message.new_chat_members && message.new_chat_members.length === 0) delete preparedMessage.new_chat_members;
    if (message.new_chat_photo && message.new_chat_photo.length === 0) delete preparedMessage.new_chat_photo;
    if (message.game && message.game.text_entities && message.game.text_entities.length === 0) delete preparedMessage.game.text_entities
    if (message.game && message.game.photo && message.game.photo.length === 0) delete preparedMessage.game.photo

    return preparedMessage;
}

function insertMissingDocuments(message) {
    upsertChat(message.chat);
    if (message.forward_from_chat) upsertChat(message.forward_from_chat);

    if (message.from) upsertUser(message.from);
    if (message.new_chat_members) message.new_chat_members.forEach(x => upsertUser(x));

    if (message.pinned_message) upsertMessage(message.pinned_message)
    if (message.reply_to_message) upsertMessage(message.reply_to_message)
}

function upsertUser(user) {
    let userSchema = new User(user);

    let query = {
        'id': user.id
    };

    User.findOneAndUpdate(query, user, {
        upsert: true,
        useFindAndModify: false
    }, function (err, doc) {
        if (err) return console.error(err)
    });
}

function upsertChat(chat) {
    let chatSchema = new Chat(chat);

    let query = {
        'id': chat.id
    };

    Chat.findOneAndUpdate(query, chat, {
        upsert: true,
        useFindAndModify: false
    }, function (err, doc) {
        if (err) return console.error(err)
    });
}

function upsertMessage(message) {
    let messageSchema = new Message(message)

    let query = {
        'message_id': message.message_id
    }

    Message.findOneAndUpdate(query, message, {
        upsert: true,
        useFindAndModify: false
    }, function (err, doc) {
        if (err) return console.error(err)
    });
}