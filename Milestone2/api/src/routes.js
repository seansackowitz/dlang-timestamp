const express = require('express');
const router = express.Router();

let users = require("../data/users.json");
let records = require("../data/records.json");
let payments = require("../data/payments.json");

router.get("/users", (req, res) => {
    res.json(users);
});

router.get("/records", (req, res) => {
    res.json(records);
});

router.get("/payments", (req, res) => {
    res.json(payments);
});

// get all payments sent by user with senderId
router.get("/payments/sender/:senderId", (req, res) => {
    let senderId = req.params.senderId;
    let senderPayments = payments.filter(payment => {
        return payment.senderId == senderId;
    });
    res.json(senderPayments);
})

// get all payments received by user with recipientId
router.get("/payments/recipient/:recipientId", (req, res) => {
    let recipientId = req.params.recipientId;
    let recipientPayments = payments.filter(payment => {
        return payment.recipientId == recipientId;
    });
    res.json(recipientPayments);
})

router.post("/payments", (req, res) => {
    const {amount, date, recipientId, senderId} = req.body;
    const payment = {
        amount: amount,
        date: date,
        recipientId: recipientId,
        senderId: senderId
    }
    //TODO adding to the database
    payments.push(payment);
    return res.json({ success: true, message: 'Payment added successfully!' });
});

router.get("/users/:id", (req, res) => {
    let userId = req.params.id;
    let user = users.find(usr => {
        console.log("GET /users/:id route hit");
        return usr.id == userId;
    });
    if(!user) {
        res.status(404).send("User not found");
        res.json("User not found");
    }
    else {
        res.json(user);
    }
})

router.get("/records/:id", (req, res) => {
    let usrId = req.params.id;
    let record = records.find(rec => {
        console.log(rec.userId);
        return usrId == rec.userId;
    })
    if(!record) {
        res.status(404).send("Record not found");
        res.json("Record not found");
    }
    else {
        res.json(record);
    }
})

router.post("/login", (req, res) => {
    let userId = req.params.id;
    let user = users.find(usr => {
        return usr.id == userId;
    });
    if(!user) {
        res.status(404).send("User not found");
        res.json("User not found");
    }
    else {
        if(user.password == req.body.password) {
            res.json(user);
        }
        else {
            res.status(401).send("Incorrect password");
            res.json("Incorrect password");
        }
    }
})

router.post("/register/business", (req, res) => {
    const {username} = req.body;
    //TODO: adding to the databse
    return res.json({ success: true, message: 'Business account registered successfully!' });
});

router.post("/register/employee", (req, res) => {
    const {username} = req.body;
    //TODO: adding to the databse
    return res.json({ success: true, message: 'Employee account registered successfully!' });
});

router.post("/records", (req, res) => {
    const {notes, minutes} = req.body;
    const newRecord = {
        id: records[records.length - 1].id + 1,
        date: new Date().toISOString(),
        minutes: minutes,
        // TODO: USER ID NEEDS TO CHANGE
        userId: 1,
        notes: notes
    }
    //TODO adding to the databse
    records.push(newRecord);
    return res.json({ success: true, message: 'Record added successfully!' });
})

router.put("/records/:id", (req, res) => {
    const {notes, minutes} = req.body;
    //TODO editing in the database
    let record = records.find(record => record.id === parseInt(req.params.id));
    let recordIndex = records.findIndex(record => record.id === parseInt(req.params.id));
    if (record === undefined || record === null || recordIndex == -1) {
        res.status(404).json({error: "Record not found"});
    }
    record.notes = notes;
    record.minutes = minutes;
    records.splice(recordIndex, 1, record);
    return res.json({ success: true, message: 'Record edited successfully!' });
})

router.put("/users/:id", (req, res) => {
    const {first_name, last_name, avatar} = req.body;
    //TODO editing in the database
    let user = users.find(user => user.id === parseInt(req.params.id));
    let userIndex = users.findIndex(user => user.id === parseInt(req.params.id));
    if (user === undefined || user === null || userIndex == -1) {
        res.status(404).json({error: "User not found"});
    }
    user.first_name = first_name;
    user.last_name = last_name;
    user.avatar = avatar;
    users.splice(userIndex, 1, user);
    return res.json({ success: true, message: 'User edited successfully!' });
})

router.delete("/records/:id",(req, res) => {
    const {id} = req.body;
    let record = records.find(record => record.id === parseInt(req.params.id))
    let recordIndex = records.findIndex(record => record.id === parseInt(req.params.id));
    if (record === undefined || record === null || recordIndex == -1) {
        res.status(404).json({error: "Record not found"});
    }
    //TODO delete in the database
    records.splice(recordIndex, 1);
    return res.json({ success: true, message: 'Record deleted successfully!' });
})

router.delete("/users/:id",(req, res) => {
    const {id} = req.body;
    let user = users.find(user => user.id === parseInt(req.params.id));
    let userIndex = users.findIndex(user => user.id === parseInt(req.params.id));
    if (user === undefined || user === null || userIndex == -1) {
        res.status(404).json({error: "User not found"});
    }
    //TODO delete in the database
    users.splice(userIndex, 1);
    return res.json({ success: true, message: 'User deleted successfully!' });
})

module.exports = router;