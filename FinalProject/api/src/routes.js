const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");

// let users = require("../data/users.json");
// let records = require("../data/records.json");
// let payments = require("../data/payments.json");

const records = require("./db/RecordDAO");
const payments = require("./db/PaymentDAO");
const users = require("./db/UserDAO");
const {
    TokenMiddleware,
    generateToken,
    removeToken,
    updateToken,
} = require("./middleware/TokenMiddleware");

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
        res.json(await senderPayments);
    } catch (error) {
        res.status((await error.status) || 404).json({
            error:
                (await error.message) ||
                "Sender not found by ID " + req.params.senderId,
        });
    }
});

// get all payments received by user with recipientId
router.get(
    "/payments/recipient/:recipientId",
    TokenMiddleware,
    async (req, res) => {
        let recipientId = req.params.recipientId;
        // let recipientPayments = payments.filter(payment => {
        //     return payment.recipientId == recipientId;
        // });
        try {
            let recipientPayments = await payments.getPaymentsByRecipientId(
                recipientId
            );
            res.json(await recipientPayments);
        } catch (error) {
            res.status((await error.status) || 404).json({
                error:
                    (await error.message) ||
                    "Recipient not found by ID " + req.params.recipientId,
            });
        }
    }
);

router.post("/payments", TokenMiddleware, async (req, res) => {
    try {
        const { amount, date, recipientId, senderId } = await req.body;
        const payment = {
            amount: amount,
            date: date,
            recipientId: recipientId,
            senderId: senderId,
        };
        await payments.createPayment(payment);
        return res.json({
            success: true,
            message: "Payment added successfully!",
        });
    } catch (error) {
        res.status((await error.status) || 400).json({
            error:
                (await error.message) ||
                "Payment could not be added due to bad request",
        });
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
    } catch (error) {
        res.status((await error.status) || 404).json({
            error: (await error.message) || "User not found by ID " + userId,
        });
    }
});

router.get("/records/:id", TokenMiddleware, async (req, res) => {
    try {
        let userId = req.params.id;
        console.log("THIS IS USER ID", userId);
        let record = await records.getRecordByUserId(userId);
        console.log("THIS IS RECORD", record);
        return res.json(await record);
    } catch (error) {
        res.status((await error.status) || 404).json({
            error:
                (await error.message) ||
                "Record not found by user ID " + req.params.id,
        });
    }
});

router.get("/unpaid_records/:id", TokenMiddleware, async (req, res) => {
    try {
        let userId = req.params.id;
        let unpaid_records = await records.getUnpaidRecordsByUserId(userId);
        return res.json(await unpaid_records);
    } catch (error) {
        res.status((await error.status) || 404).json({
            error:
                (await error.message) ||
                "Unpaid Record not found by user ID " + req.params.id,
        });
    }
});

router.get("/login/users/current", TokenMiddleware, async (req, res) => {
    res.json(await req.user);
});

router.post("/login", async (req, res) => {
    try {
        console.log("BEFORE GETTING USER");
        let user = await users.getUserByCredentials(
            await req.body.username,
            await req.body.password
        );
        console.log("BEFORE GENERATING TOKEN");
        generateToken(req, res, user);
        console.log("BEFORE RETURNING USER");
        res.json(await user);
    } catch (error) {
        res.status(error.status || 500).json({
            error: error.message || "Internal Server Error",
        });
    }
});

router.post("/logout", async (req, res) => {
    removeToken(req, res);
    res.json("Logged out");
});

router.post("/register/business", async (req, res) => {
    try {
        const result = await users.registerBusiness(req.body);
        res.json({
            message: result.message,
        });
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message || "Error registering a user",
        });
    }
});

router.post("/register/employee", async (req, res) => {
    try {
        console.log("this is the register data: ", req.body);
        const result = await users.registerUser(req.body);
        console.log("this is the result of creating register: ", result);
        res.json({
            message: result.message,
        });
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message || "Error registering a user",
        });
    }
});

