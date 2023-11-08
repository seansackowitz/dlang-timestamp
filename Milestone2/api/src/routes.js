const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');

// let users = require("../data/users.json");
// let records = require("../data/records.json");
// let payments = require("../data/payments.json");

const records = require('./db/RecordDAO');
const payments = require('./db/PaymentDAO');
const users = require('./db/UserDAO');
const { TokenMiddleware, generateToken, removeToken } = require("./middleware/TokenMiddleware");

router.use(cookieParser());

// router.get("/users", TokenMiddleware, async (req, res) => {
// res.json(await users.getUsers());
// });

router.get("/records", TokenMiddleware, async (req, res) => {
    res.json(await records.getRecords());
});

router.get("/payments", TokenMiddleware, async (req, res) => {
    res.json(await payments.getPayments());
});

// get all payments sent by user with senderId
router.get("/payments/sender/:senderId", TokenMiddleware, async (req, res) => {
    let senderId = req.params.senderId;
    // let senderPayments = payments.filter(payment => {
    //     return payment.senderId == senderId;
    // });
    try {
        let senderPayments = await payments.getPaymentsBySenderId(senderId);
        res.json(senderPayments);
    }
    catch (error) {
        res.status(error.status).json({ error: error.message });
    }
});

// get all payments received by user with recipientId
router.get("/payments/recipient/:recipientId", TokenMiddleware, async (req, res) => {
    let recipientId = req.params.recipientId;
    // let recipientPayments = payments.filter(payment => {
    //     return payment.recipientId == recipientId;
    // });
    try {
        let recipientPayments = await payments.getPaymentsByRecipientId(recipientId);
        res.json(recipientPayments);
    }
    catch (error) {
        res.status(error.status).json({ error: error.message });
    }
});

router.post("/payments", TokenMiddleware, async (req, res) => {
    try {
        const { amount, date, recipientId, senderId } = req.body;
        const payment = {
            amount: amount,
            date: date,
            recipientId: recipientId,
            senderId: senderId
        }
        //TODO adding to the database
        // payments.push(payment);
        await payments.createPayment(payment);
        return res.json({ success: true, message: 'Payment added successfully!' });
    }
    catch (error) {
        res.status(error.status).json({ error: error.message });
    }
});

router.get("/users/:id", TokenMiddleware, async (req, res) => {
    let userId = req.params.id;
    // let user = users.find(usr => {
    //     console.log("GET /users/:id route hit");
    //     return usr.id == userId;
    // });
    // if (!user) {
    //     res.status(404).send("User not found");
    //     res.json("User not found");
    // }
    // else {
    //     res.json(user);
    // }
    try {
        let user = await users.getUserById(userId);
        res.json(user);
    }
    catch (error) {
        res.status(error.status).json({ error: error.message });
    }
});

router.get("/records/:id", TokenMiddleware, async (req, res) => {
    // let usrId = req.params.id;
    // let record = records.find(rec => {
    //     console.log(rec.userId);
    //     return usrId == rec.userId;
    // })
    // if (!record) {
    //     res.status(404).send("Record not found");
    //     res.json("Record not found");
    // }
    // else {
    //     res.json(record);
    // }
    try {
        let userId = req.params.id;
        let record = await records.getRecordByUserId(userId);
        return res.json(record);
    }
    catch (error) {
        res.status(error.status).json({ error: error.message });
    }
});

router.get("/login/users/current", TokenMiddleware, async (req, res) => {
    res.json(await req.user);
});

router.post("/login", async (req, res) => {
    try {
        console.log("BEFORE GETTING USER");
        let user = await users.getUserByCredentials(req.body.username, req.body.password);
        console.log("BEFORE GENERATING TOKEN");
        generateToken(req, res, user);
        console.log("BEFORE RETURNING USER");
        res.json(user);
    }
    catch (error) {
        res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' });
    }
});

router.post("/logout", async (req, res) => {
    removeToken(req, res);
    res.json("Logged out");
});

router.post("/register/business", async (req, res) => {
    const { username } = req.body;
    //TODO: adding to the databse
    return res.json({ success: true, message: 'Business account registered successfully!' });
});

router.post("/register/employee", async (req, res) => {
    const { username } = req.body;
    //TODO: adding to the databse
    return res.json({ success: true, message: 'Employee account registered successfully!' });
});

