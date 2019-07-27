import PhotoSize from '../entities/photoSize';
import MessageEntity from '../entities/messageEntity';
import Animation from './animation';

let Game = {
    title: String,
    description: String,
    photo: {
        type: [PhotoSize],
        default: undefined
    },
    text: String,
    text_entities: {
        type: [MessageEntity],
        default: undefined
    },
    animation: Animation
};

export default Game;