// Import external packages
import mongoose from "mongoose";
import express from "express";
import bodyParser from "body-parser";
import getPort from "get-port";
import colors from "colors/safe";

// Import internal packages
import router from "./routes/index.route";
import StatBot from "./bot/statBot";
import config from "../config.json";

export async function setup_database(): Promise<any> {
    return new Promise((resolve) => {
        mongoose.connect("mongodb://localhost/statbottest", {
            useNewUrlParser: true,
            useFindAndModify: true,
            useCreateIndex: true
        });

        var db = mongoose.connection;

        db.on("error", (error) => {
            if (error.name === "MongoNetworkError") {
                console.log(`${colors.red("❌")}  Couldn't set up database. Connection didn't succeed.`);
                resolve({ success: false });
            } else {
                console.error.bind(console, "connection error:");
            }
        });

        db.once("open", function () {
            console.log(`${colors.green("✔")} connected to database`);
            resolve({ success: true });
        });
    });
}

export async function setup_backend(): Promise<any> {
    const port = config.port || await getPort();

    return new Promise(resolve => {
        const app = express();
        app.use(router);
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());

        app.listen(port, () => {
            console.log(`${colors.green("✔")} server running on port ${port}`);
            resolve({ success: true, port: port });
        }).on("error", (error: NodeJS.ErrnoException) => {
            if (error.code === "EADDRINUSE") {
                console.log(`${colors.red("❌")}  Couldn't set up backend on port ${port}. Port already in use.`);
                resolve({ success: false, port: port });
            } else {
                console.error("error", error.code);
            }
        });

    });
}

export async function setup_bot(backend_port): Promise<any> {
    const stat_bot = new StatBot(config.telegram_bot_token, config.own_id, backend_port);

    try {
        await stat_bot.try_start();
        stat_bot.register_handlers();
        console.log(`${colors.green("✔")} Stat bot started and initialized successfully`);
        return { success: true };
    } catch (error) {
        console.log(`${colors.red("❌")}  An error occurred while setting up the telegram bot. Is your token invalid or already in use?`);
        return { success: false };
    }
}