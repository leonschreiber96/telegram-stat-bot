export default class MessageCollection {
    constructor(messages) {
        this.messages = messages || [];
    }

    add_message(message) {
        this.messages.push(message);
    }

    send_all() {
        console.log(this.messages);
        this.messages.forEach((message, index) => {
            setTimeout(() => message.send(), 1000 * index);
        });
    }
}