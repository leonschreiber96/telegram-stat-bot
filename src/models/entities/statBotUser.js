let StatBotUser = {
    id: {
        type: Number,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: String,
    username: String,
    language_code: String,
    data_collection_consent: Boolean
};

export default StatBotUser;