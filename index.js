import mongoose from 'mongoose';
import express from 'express'
import bodyParser from 'body-parser'

import router from './routes/index.route'

const app = express()
const PORT = 5000

app.use(router)

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(bodyParser.json())

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
}).on('error', error => {
    console.error(chalk.red('error'), error.code)
})

mongoose.connect('mongodb://localhost/statbottest', {
    useNewUrlParser: true
})

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
    console.log("connected to db")
})