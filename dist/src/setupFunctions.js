"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import external packages
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const get_port_1 = __importDefault(require("get-port"));
const safe_1 = __importDefault(require("colors/safe"));
// Import internal packages
const index_route_1 = __importDefault(require("./routes/index.route"));
const statBot_1 = __importDefault(require("./bot/statBot"));
const config_json_1 = __importDefault(require("../config.json"));
function setup_database() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            mongoose_1.default.connect("mongodb://localhost/statbottest", {
                useNewUrlParser: true,
                useFindAndModify: true,
                useCreateIndex: true
            });
            var db = mongoose_1.default.connection;
            db.on("error", (error) => {
                if (error.name === "MongoNetworkError") {
                    console.log(`${safe_1.default.red("❌")}  Couldn't set up database. Connection didn't succeed.`);
                    resolve({ success: false });
                }
                else {
                    console.error.bind(console, "connection error:");
                }
            });
            db.once("open", function () {
                console.log(`${safe_1.default.green("✔")} connected to database`);
                resolve({ success: true });
            });
        });
    });
}
exports.setup_database = setup_database;
function setup_backend() {
    return __awaiter(this, void 0, void 0, function* () {
        const port = config_json_1.default.port || (yield get_port_1.default());
        return new Promise(resolve => {
            const app = express_1.default();
            app.use(index_route_1.default);
            app.use(body_parser_1.default.urlencoded({ extended: true }));
            app.use(body_parser_1.default.json());
            app.listen(port, () => {
                console.log(`${safe_1.default.green("✔")} server running on port ${port}`);
                resolve({ success: true, port: port });
            }).on("error", (error) => {
                if (error.code === "EADDRINUSE") {
                    console.log(`${safe_1.default.red("❌")}  Couldn't set up backend on port ${port}. Port already in use.`);
                    resolve({ success: false, port: port });
                }
                else {
                    console.error("error", error.code);
                }
            });
        });
    });
}
exports.setup_backend = setup_backend;
function setup_bot(backend_port) {
    return __awaiter(this, void 0, void 0, function* () {
        const stat_bot = new statBot_1.default(config_json_1.default.telegram_bot_token, config_json_1.default.own_id, backend_port);
        try {
            yield stat_bot.try_start();
            stat_bot.register_handlers();
            console.log(`${safe_1.default.green("✔")} Stat bot started and initialized successfully`);
            return { success: true };
        }
        catch (error) {
            console.log(`${safe_1.default.red("❌")}  An error occurred while setting up the telegram bot. Is your token invalid or already in use?`);
            return { success: false };
        }
    });
}
exports.setup_bot = setup_bot;
//# sourceMappingURL=setupFunctions.js.map