router.post("/records/calculate", TokenMiddleware, async (req, res) => {
    const { date, notes, startTime, endTime } = await req.body;
    let d1 = "0000-01-01 " + (await startTime);
    let d2 = "0000-01-01 " + (await endTime);
    // If the times are the same, then it is 24 hours.
    console.log("CALCULATE MINUTES");
    console.log("START TIME", startTime);
    console.log("END TIME", endTime);
    // else {
    // console.log("NOT 24 HOURS");
    // totalMinutes = Math.abs(Math.floor((new Date(d2).getTime() - new Date(d1).getTime()) / 60000));
    // console.log("MINUTES IS", totalMinutes);
    // }
    let totalMinutes = Math.abs(
        Math.floor((new Date(d2).getTime() - new Date(d1).getTime()) / 60000)
    );
    const newRecord = {
        // id: records[records.length - 1].id + 1,
        date: date,
        minutes: totalMinutes,
        // TODO: USER ID NEEDS TO CHANGE
        notes: notes,
        paid: false,
    };
    console.log("THIS IS THE RECORD OBJECT", newRecord);
    console.log("THIS IS TYPE OF RECORD", typeof newRecord);
    //TODO adding to the databse
    // records.push(newRecord);
    // Add 2 records to the database if the time rolls over
    if ((await endTime) <= (await startTime)) {
        // Create record for start date
        console.log("24 HOURS OR LESS");
        d2 = "0000-01-02 00:00";
        totalMinutes = Math.abs(
            Math.floor(
                (new Date(d2).getTime() - new Date(d1).getTime()) / 60000
            )
        );
        newRecord.minutes = totalMinutes;
        console.log("MINUTES IS", totalMinutes, "ON DATE", date);
        await records.createRecord(newRecord, await req.user.id);
        // Create record for end date (rolling over hours) if the end date isn't midnight
        if ((await endTime) !== "00:00") {
            console.log("IN IF STATEMENT");
            d1 = "0000-01-02 00:00";
            d2 = "0000-01-02 " + (await endTime);
            totalMinutes = Math.abs(
                Math.floor(
                    (new Date(d2).getTime() - new Date(d1).getTime()) / 60000
                )
            );
            newRecord.minutes = totalMinutes;
            console.log("MINUTES IS", totalMinutes);
            // newRecord.date = new Date(await date).setDate(new Date(await date).getDate() + 1);
            console.log("DATE IS BEFORE CHANGE", await newRecord.date);
            // This cursed code is to increment the date by 1 day
            newRecord.date = new Date(
                new Date(await date).setDate(new Date(await date).getDate() + 1)
            );
            // newRecord.date = new Date(new Date(await date).getDate() + 1);
            console.log("DATE IS AFTER CHANGE", await newRecord.date);
            await records.createRecord(newRecord, await req.user.id);
        }
    }
    // Otherwise, add 1 record for the current date
    else {
        await records.createRecord(newRecord, await req.user.id);
    }

    return res.json({ success: true, message: "Record added successfully!" });
});

router.post("/records/manual", TokenMiddleware, async (req, res) => {
    const { date, notes, minutes } = req.body;
    const newRecord = {
        // id: records[records.length - 1].id + 1,
        date: date,
        minutes: minutes,
        // TODO: USER ID NEEDS TO CHANGE
        notes: notes,
        paid: false,
    };
    await records.createRecord(newRecord, await req.user.id);
    return res.json({ success: true, message: "Record added successfully!" });
});

router.post("/payments/:recipientId", TokenMiddleware, async (req, res) => {
    try {
        const senderId = await req.user.id;
        const recipientId = req.params.recipientId;
        let unpaidRecords = await records.getUnpaidRecordsByUserId(recipientId);
        let employee = await users.getEmployeeById(recipientId);
        let amount = 0;
        await unpaidRecords.forEach((record) => {
            amount += record.minutes * employee.hourly_rate;
        });
        let payment = await req.body;
        await payments.createPayment(await payment).then((payment) => {
            return res.json({
                success: true,
                message: "Payment added successfully!",
            });
        });
    } catch (error) {
        return res.status(error.status || 400).json({
            success: false,
            message: error.message || "Bad request for creating payment",
        });
    }
});

