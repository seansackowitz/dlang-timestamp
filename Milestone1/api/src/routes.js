const express = require('express');
const router = express.Router();

let users = require("../data/users.json");
let records = require("../data/records.json");
let payments = require("../data/payments.json");

router.get("/users", (req, res) => {
    res.json(users);
})

router.get("/records", (req, res) => {
    res.json(records);
})

router.get("/payments", (req, res) => {
    res.json(payments)
})

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
            res.status(404).send("Incorrect password");
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
    //TODO adding to the databse
    return res.json({ success: true, message: 'Record added successfully!' });
})

router.put("/records/:id", (req, res) => {
    const {notes, minutes} = req.body;
    //TODO editing in the database
    return res.json({ success: true, message: 'Record edited successfully!' });
})

router.put("/users/:id", (req, res) => {
    const {first_name, last_name, avatar} = req.body;
    //TODO editing in the database
    return res.json({ success: true, message: 'User edited successfully!' });
})

router.delete("/records/:id",(req, res) => {
    const {id} = req.body;
    //TODO delete in the database
    return res.json({ success: true, message: 'Record deleted successfully!' });
})

router.delete("/users/:id",(req, res) => {
    const {id} = req.body;
    //TODO delete in the database
    return res.json({ success: true, message: 'User deleted successfully!' });
})

module.exports = router;