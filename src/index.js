// Import external packages
import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";

// Import internal packages
import router from "./routes/index.route";
import StatBot from "./bot/statBot";
import config from "../config.json";

// Set up node server
const app = express();
const PORT = 5000;

app.use(router);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
}).on("error", error => {
    console.error("error", error.code);
});

// Set up MongoDB
mongoose.connect("mongodb://localhost/statbottest", { useNewUrlParser: true });

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
    console.log("connected to db");
});

// Set up Telegram bot
// TODO: handle errors in telegram bot execution
const stat_bot = new StatBot(config.telegram_bot_token, config.own_id);
stat_bot.start();