router.put("/records/:id", TokenMiddleware, async (req, res) => {
    try {
        const { notes, minutes, date } = await req.body;
        if (minutes < 0) {
            throw new Error("Minutes can't be less than 0");
        }
        console.log("GOT NOTES", notes);
        console.log("GOT MINUTES", minutes);
        console.log("GOT DATE", date);
        console.log("BEFORE GETTING RECORD BY ID", req.params.id);
        let record = await records.getRecordById(req.params.id);
        console.log("AFTER GETTING RECORD BY ID", req.params.id);
        console.log("OLD RECORD IS", record);
        console.log("TYPE OF DATE OF OLD RECORD IS", typeof record.date);
        record.notes = notes;
        record.minutes = minutes;
        record.date = new Date(date);
        console.log("TYPE OF DATE OF NEW RECORD IS", typeof record.date);
        console.log("NEW RECORD IS", record);
        console.log("BEFORE UPDATE RECORD");
        res.json(await records.updateRecord(record));
    } catch (error) {
        res.status(error.status || 404).json({
            success: false,
            message: error.message || "Record not found by ID " + req.params.id,
        });
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

router.put("/users/:username", TokenMiddleware, async (req, res) => {
    const { username } = req.params;
    const { newPassword, ...updateData } = req.body;
    try {
        console.log(req.body);
        console.log("This is the username: ", username);
        console.log("This is the update data: ", updateData);
        console.log("This is the new password: ", newPassword);
        console.log("This is the user: ", req.user);
        // Check for validation of fields
        if (req.user.role !== updateData.role) {
            res.status(error.code || 400).json({success: false, message: error.message || "Role cannot be modified."})
        }
        else if (req.user.affiliation !== updateData.affiliation && req.user.role !== "employer") {
            res.status(error.code || 400).json({success: false, message: error.message || "Affiliation cannot be modified as an employee nor a self-employed user."})
        }
        else if (req.user.role === "employee" && req.user.hourly_rate !== updateData.hourly_rate) {
            res.status(error.code || 400).json({success: false, message: error.message || "Hourly rate cannot be modified as an employee."})
        }
        // Update the company name for all users if the employer wishes to change the business name
        if (req.user.affiliation !== updateData.affiliation && req.user.role === "employer") {
            const employees = await users.getUsersWithSameAffiliationAsEmployer(req.user.username);
            console.log("THESE ARE ALL EMPLOYEES:", employees);
            for (let i = 0; i < employees.length; i++) {
                const employee = employees[i];
                const affiliationChange = {
                    affiliation: updateData.affiliation
                };
                await users.updateUser(employee.username, affiliationChange, null);
            }
        }
        const result = await users.updateUser(
            username,
            updateData,
            newPassword
        );
        console.log("Result from updating the user: ", result);
        const updatedUser = await users.getUserByUsername(username);
        updateToken(req, res, updatedUser);
        res.json({
            message: result.message,
        });
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message || "Error updating user",
        });
    }
});

router.delete("/records/:id", TokenMiddleware, async (req, res) => {
    const { id } = await req.params;
    try {
        let record = await records.getRecordById(id);
        await records.deleteRecord(record);
        return res.json({
            success: true,
            message: "Record deleted successfully!",
        });
    } catch (error) {
        res.status(error.status || 404).json({
            success: false,
            message: error.message || "Record not found by ID " + id,
        });
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

router.get("/users/:username/employees", TokenMiddleware, async (req, res) => {
    const { username } = req.params;
    try {
        const usersWithTheSameAffiliation =
            await users.getUsersWithSameAffiliationAsEmployer(username);
        res.json(usersWithTheSameAffiliation);
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message || "Error getting employees",
        });
    }
});

router.put("/users/employer/:username", TokenMiddleware, async (req, res) => {
    const { username } = req.params;
    const { newPassword, ...updateData } = req.body;
    try {
        console.log(req.body);
        console.log("This is the username: ", username);
        console.log("This is the update data: ", updateData);
        // console.log('This is the new password: ', newPassword);
        const checkValidUser = await users.getUserByUsername(username);
        if (checkValidUser.role === "employer" || (checkValidUser.role === "employee" && checkValidUser.affiliation !== req.user.affiliation)) {
            throw new Error("You are not allowed to update this user");
        }
        const result = await users.updateUser(
            username,
            updateData,
            newPassword
        );
        // const updatedUser = await users.getUserByUsername(username);
        // updateToken(req, res, updatedUser);
        res.json({
            message: result.message,
        });
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message || "Error updating user",
        });
    }
});

module.exports = router;
