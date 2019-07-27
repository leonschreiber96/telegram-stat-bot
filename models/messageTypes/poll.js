import PollOption from '../entities/pollOption';

let Poll = {
    id: String,
    question: String,
    options: {
        type: [PollOption],
        default: undefined
    },
    is_closed: Boolean
};

export default Poll;