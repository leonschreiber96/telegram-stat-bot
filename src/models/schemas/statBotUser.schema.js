// Import external packages
import mongoose from "mongoose";

// Import internal packages
import StatBotUser from "../entities/statBotUser";

let Schema = mongoose.Schema;

let StatBotUserSchema = new Schema(StatBotUser);

export default mongoose.model("StatBotUser", StatBotUserSchema);