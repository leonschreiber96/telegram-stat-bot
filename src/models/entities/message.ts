// Import message types
import Animation from "../messageTypes/animation";
import Audio from "../messageTypes/audio";
import Contact from "../messageTypes/contact";
import Document from "../messageTypes/document";
import Game from "../messageTypes/game";
import Location from "../messageTypes/location";
import Poll from "../messageTypes/poll";
import Sticker from "../messageTypes/sticker";
import Venue from "../messageTypes/venue";
import Video from "../messageTypes/video";
import VideoNote from "../messageTypes/videoNote";
import Voice from "../messageTypes/voice";

// Import other needed entities
import MessageEntity from "../entities/messageEntity";
import PhotoSize from "../entities/photoSize";
import Chat from "../entities/chat";
import User from "../entities/user";

let Message = {
    message_id: { type: Number, required: true, unique: true },
    chat: { type: Chat, required: true },
    date: { type: Date, required: true },
    message_type: String,
    from: { type: User, required: false },
    forward_from: { type: User, required: false },
    forward_from_chat: { type: Chat, required: false },
    forward_from_message_id: Number,
    forward_signature: String,
    forward_sender_name: String,
    forward_date: Number,
    reply_to_message: Number,
    edit_date: Number,
    media_group_id: String,
    author_signature: String,
    text: String,
    entities: { type: [MessageEntity], default: undefined },
    caption_entities: { type: [MessageEntity], default: undefined },
    audio: Audio,
    document: Document,
    animation: Animation,
    game: Game,
    photo: { type: [PhotoSize], default: undefined },
    sticker: Sticker,
    video: Video,
    voice: Voice,
    video_note: VideoNote,
    caption: String,
    contact: Contact,
    location: Location,
    venue: Venue,
    poll: Poll,
    new_chat_members: { type: [User], default: undefined },
    left_chat_member: { type: User, required: false },
    new_chat_title: String,
    new_chat_photo: { type: [PhotoSize], default: undefined },
    delete_chat_photo: Boolean,
    group_chat_created: Boolean,
    supergroup_chat_created: Boolean,
    channel_chat_created: Boolean,
    migrate_to_chat_id: Number,
    migrate_from_chat_id: Number
};

export default Message;