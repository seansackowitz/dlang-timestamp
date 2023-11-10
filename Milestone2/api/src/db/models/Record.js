module.exports = class {
    id = null;
    date = null;
    minutes = null;
    notes = null;
    paid = null;

    constructor(data) {
        this.id = data.id;
        this.date = data.date;
        this.minutes = data.minutes;
        this.notes = data.notes;
        this.paid = data.paid;
    }
}