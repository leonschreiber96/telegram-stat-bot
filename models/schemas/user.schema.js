// Import external packages
import mongoose from "mongoose";

let Schema = mongoose.Schema;

let User = new Schema({
    id: {
        type: Number,
        required: true
    },
    is_bot: {
        type: Boolean,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: String,
    username: String,
    language_code: String
});

export default mongoose.model("User", User);