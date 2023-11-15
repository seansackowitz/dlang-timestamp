module.exports = class {
    id = null;
    date = null;
    senderId = null;
    recipientId = null;
    amount = null;

    constructor(data) {
        this.id = data.id;
        this.date = data.date;
        this.senderId = data.senderId;
        this.recipientId = data.recipientId;
        this.amount = data.amount;
    }
}