router.post("/records", TokenMiddleware, async (req, res) => {
    const { userId, notes, minutes } = req.body;
    const newRecord = {
        // id: records[records.length - 1].id + 1,
        date: new Date().toISOString(),
        minutes: minutes,
        // TODO: USER ID NEEDS TO CHANGE
        userId: userId,
        notes: notes,
        paid: false
    }
    //TODO adding to the databse
    // records.push(newRecord);
    await records.createRecord(newRecord);
    return res.json({ success: true, message: 'Record added successfully!' });
})

router.post("/payments/:recipientId", TokenMiddleware, async (req, res) => {
    try {
        const senderId = req.user.id;
        const recipientId = req.params.recipientId;
        let unpaidRecords = await records.getUnpaidRecordsByUserId(recipientId);
        let employee = await users.getEmployeeById(recipientId);
        let amount = 0;
        unpaidRecords.forEach((record) => {
            amount += record.minutes * employee.hourly_rate;
        });
        let payment = req.body;
        await payments.createPayment(payment).then((payment) => {
            return res.json({ success: true, message: 'Payment added successfully!' });
        });
    }
    catch (error) {
        return res.status(error.status).json({ success: false, message: error.message });
    }
});

router.put("/records/:id", TokenMiddleware, async (req, res) => {
    try {
        const { notes, minutes } = req.body;
        let record = await records.getRecordById(req.params.id);
        record.notes = notes;
        record.minutes = minutes;
        await records.updateRecord(record);    
    }
    catch (error) {
        res.status(error.status).json({ success: false, message: error.message });
    }
    //TODO editing in the database
    // let record = records.find(record => record.id === parseInt(req.params.id));
    // let recordIndex = records.findIndex(record => record.id === parseInt(req.params.id));
    // if (record === undefined || record === null || recordIndex == -1) {
    //     res.status(404).json({ error: "Record not found" });
    // }
    // record.notes = notes;
    // record.minutes = minutes;
    // records.splice(recordIndex, 1, record);
    // return res.json({ success: true, message: 'Record edited successfully!' });
});

router.put("/users/:id", TokenMiddleware, async (req, res) => {
    const { first_name, last_name, username, avatar, role, affiliation, hourly_rate } = req.body;
    try {
        let user = await users.getUserById(req.params.id);
        user.first_name = first_name;
        user.last_name = last_name;
        user.username = username;
        user.avatar = avatar;
        user.role = role;
        user.affiliation = affiliation;
        user.hourly_rate = hourly_rate;
        await users.updateUser(req.params.id, user);
        return res.json({ success: true, message: 'User edited successfully!' });
    }
    catch (error) {
        res.status(error.status).json({ success: false, message: error.message });
    }
    //TODO editing in the database
    // let user = users.find(user => user.id === parseInt(req.params.id));
    // let userIndex = users.findIndex(user => user.id === parseInt(req.params.id));
    // if (user === undefined || user === null || userIndex == -1) {
    //     res.status(404).json({ error: "User not found" });
    // }
    // user.first_name = first_name;
    // user.last_name = last_name;
    // user.avatar = avatar;
    // users.splice(userIndex, 1, user);
    // return res.json({ success: true, message: 'User edited successfully!' });
});

router.delete("/records/:id", TokenMiddleware, async (req, res) => {
    const { id } = req.body;
    try {
        let record = await records.getRecordById(id);
        await records.deleteRecord(record);
        return res.json({ success: true, message: 'Record deleted successfully!' });
    }
    catch (error) {
        res.status(error.status).json({ success: false, message: error.message });
    }
    // let record = records.find(record => record.id === parseInt(req.params.id))
    // let recordIndex = records.findIndex(record => record.id === parseInt(req.params.id));
    // if (record === undefined || record === null || recordIndex == -1) {
    //     res.status(404).json({ error: "Record not found" });
    // }
    // //TODO delete in the database
    // records.splice(recordIndex, 1);
    // return res.json({ success: true, message: 'Record deleted successfully!' });
});

// router.delete("/users/:id", TokenMiddleware, (req, res) => {
//     const { id } = req.body;
//     let user = users.find(user => user.id === parseInt(req.params.id));
//     let userIndex = users.findIndex(user => user.id === parseInt(req.params.id));
//     if (user === undefined || user === null || userIndex == -1) {
//         res.status(404).json({ error: "User not found" });
//     }
//     //TODO delete in the database
//     users.splice(userIndex, 1);
//     return res.json({ success: true, message: 'User deleted successfully!' });
// });

module.exports = router;