import {
    getWordCount
} from '../../controllers/message.controller'

export default function getWordCountRoute(req, res) {
    let chatId = parseInt(req.params.chatId)

    if (isNaN(chatId)) {
        res.status(400).send('chatId parameter must be an integer')
    }

    getWordCount(chatId)
        .then((result) => {
            res.status(200).json({
                result: result
            })
        }).catch((error) => {
            console.error(error)
            res.status(500).send(error)
        })
}