"use strict";
/* eslint-disable no-undef */
// Import external packages
// import colors from "colors.ts";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import internal packages
const setupFunctions_1 = require("./setupFunctions");
console.log();
console.log(("----- Initializing STAT BOT ----------------------------------"));
setup();
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        let setup_database_result = yield setupFunctions_1.setup_database();
        let setup_backend_result = yield setupFunctions_1.setup_backend();
        let setup_bot_result = yield setupFunctions_1.setup_bot(setup_backend_result.port);
        if (setup_database_result.success && setup_backend_result.success && setup_bot_result.success) {
            console.log(("----- Everything up and running! -----------------------------"));
        }
        else {
            console.log(("----- Something went wrong. Check config and try again? ------"));
            process.exit();
        }
    });
}
//# sourceMappingURL=index.js.map