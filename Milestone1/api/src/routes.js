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
    return res.json("Not implemented");
});

router.post("/register/employee", (req, res) => {
    return res.json("Not implemented");
});

router.post("/records", (req, res) => {
    return res.json("Not implemented");
})

router.put("/records/:id", (req, res) => {
    return res.json("Not implemented");
})

router.put("/users/:id", (req, res) => {
    return res.json("Not implemented");
})

router.delete("/records/:id",(req, res) => {
    return res.json("Not implemented");
})

router.delete("/users/:id",(req, res) => {
    return res.json("Not implemented");
})

module.exports = router;