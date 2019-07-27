import express from 'express'

import getMessageTotalRoute from './messages/getMessageTotal.route'
import getMessagesPerUserRoute from './messages/getMessagesPerUser.route'
import getWordCountRoute from './messages/getAverageWordsRoute'
import getMembershipEventsRoute from './meta/getMembershipEventsRoute'
import getMessagesByWeekdayRoute from './messages/getMessagesByWeekday.route'

const router = express.Router()

router.get('/messages/total/:chatId', getMessageTotalRoute)
router.get('/messages/perUser/:chatId', getMessagesPerUserRoute)
router.get('/messages/wordCount/:chatId', getWordCountRoute)
router.get('/messages/byWeekday/:chatId', getMessagesByWeekdayRoute)

router.get('/meta/membership/:chatId', getMembershipEventsRoute)

module.exports = router