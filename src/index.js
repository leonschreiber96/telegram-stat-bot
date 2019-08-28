/* eslint-disable no-undef */
// Import external packages
import colors from "colors/safe";

// Import internal packages
import { setup_database, setup_backend, setup_bot } from "./setupFunctions";

console.log();
console.log(colors.bgWhite.black("----- Initializing STAT BOT ----------------------------------"));

setup();

async function setup() {
    let setup_database_result = await setup_database();
    let setup_backend_result = await setup_backend();
    let setup_bot_result = await setup_bot(setup_backend_result.port);

    if (setup_database_result.success && setup_backend_result.success && setup_bot_result.success) {
        console.log(colors.bgGreen.black("----- Everything up and running! -----------------------------"));
    } else {
        console.log(colors.bgRed.black("----- Something went wrong. Check config and try again? ------"));
        process.exit();
    }
}