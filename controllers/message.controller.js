import Message from '../models/schemas/message.schema'

export async function getMessageTotal(chatId) {
    return new Promise((resolve, reject) => {
        Message.find({
            'chat': chatId
        }).countDocuments((err, result) => {
            if (err) reject(err)
            else resolve(result)
        })
    })
}

export async function getMessagesByUser(chatId) {
    return new Promise((resolve, reject) => {
        Message.aggregate([{
            $match: {
                'chat': chatId
            }
        }, {
            $group: {
                _id: '$from',
                count: {
                    $sum: 1
                }
            }
        }], (err, result) => {
            if (err) reject(err)
            else resolve(result)
        })
    })
}

export async function getMessagesByWeekday(chatId) {
    return new Promise(async (resolve, reject) => {
        try {
            let messagesByWeekday = (await Message.aggregate([{
                '$match': {
                    chat: chatId
                }
            }, {
                '$group': {
                    '_id': {
                        'weekday': {
                            '$dayOfWeek': {
                                'date': {
                                    '$toDate': {
                                        '$multiply': [1000, '$date']
                                    }
                                }
                            }
                        }
                    },
                    'count': {
                        '$sum': 1
                    }
                }
            }])).map(x => {
                return {
                    weekday: {
                        numeric: x._id.weekday - 1,
                        readable: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][x._id.weekday - 1]
                    },
                    count: x.count
                }
            })

            resolve(messagesByWeekday)
        } catch (error) {
            reject({
                message: 'Could not read messages per weekday from database',
                error: error
            })
        }
    })
}

export async function getMessagesByHour(chatId) {
    return new Promise(async (resolve, reject) => {
        try {
            let messagesByHour = (await Message.aggregate([{
                '$match': {
                    'chat': chatId
                }
            }, {
                '$group': {
                    '_id': {
                        hour: {
                            '$hour': {
                                'date': {
                                    '$toDate': {
                                        '$multiply': [1000, '$date']
                                    }
                                },
                                'timezone': Intl.DateTimeFormat().resolvedOptions().timeZone
                            }
                        }
                    },
                    'count': {
                        '$sum': 1
                    }
                }
            }, {
                '$sort': {
                    '_id.hour': 1
                }
            }])).map(x => {
                return {
                    hour: x._id.hour,
                    count: x.count
                }
            })

            resolve(messagesByHour)
        } catch (error) {
            reject({
                message: 'Could not read messages per hour from database',
                error: error
            })
        }
    })
}

export async function getWordCount(chatId) {
    return new Promise((resolve, reject) => {
        getAllTexts(chatId)
            .then((result) => {
                let wordCounts = result.map(x => x.text.split(' ').length)
                let wordSum = wordCounts.reduce((x, y) => x + y, 0)
                let average = +(wordSum / result.length).toFixed(2)

                resolve({
                    total: wordSum,
                    avgPerMessage: average
                })
            })
            .catch((error) => reject(error))
    })
}

async function getAllTexts(chatId) {
    return new Promise((resolve, reject) => {
        Message.find({
            'chat': chatId,
            'text': {
                '$exists': true
            }
        }, {
            'text': 1,
            '_id': 0
        }, (err, result) => {
            if (err) reject(err)
            else(resolve(result))
        })
    })
}