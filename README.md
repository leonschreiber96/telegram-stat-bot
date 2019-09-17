# Telegram Statistics Bot

Open-source, self-hostable Telegram-Bot for collecting message data and generating interesting statistics and graphs from it.
It is available under https://t.me/statbob_bot or you can host your own personal instance if you prefer to have full control over the saved data and store it on a private server.

# Self-hosting
You will need a JSON configuration file with some data that's necessary to run the bot and server. You can either create it yourself as described in #config or automatically generate and fill it with your infos by using the config wizard on the first application startup.

1. Clone the repository: `git clone https://github.com/Snowfire01/telegram-stat-bot.git`
2. Install missing npm packages: `npm install`
3. Start the server and bot: `npm start`
4. Walk through the config wizard if you don't already have a configuration file

If you configured everything correctly, everything should be up and running and the bot listening to incoming messages now!

# Usage
[Work in progress]

## Configuration file

Below is the structure of the config file including optional settings:

    {
	    "telegram_bot_token":  "<Your bot token>",
	    "own_id":  <The Telegram ID of your Bot>,
	    "language_default":  "<Default language for your bot>",
        "port":  <Port for the backend server (optional)>,
        "blacklist/whitelist":  [
	        <Your black- or whitelisted chat ids (optional)>
        ]
    }
   
   **Telegram Bot Token**
   Your bot's Telegram API token. If you're unsure what your token is, you can retrieve it from BotFather. Format is `123456789:ABCd0EFgHIJKLm1_23noPQ45RSTUVW6XyZ7`.
   
   **Own ID**
   The user ID of your bot. Corresponds to the 9 digits before the colon in your API token.
   
   **Language default**
   The language your bot is going to speak when it enters a new group or encounters an unknown user. Language settings can later be personalized per group/user individually.
   
   ***Port (optional)***
   The port under which the backend server with the databasewill be reachable for the bot. 
   
   *If you omit this setting, a random free port will be chosen at every startup.*
   
   ***Blacklist/Whitelist (optional)***
   You can choose to either maintain a blacklist (specify chats that will be ignored by the bot) or a whitelist (ignore all chats by default and specify chats from which messages should be saved). 
   
   *If you omit this setting, the bot will listen to all chats.* 
