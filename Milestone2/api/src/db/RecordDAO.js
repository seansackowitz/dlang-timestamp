const db = require('./DBConnection');
const Record = require('./models/Record');

function getRecords() {
    return db.query('SELECT * FROM records').then(({ results }) => {
        return results.map(records => new Record(records));;
    }).catch(() => {
        respond(404, { error: 'Records cannot be retrieved.' });
    });
}

function getRecordById(recordId) {
    return db.query('SELECT * FROM records WHERE id=?', [recordId]).then(({ results }) => {
        if (results[0])
            return new Record(results[0]);
    }).catch(() => {
        respond(404, { error: 'Record cannot be retrieved by record ID ' + recordId });
    });
}

function getRecordByUserId(userId) {
    const sql = `SELECT r.* FROM records r JOIN user_records ur ON r.id = ur.record_id WHERE ur.user_id = ?`;

    return db.query(sql, [userId]).then(({ results }) => {
        return results.map(record => new Record(record));
    }).catch(() => {
        respond(404, { error: 'Records cannot be retrieved by user ID ' + userId });
    });
    // console.log("THIS IS THE RESULT", result);
    // console.log("THIS IS THE RESULT.RESULTS!", result.results);
    // return result.results.map(record => new Record(record));

    return db.query('SELECT * FROM user_records WHERE user_id = ?', [userId]).then(({ results }) => {
        let foundRecords = [];
        console.log("RECORDS IDS INCLUDE", results);
        for (recordId of results) {
            // console.log("THIS IS RECORD ID", recordId);
            db.query('SELECT * FROM records WHERE id=?', [recordId.recordId]).then(({ record }) => {
                foundRecords.push(new Record(record));
            });
        }
        console.log("RECORDS INCLUDE", foundRecords);
        // return results.map(records => new Record(records));
        return foundRecords;
    }).catch(() => {
        respond(404, { error: 'Records cannot be retrieved by user ID ' + userId });
    });
}

function getRecordByUserIdAndDate(userId, date) {
    return db.query('SELECT * FROM records WHERE userId=? AND date=?', [userId, date]).then(({ results }) => {
        return results.map(records => new Record(records));
    }).catch(() => {
        respond(404, { error: 'Records cannot be retrieved by user ID ' + userId + ' and date ' + date });
    });
}

function getUnpaidRecordsByUserId(userId) {
    let records = getRecordByUserId(userId);
    let unpaidRecords = [];
    return records.filter(record => record.paid === false).map(record => unpaidRecords.push(record));
}

function getRecordsByDate(date) {
    return db.query('SELECT * FROM records WHERE date=?', [date]).then(({ results }) => {
        return results.map(records => new Record(records));
    }).catch(() => {
        respond(404, { error: 'Records cannot be retrieved by date ' + date });
    });
}

function createRecord(record) {
    return db.query('INSERT INTO records (date, minutes, userId, notes, paid) VALUES (?, ?, ?, ?, ?)', [record.date, record.minutes, record.userId, record.notes, record.paid]).then(({ results }) => {
        return new Record(results.insertId);
    }).catch(() => {
        respond(400, { error: 'Bad request. Record cannot be created.' });
    });
}

function updateRecord(record) {
    return db.query('UPDATE records SET minutes=?, notes=?, paid=? WHERE id=?', [record.minutes, record.notes, record.paid, record.id]).then(({ results }) => {
        return new Record(record.id);
    }).catch(() => {
        respond(400, { error: 'Bad request. Record cannot be updated.' })
    });
}

function deleteRecord(record) {
    // Don't allow a record to be deleted if the record was paid
    if (record.paid) {
        return respond(400, { error: 'Bad request. Record cannot be deleted by record ID because this record received payment.' });
    }
    return db.query('DELETE FROM records WHERE id=?', [record.id]).then(({ results }) => {
        return new Record(record.id);
    }).catch(() => {
        respond(404, { error: 'Record not found. Record cannot be deleted by record ID.' });
    });
}

module.exports = {
    getRecords: getRecords,
    getRecordById: getRecordById,
    getRecordByUserId: getRecordByUserId,
    getRecordByUserIdAndDate: getRecordByUserIdAndDate,
    getUnpaidRecordsByUserId: getUnpaidRecordsByUserId,
    getRecordsByDate: getRecordsByDate,
    createRecord: createRecord,
    updateRecord: updateRecord,
    deleteRecord: deleteRecord,
}