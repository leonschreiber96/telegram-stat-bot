// Import external packages
import mongoose from "mongoose";

import ChatPhoto from "../entities/chatPhoto";

let Schema = mongoose.Schema;

let Chat = new Schema({
    id: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    title: String,
    username: String,
    first_name: String,
    last_name: String,
    all_members_are_administrators: Boolean,
    photo: ChatPhoto,
    description: String,
    invite_link: String,
    pinned_message: Number,
    sticker_set_name: String,
    can_set_sticker_set: Boolean
});

export default mongoose.model("Chat", Chat);