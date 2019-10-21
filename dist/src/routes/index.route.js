"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import external packages
const express_1 = __importDefault(require("express"));
// Import message routes
const getMessageTotal_route_1 = __importDefault(require("./messages/getMessageTotal.route"));
const getMessagesByUser_route_1 = __importDefault(require("./messages/getMessagesByUser.route"));
const getWordCount_route_1 = __importDefault(require("./messages/getWordCount.route"));
const getMessagesByWeekday_route_1 = __importDefault(require("./messages/getMessagesByWeekday.route"));
const getMessagesByHour_route_1 = __importDefault(require("./messages/getMessagesByHour.route"));
const postMessage_route_1 = __importDefault(require("./messages/postMessage.route"));
// Import metadata routes
const getMembershipEventsRoute_1 = __importDefault(require("./meta/getMembershipEventsRoute"));
// Import user routes
const getUser_route_1 = __importDefault(require("./users/getUser.route"));
const getPersonalData_route_1 = __importDefault(require("./users/getPersonalData.route"));
const upsertUserRoute_1 = __importDefault(require("./users/upsertUserRoute"));
const router = express_1.default.Router();
// Configure message routes
router.get("/messages/total/:chatId", getMessageTotal_route_1.default);
router.get("/messages/byUser/:chatId", getMessagesByUser_route_1.default);
router.get("/messages/wordCount/:chatId", getWordCount_route_1.default);
router.get("/messages/byWeekday/:chatId", getMessagesByWeekday_route_1.default);
router.get("/messages/byHour/:chatId", getMessagesByHour_route_1.default);
router.post("/messages", postMessage_route_1.default);
// Configute metadata routes
router.get("/meta/membership/:chatId", getMembershipEventsRoute_1.default);
// Configure user routes
router.get("/users/:id", getUser_route_1.default);
router.get("/users/:id/data", getPersonalData_route_1.default);
router.put("/users", upsertUserRoute_1.default);
// TODO: implement authentication!
exports.default = router;
//# sourceMappingURL=index.route.js.map