/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const inquirer = require("inquirer");
const fs = require("fs");
const colors = require("colors/safe");

let config_available = fs.existsSync("./config.json");

let config = {};

if (!config_available) {
    inquirer.prompt([{
        type: "confirm",
        name: "manual_config",
        message: "Seems like you haven't created a config file for the stat bot yet. We can do that together now if you like!",
        default: true
    }, {
        type: "password",
        name: "telegram_bot_token",
        message: "What is your telegram bot api token? ",
        mask: "*",
        when: answers => answers["manual_config"]
    }, {
        type: "list",
        name: "language_default",
        message: "What language should your bot speak by default? ",
        choices: ["en", "de"],
        when: answers => answers["manual_config"]
    }, {
        type: "list",
        name: "port_selection",
        message: "On which port should the backend operate? ",
        choices: ["Always choose a free one by yourself", "I want to choose my own fixed port"],
        when: answers => answers["manual_config"]
    }, {
        type: "number",
        name: "port",
        message: "Please enter your port number: ",
        when: answers => answers["port_selection"] === "I want to choose my own fixed port"
    }, {
        type: "list",
        name: "white_black_listing",
        message: "Do you want to control from which chats messages are stored? ",
        choices: ["Yes, I want a whitelist", "Yes, I want a blacklist", "No, save messages from all chats"],
        when: answers => answers["manual_config"]
    }, {
        type: "input",
        name: "listed_chats",
        message: answers => {
            let list_type = answers["white_black_listing"].substring(answers["white_black_listing"].lastIndexOf(" ") + 1, answers["white_black_listing"].length)
            return `Please enter the chat you want to include in your ${list_type} as numbers separated by commas. Spaces will be ignored.`
        },
        when: answers => answers["white_black_listing"].startsWith("Yes")
    }]).then(answers => {
        if (answers["manual_config"]) {
            config.telegram_bot_token = answers["telegram_bot_token"];
            config.own_id = +config.telegram_bot_token.substring(0, config.telegram_bot_token.indexOf(":"));
            config.language_default = answers["language_default"];

            if (answers["port_selection"] === "I want to choose my own fixed port") {
                config.port = answers["port"];
            }

            if (answers["white_black_listing"].startsWith("Yes")) {
                let list_type = answers["white_black_listing"].substring(answers["white_black_listing"].lastIndexOf(" ") + 1, answers["white_black_listing"].length);
                config[list_type] = answers["listed_chats"].split(",").map(x => +(x.trim()));
            }
        } else {
            config.telegram_bot_token = "";
            config.own_id = "";
            config.language_default = "";
            console.log("OK, got it. Creating an empty configuration file for you to edit.");
        }

        fs.appendFile("./config.json", JSON.stringify(config, null, 4), () => {
            console.log(colors.green("Configuration file successfully created!"));
        });
    });
} else {
    console.log(colors.green("Configuration file found. Starting server."));
}