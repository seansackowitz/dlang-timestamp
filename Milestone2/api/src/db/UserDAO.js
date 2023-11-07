const db = require('./DBConnection');
const User = require('./models/User');
const crypto = require('crypto');

async function getUserByCredentials(username, password) {
    try {
        const { results } = await db.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        if (results.length <= 0) {
            throw new Error('No such user');
        }
        const user = new User(results[0]);
        if (user) {
            return user.validatePassword(password);
        } else {
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function getUserById(id) {
    try {
        const { results } = await db.query('SELECT * FROM users WHERE id = ?', [
            id,
        ]);
        if (results.length > 0) {
            const user = new User(results[0]);
            return user;
        } else {
            throw new Error('No such user');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function registerUser(db, username, firstname, lastname, password) {
    try {
        // Check if the username already exists
        const existingUser = await db.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        if (existingUser.results.length > 0) {
            throw new Error('Username already exists');
        }

        // Generate a salt
        const salt = crypto.randomBytes(16).toString('hex');

        // Hash the password with the salt
        const hashedPasswordBuffer = await crypto.pbkdf2Sync(
            password,
            salt,
            10000,
            64,
            'sha512'
        );
        const hashedPassword = hashedPasswordBuffer.toString('hex');

        // Insert the new user into the database
        await db.query(
            'INSERT INTO users (username, firstname, lastname, password, salt, role, avatar, affiliation) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
                username,
                firstname,
                lastname,
                hashedPassword,
                salt,
                'self-employed',
                'https://images-ext-1.discordapp.net/external/6CZaeJz37z5zmVIZ2c1ELxM5NicrKd96KM65FiBHGPA/https/art.pixilart.com/0b055c338bd0168.png?width=1033&height=1033',
                'none',
            ]
        );

        return {
            message: 'Account Created',
        };
    } catch (error) {
        // Handle any error that occurred during the process
        if (error.message === 'Username already exists') {
            throw {
                code: 409, // Conflict
                message: error.message,
            };
        } else {
            throw {
                code: 500,
                message: `Internal Server Error: ${error.message}`,
            };
        }
    }
}

// function updateUser(id, updateData) {
//     let updates = Object.entries(updateData)
//         .map(([key, val]) => `${key} = ${db.escape(val)}`)
//         .join(', ');

//     if (updates.length === 0) {
//         return Promise.resolve({
//             message: 'No updates provided',
//         });
//     }

//     return db
//         .query(`UPDATE users SET ${updates} WHERE id = ${db.escape(id)}`)
//         .then((result) => {
//             if (result.affectedRows === 0) {
//                 return {
//                     message: 'No such user or no changes made',
//                 };
//             } else {
//                 return {
//                     message: 'User updated successfully',
//                 };
//             }
//         })
//         .catch((error) => {
//             console.log(error);
//             throw new Error(error);
//         });
// }

async function updateUser(id, updateData) {
    try {
        let updates = [];
        for (const [key, value] of Object.entries(updateData)) {
            updates.push(`${key} = ?`);
        }
        const updateValues = Object.values(updateData);
        const updateString = updates.join(', ');

        // Check if the user exists before trying to update
        const userCheck = await db.query('SELECT * FROM users WHERE id = ?', [
            id,
        ]);
        if (userCheck.results.length === 0) {
            throw { code: 404, message: 'User not found' };
        }

        // Update the user
        const updateResults = await db.query(
            `UPDATE users SET ${updateString} WHERE id = ?`,
            [...updateValues, id]
        );
        if (updateResults.affectedRows === 0) {
            return { message: 'No changes made' };
        } else {
            return { message: 'User updated' };
        }
    } catch (error) {
        throw { code: 500, message: `Internal Server Error: ${error.message}` };
    }
}

function getUsersWithSameAffilaitionAsEmployer(employerId) {
    // First, get the employer's affiliation
    return db
        .query('SELECT affiliation FROM users WHERE id = ? AND role = ?', [
            employerId,
            'employer',
        ])
        .then(({ results }) => {
            if (results.length === 0) {
                // No employer found with the given ID
                throw new Error('Emoloyer not found');
            }

            const employerAffiliation = results[0].affiliation;
            // Now, get all users with the same affiliation
            return db.query(
                'SELECT * FROM users WHERE affiliation = ? AND role = ?',
                [employerAffiliation, 'employee']
            );
        })
        .then(({ results }) => {
            // Return the list of users with the same affiliation
            if (results.length > 0) {
                return results.map((user) => new User(user));
            } else {
                // No users found with the same affiliation
                return [];
            }
        })
        .catch((error) => {
            console.log(error);
            throw new Error(error);
        });
}

module.exports = {
    getUserByCredentials: getUserByCredentials,
    getUserById: getUserById,
    registerUser: registerUser,
    updateUser: updateUser,
    getUsersWithSameAffilaitionAsEmployer:
        getUsersWithSameAffilaitionAsEmployer,
};
