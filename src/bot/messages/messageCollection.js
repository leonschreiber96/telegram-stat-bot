export default class MessageCollection {
    constructor(messages) {
        this.messages = messages || [];
    }

    addMessage(message) {
        this.messages.push(message);
    }

    sendAll() {
        this.messages.forEach((message, index) => {
            setTimeout(() => message.send(), 1000 * index);
        });
    }
}