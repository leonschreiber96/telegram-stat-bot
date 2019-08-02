import {
    postMessage
} from '../../controllers/message.controller'

export default function postMessageRoute(req, res) {
    let messageData = []
    req.on('data', chunk => {
        messageData.push(chunk)
    });

    req.on('end', () => {
        let message = JSON.parse(messageData)

        postMessage(message)
            .catch((error) => {
                console.error(error)
                res.status(500).send(error)
            })
    })
}