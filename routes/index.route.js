import express from 'express'

import getMessageTotalRoute from './messages/getMessageTotal.route'
import getMessagesByUserRoute from './messages/getMessagesByUser.route'
import getWordCountRoute from './messages/getAverageWordsRoute'
import getMessagesByWeekdayRoute from './messages/getMessagesByWeekday.route'
import getMessagesByHourRoute from './messages/getMessagesByHour.route'
import postMessageRoute from './messages/postMessage.route'

import getMembershipEventsRoute from './meta/getMembershipEventsRoute'

const router = express.Router()

router.get('/messages/total/:chatId', getMessageTotalRoute)
router.get('/messages/byUser/:chatId', getMessagesByUserRoute)
router.get('/messages/wordCount/:chatId', getWordCountRoute)
router.get('/messages/byWeekday/:chatId', getMessagesByWeekdayRoute)
router.get('/messages/byHour/:chatId', getMessagesByHourRoute)
router.post('/messages', postMessageRoute)

router.get('/meta/membership/:chatId', getMembershipEventsRoute)

module.exports = router