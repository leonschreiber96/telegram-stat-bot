import config from '../config'

import Message from '../models/schemas/message.schema'

const OWNID = config.ownId
const LEFT = 'left'
const JOINED = 'joined'

export async function getMembershipEvents(chatId) {
    return new Promise(async (resolve, reject) => {
        let relevantMessages

        try {
            relevantMessages = await Message.find({
                '$and': [{
                        '$or': [{
                            'new_chat_members': OWNID
                        }, {
                            'left_chat_member': OWNID
                        }]
                    },
                    {
                        'chat': chatId
                    }
                ]
            }).sort({
                date: 1
            })
        } catch (error) {
            reject({
                message: 'Could not read invitation and exit events from database',
                error: error
            })
        }

        let relevantEvents = relevantMessages.map(x => {
            return {
                date: new Date(x.date * 1000),
                type: x.left_chat_member ? LEFT : JOINED
            }
        })

        resolve(relevantEvents)
    })
}