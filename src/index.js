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
            console.log(message.message);
            setup_bot(message.port).then(message => {
                console.log(message);
            }).then(() => console.log(colors.bgGreen.black("----- Everything up and running! -----------------------------")));
        }).catch(error => {
            console.log(error.message);
        });
    }).catch(error => {
        console.log(colors.bgRed.black("----- Something went wrong. Check config and try again? ------"));
        console.error(colors.red(error));
    });