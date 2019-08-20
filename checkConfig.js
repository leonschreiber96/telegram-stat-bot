/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const inquirer = require("inquirer");
const fs = require("fs");
const colors = require("colors/safe");

let config_available = fs.existsSync("./config.json");

let config = {};

if (!config_available) {
    inquirer.prompt([{
        type: "input",
        name: "manual_config",
        message: "Seems like you haven't created a config file for the stat bot yet. We can do that together if you like. [y|n] ",
        default: "y"
    }, {
        type: "input",
        name: "telegram_bot_token",
        message: "What is your telegram bot api token? "
    }, {
        type: "input",
        name: "own_id",
        message: "What is the unique chat id of your bot? "
    }]).then(answers => {
        let manual_config = answers["manual_config"].toLowerCase() === "y" || answers["manual_config"].toLowerCase() === "yes";

        if (manual_config) {
            config.telegram_bot_token = answers["telegram_bot_token"];
            config.own_id = answers["own_id"];
        } else {
            config.telegram_bot_token = "";
            config.own_id = "";
            console.log("OK, got it. Creating an empty configuration file for you to edit.");
        }

        fs.appendFile("./config.json", JSON.stringify(config), () => {
            console.log(colors.green("Configuration file successfully created!"));
        });
    });
} else {
    console.log(colors.green("Configuration file found. Starting server."));
}