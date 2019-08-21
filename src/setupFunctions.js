// Import external packages
import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import getPort from "get-port";


// Import internal packages
import router from "./routes/index.route";
import StatBot from "./bot/statBot";
import config from "../config.json";

export async function setup_database() {
    return new Promise((resolve, reject) => {
        try {
            mongoose.connect("mongodb://localhost/statbottest", { useNewUrlParser: true });

            var db = mongoose.connection;
            db.on("error", console.error.bind(console, "connection error:"));
            db.once("open", function() {
                resolve("✔ connected to db");
            });
        } catch (error) {
            reject({
                message: "❌ An error occurred while setting up MongoDB with Mongoose. Is your connection string correct?",
                error: error
            });
        }
    });
}

export async function setup_backend() {
    const port = await get_port();

    return new Promise((resolve, reject) => {
        try {
            const app = express();
            app.use(router);
            app.use(bodyParser.urlencoded({ extended: true }));
            app.use(bodyParser.json());

            app.listen(port, () => {
                resolve(`✔ server running on port ${port}`);
            }).on("error", error => {
                console.error("error", error.code);
            });
        } catch (error) {
            reject({
                message: "❌ An error occurred while setting up node + express.",
                error: error
            });
        }
    });
}

export async function setup_bot() {
    return new Promise((resolve, reject) => {
        try {
            // TODO: handle errors in telegram bot execution
            const stat_bot = new StatBot(config.telegram_bot_token, config.own_id);
            stat_bot.registerHandlers();
            resolve("✔ Stat bot started and initialized successfully");
        } catch (error) {
            reject({
                message: "❌ An error occurred while setting up the telegram bot. Is your token already in use?",
                error: error
            });
        }
    });
}

async function get_port() {
    try {
        let port = config.port || await getPort();

        return new Promise((resolve) => {
            resolve(port);
        });
    } catch (error) {
        return new Promise((resolve, reject) => {
            reject({
                message: "An error occurred while searching for a free port.",
                error: error
            });
        });
    }
}