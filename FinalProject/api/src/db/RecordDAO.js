const db = require('./DBConnection');
const Record = require('./models/Record');

async function getRecords() {

    // return db.query('SELECT * FROM records').then(({ results }) => {
    //     return results.map(records => new Record(records));;
    // }).catch(() => {
    //     respond(404, { error: 'Records cannot be retrieved.' });
    // });
    try {
        const { results } = await db.query('SELECT * FROM records');
        return results.map(record => new Record(record));
    }
    catch (error) {
        // respond(404, { error: 'Records cannot be retrieved.' });
        throw {
            code: 404,
            message: 'Records cannot be retrieved.'
        }
    }
}

async function getRecordById(recordId) {
    try {
        const { results } = await db.query('SELECT * FROM records WHERE id=?', [recordId]);
        if (results[0])
            return new Record(results[0]);
        throw {
            code: 400,
            message: 'Record cannot be retrieved by record ID ' + recordId
        }
        // respond(404, { error: 'Record cannot be retrieved by record ID ' + recordId });
    }
    catch (error) {
        throw {
            code: 404,
            message: 'Record cannot be retrieved by record ID ' + recordId
        }
        // respond(404, { error: 'Record cannot be retrieved by record ID ' + recordId });
    }
    // return db.query('SELECT * FROM records WHERE id=?', [recordId]).then(({ results }) => {
    //     if (results[0])
    //         return new Record(results[0]);
    // }).catch(() => {
    //     respond(404, { error: 'Record cannot be retrieved by record ID ' + recordId });
    // });
}

async function getRecordByUserId(userId) {
    try {
        const sql = `SELECT r.* FROM records r JOIN user_records ur ON r.id = ur.record_id WHERE ur.user_id = ?`;
        const { results } = await db.query(sql, [userId]);
        console.log("THESE ARE THE RESULTS:", results);
        return await results.map(record => new Record(record));
    }
    catch (error) {
        throw {
            code: 404,
            message: 'Record cannot be retrieved by user ID ' + userId
        }
        // respond(404, { error: 'Records cannot be retrieved by user ID ' + userId });
    }
}

async function getRecordByUserIdAndDate(userId, date) {
    try {
        const sql = `SELECT r.* FROM records r JOIN user_records ur ON r.id = ur.record_id WHERE ur.user_id = ? AND r.date = ?`;
        const { results } = await db.query(sql, [userId, date]);
        return await results.map(record => new Record(record));
    }
    catch (error) {
        throw {
            code: 404,
            message: 'Record cannot be retrieved by user ID ' + recordId
        }
        // respond(404, { error: 'Records cannot be retrieved by user ID ' + userId + ' and date ' + date });
    }
    // return db.query('SELECT * FROM records WHERE userId=? AND date=?', [userId, date]).then(({ results }) => {
    //     return results.map(records => new Record(records));
    // }).catch(() => {
    //     respond(404, { error: 'Records cannot be retrieved by user ID ' + userId + ' and date ' + date });
    // });
}

async function getUnpaidRecordsByUserId(userId) {
    try {
        const sql = `SELECT r.* FROM records r JOIN user_records ur ON r.id = ur.record_id WHERE ur.user_id = ? AND r.paid = false`;
        const { results } = await db.query(sql, [userId]);
        return await results.map(record => new Record(record));
        // let records = await getRecordByUserId(userId);
        // let unpaidRecords = [];
        // return await records.filter(record => record.paid === false).map(record => unpaidRecords.push(record));    
    }
    catch (error) {
        throw {
            code: 404,
            message: 'Unpaid records cannot be retrieved by user ID ' + userId
        }
        // respond(404, { error: 'Unpaid records cannot be retrieved by user ID ' + userId });
    }
}

async function getRecordsByDate(date) {
    try {
        const sql = `SELECT r.* FROM records r WHERE r.date = ?`;
        const { results } = await db.query(sql, [date]);
        return await results.map(record => new Record(record));
    }
    catch (error) {
        throw {
            code: 404,
            message: 'Records cannot be retrieved by date ' + date
        }
        // respond(404, { error: 'Records cannot be retrieved by date ' + date });
    }
    // return db.query('SELECT * FROM records WHERE date=?', [date]).then(({ results }) => {
    //     return results.map(records => new Record(records));
    // }).catch(() => {
    //     respond(404, { error: 'Records cannot be retrieved by date ' + date });
    // });
}

async function createRecord(record, userId) {
    try {
        const sql = `INSERT INTO records (date, minutes, notes, paid) VALUES (?, ?, ?, ?)`;
        const sql2 = `INSERT INTO user_records (record_id, user_id) VALUES (?, ?)`;
        console.log("BEFORE QUERY TO INSERT RECORD");
        // Insert record into records
        const { results } = await db.query(sql, [record.date, record.minutes, record.notes, record.paid]);
        console.log("RESULTS", results);
        console.log("RECORD POSTED! BEFORE MAPPING RECORD");
        console.log("AFTER MAPPING RECORD");
        // Insert record into user_records
        const { results2 } = await db.query(sql2, [results.insertId, userId]);
        console.log("RESULTS 2", results2);
        return await results;
    }
    catch (error) {
        throw {
            code: 400,
            message: 'Bad request. Record cannot be created.'
        }
        // respond(400, { error: 'Bad request. Record cannot be created.' });
    }
    // return db.query('INSERT INTO records (date, minutes, userId, notes, paid) VALUES (?, ?, ?, ?, ?)', [record.date, record.minutes, record.userId, record.notes, record.paid]).then(({ results }) => {
    //     return new Record(results.insertId);
    // }).catch(() => {
    //     respond(400, { error: 'Bad request. Record cannot be created.' });
    // });
}

async function updateRecord(record) {
    try {
        const sql = `UPDATE records SET date=?, minutes=?, notes=?, paid=? WHERE id=?`;
        const { results } = await db.query(sql, [record.date, record.minutes, record.notes, record.paid, record.id]);
        return await results;
    }
    catch (error) {
        throw {
            code: 400,
            message: 'Bad request. Record cannot be updated.'
        }
        // respond(400, { error: 'Bad request. Record cannot be updated.' })
    }
    // return db.query('UPDATE records SET minutes=?, notes=?, paid=? WHERE id=?', [record.minutes, record.notes, record.paid, record.id]).then(({ results }) => {
    //     return new Record(record.id);
    // }).catch(() => {
    //     respond(400, { error: 'Bad request. Record cannot be updated.' })
    // });
}

async function deleteRecord(record) {
    try {
        const deleteFromUserRecordsSql = `DELETE FROM user_records WHERE record_id = ?`;
        await db.query(deleteFromUserRecordsSql, [record.id]);

        
        const deleteFromRecordsSql = `DELETE FROM records WHERE id = ?`;
        await db.query(deleteFromRecordsSql, [record.id]);

        return { message: 'Record deleted successfully' };
    }
    catch (error) {
        throw {
            code: 404,
            message: 'Record not found. Record cannot be deleted by record ID.'
        }
        // respond(404, { error: 'Record not found. Record cannot be deleted by record ID.' });
    }
    // Don't allow a record to be deleted if the record was paid
    // if (record.paid) {
    //     return respond(400, { error: 'Bad request. Record cannot be deleted by record ID because this record received payment.' });
    // }
    // return db.query('DELETE FROM records WHERE id=?', [record.id]).then(({ results }) => {
    //     return new Record(record.id);
    // }).catch(() => {
    //     respond(404, { error: 'Record not found. Record cannot be deleted by record ID.' });
    // });
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