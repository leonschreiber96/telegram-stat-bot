// Import external packages
import mongoose from "mongoose";

// Import internal packages
import Message from "../entities/message";

let Schema = mongoose.Schema;

let MessageSchema = new Schema(Message);

export default mongoose.model("Message", MessageSchema);