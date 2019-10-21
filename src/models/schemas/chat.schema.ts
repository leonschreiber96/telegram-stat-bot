// Import external packages
import mongoose from "mongoose";

// Import internal packages
import Chat from "../entities/chat";

let Schema = mongoose.Schema;

let ChatSchema = new Schema(Chat);

export default mongoose.model("Chat", ChatSchema);