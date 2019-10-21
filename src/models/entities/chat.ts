import ChatPhoto from "./chatPhoto";
// TODO: Fill data collection times on group enter or exit events
let Chat = {
    id: {
        type: Number,
        required: true
    },
    chat_type: {
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
    can_set_sticker_set: Boolean,
    data_collection_times: [
        {
            entry: Number,
            exit: Number
        }
    ]
};

export default Chat;