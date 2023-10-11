const express = require('express');
const router = express.Router();

let users = require("../data/users.json");
let records = require("../data/records.json");

router.get("/users", (req, res) => {
    res.json(users);
})

router.get("/records", (req, res) => {
    res.json(records);
})

router.get("/users/:id", (req, res) => {
    let userId = req.params.id;
    let user = users.find(usr => {
        console.log("GET /users/:id route hit");
        return usr.id == userId;
    });
    if(!user) {
        res.status(404).send("User not found");
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
    }
    else {
        res.json(record);
    }
})

module.exports = router;