// Import external packages
import request from "request-promise";
import config from "../../../config.json";

export default async function on_message(message, metadata, stat_bot) {
    try {
        if (config.development) {
            if (config.blacklist && config.blacklist.includes(message.chat.id)) {
                console.log(`${message.chat.id} (${(message.chat.title || message.chat.username || message.chat.first_name).slice(0, 25)}) tried to contact but was blacklisted`);
                console.log(message.text + "\n");
                stat_bot.bot.leaveChat(message.chat.id);
                // stat_bot.bot.sendMessage(message.chat.id, "I'm in active development! Please be patient :)");
            }
            if (config.whitelist && !config.whitelist.includes(message.chat.id)) {
                console.log(message.chat.id + " tried to contact, but couldn't:");
                console.log(message);
                stat_bot.bot.sendMessage(message.chat.id, "I'm in active development! Please be patient :)");
            }
        }

        await request({
            method: "POST",
            uri: `http://localhost:${stat_bot.backend_port}/messages`,
            json: true,
            body: {
                message: message,
                metadata: metadata
            },
            contentType: "application/json"
        });
    } catch (e) {
        console.log(e);
    }
}