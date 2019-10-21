// Import external packages
import express from "express";

// Import message routes
import get_message_total_route from "./messages/getMessageTotal.route";
import get_messages_by_user_route from "./messages/getMessagesByUser.route";
import get_word_count_route from "./messages/getWordCount.route";
import get_messages_by_weekday_route from "./messages/getMessagesByWeekday.route";
import get_messages_by_hour_route from "./messages/getMessagesByHour.route";
import post_message_route from "./messages/postMessage.route";

// Import metadata routes
import get_membership_events_route from "./meta/getMembershipEventsRoute";

// Import user routes
import get_user_route from "./users/getUser.route";
import get_personal_data_route from "./users/getPersonalData.route";
import upsert_user_route from "./users/upsertUserRoute";

const router: express.Router = express.Router();

// Configure message routes
router.get("/messages/total/:chatId", get_message_total_route);
router.get("/messages/byUser/:chatId", get_messages_by_user_route);
router.get("/messages/wordCount/:chatId", get_word_count_route);
router.get("/messages/byWeekday/:chatId", get_messages_by_weekday_route);
router.get("/messages/byHour/:chatId", get_messages_by_hour_route);
router.post("/messages", post_message_route);

// Configute metadata routes
router.get("/meta/membership/:chatId", get_membership_events_route);

// Configure user routes
router.get("/users/:id", get_user_route);
router.get("/users/:id/data", get_personal_data_route);
router.put("/users", upsert_user_route);

// TODO: implement authentication!
export default router;