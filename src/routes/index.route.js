// Import external packages
import express from "express";

// Import message routes
import getMessageTotalRoute from "./messages/getMessageTotal.route";
import getMessagesByUserRoute from "./messages/getMessagesByUser.route";
import getWordCountRoute from "./messages/getWordCountRoute";
import getMessagesByWeekdayRoute from "./messages/getMessagesByWeekday.route";
import getMessagesByHourRoute from "./messages/getMessagesByHour.route";
import postMessageRoute from "./messages/postMessage.route";

// Import metadata routes
import getMembershipEventsRoute from "./meta/getMembershipEventsRoute";

// Import user routes
import getUserRoute from "./users/getUser.route";
import getPersonalDataRoute from "./users/getPersonalData.route";
import upsertUserRoute from "./users/upsertUserRoute";

const router = express.Router();

// Configure message routes
router.get("/messages/total/:chatId", getMessageTotalRoute);
router.get("/messages/byUser/:chatId", getMessagesByUserRoute);
router.get("/messages/wordCount/:chatId", getWordCountRoute);
router.get("/messages/byWeekday/:chatId", getMessagesByWeekdayRoute);
router.get("/messages/byHour/:chatId", getMessagesByHourRoute);
router.post("/messages", postMessageRoute);

// Configute metadata routes
router.get("/meta/membership/:chatId", getMembershipEventsRoute);

// Configure user routes
router.get("/users/:id", getUserRoute);
router.get("/users/:id/data", getPersonalDataRoute);
router.put("/users", upsertUserRoute);

// TODO: implement authentication!
export default router;