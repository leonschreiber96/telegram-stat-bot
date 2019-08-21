// Import external packages
import colors from "colors/safe";

// Import internal packages
import { setup_database, setup_backend, setup_bot } from "./setupFunctions";

console.log();
console.log(colors.bgWhite.black("----- Initializing STAT BOT ----------------------------------"));

setup_database()
    .then(message => {
        console.log(message);
        setup_backend().then(message => {
            console.log(message);
            setup_bot().then(message => {
                console.log(message);
                console.log(colors.bgGreen.black("----- Everything up and running! -----------------------------"));
            });
        });
    }).catch(error => console.error(colors.red(error)));