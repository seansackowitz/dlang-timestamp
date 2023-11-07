const db = require('./DBConnection');
const Payment = require('./models/Payment');
const records = require('./RecordDAO');

function getPayments() {
    return db.query('SELECT * FROM payments').then(({ results }) => {
        return results.map(payments => new Payment(payments));;
    }).catch(() => {
        respond(404, { error: 'Payments cannot be retrieved.' });
    });
}

function getPaymentById(paymentId) {
    return db.query('SELECT * FROM payments WHERE id = ?', [paymentId]).then(({ results }) => {
        return results.map(payments => new Payment(payments));;
    }).catch(() => {
        respond(404, { error: 'Payment cannot be retrieved by ID.' });
    });
}

function getPaymentByDate(date) {
    return db.query('SELECT * FROM payments WHERE date = ?', [date]).then(({ results }) => {
        return results.map(payments => new Payment(payments));;
    }).catch(() => {
        respond(404, { error: 'Payment cannot be retrieved by date.' });
    });
}

function getPaymentByDateAndId(date, paymentId) {
    return db.query('SELECT * FROM payments WHERE date = ? AND id = ?', [date, paymentId]).then(({ results }) => {
        return results.map(payments => new Payment(payments));;
    }).catch(() => {
        respond(404, { error: 'Payment cannot be retrieved by date and ID.' });
    });
}

function getPaymentsBySenderId(paymentSenderId) {
    return db.query('SELECT * FROM payments WHERE senderId = ?', [paymentSenderId]).then(({ results }) => {
        return results.map(payments => new Payment(payments));;
    }).catch(() => {
        respond(404, { error: 'Payments cannot be retrieved by sender ID.' });
    });
}

function getPaymentsByRecipientId(recipientId) {
    return db.query('SELECT * FROM payments WHERE recipientId = ?', [recipientId]).then(({ results }) => {
        return results.map(payments => new Payment(payments));;
    }).catch(() => {
        respond(404, { error: 'Payments cannot be retrieved by recipient ID.' });
    });
}

function createPayment(payment) {
    return db.query('INSERT INTO payments (date, senderId, recipientId, amount) VALUES (?, ?, ?, ?)', [payment.date, payment.senderId, payment.recipientId, payment.amount]).then(() => {
        // respond(201, { message: 'Payment created successfully.' });
        // db.query('SELECT * FROM payments WHERE userId = ? AND paid = ?', [payment.recipientId, false]).then(({ results }) => {
            
        // });
        let unpaidRecords = records.getUnpaidRecordsByUserId(payment.recipientId);
        for (record in unpaidRecords) {
            record.paid = true;
            records.updateRecord(record);
        }
        return new Payment(payment);
    }).catch(() => {
        respond(400, { error: 'Bad request. Payment cannot be created.' });
    });
}