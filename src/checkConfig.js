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
        message: "Seems like you haven't created a config file for the stat bot yet. We can do that together if you like!",
        default: true
    }, {
        type: "password",
        name: "telegram_bot_token",
        message: "What is your telegram bot api token? ",
        mask: "*"
    }, {
        type: "list",
        name: "language_default",
        message: "What language should your bot speak by default? ",
        choices: ["en", "de"]
    }]).then(answers => {
        if (answers["manual_config"]) {
            config.telegram_bot_token = answers["telegram_bot_token"];
            config.own_id = +config.telegram_bot_token.substring(0, config.telegram_bot_token.indexOf(":"));
            config.language_default = answers["language_default"];
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