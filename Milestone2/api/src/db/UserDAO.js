const db = require('./DBConnection');
const User = require('./models/User');
const crypto = require('crypto');

async function getUserByCredentials(username, password) {
    console.log('BEFORE TRY CATCH');
    try {
        console.log('BEFORE DB QUERY');
        const { results } = await db.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        console.log('THIS IS THE USER FOUND', results);
        if (results.length <= 0) {
            const error = new Error('No such user');
            error.status = 404;
            throw error;
        }
        const user = new User(results[0]);
        if (user) {
            return await user.validatePassword(password);
        } else {
            const error = new Error('Invalid username or password');
            error.status = 401;
            throw error;
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

async function getUserByUsername(username) {
    try {
        const { results } = await db.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
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

async function registerBusiness(registerData) {
    try {
        const { affiliation, username, first_name, last_name, password } =
            registerData;

        console.log(registerData);
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
            100000,
            64,
            'sha512'
        );
        const hashedPassword = hashedPasswordBuffer.toString('hex');
        await db.query(
            'INSERT INTO users (username, first_name, last_name, password, salt, role, avatar, affiliation, hourly_rate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                username,
                first_name,
                last_name,
                hashedPassword,
                salt,
                'employer',
                'https://media.discordapp.net/attachments/813610330374144050/1172442187858984981/85434_guest_512x512.png?ex=656054e0&is=654ddfe0&hm=77bd3f750309b9e51fc4f5ce0dd391a4a6d621e45de38d47b999c590542af28e&=&width=576&height=576',
                affiliation,
                0,
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

async function registerUser(registerData) {
    try {
        const { username, first_name, last_name, password } = registerData;
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
            100000,
            64,
            'sha512'
        );
        const hashedPassword = hashedPasswordBuffer.toString('hex');

        // Insert the new user into the database
        await db.query(
            'INSERT INTO users (username, first_name, last_name, password, salt, role, avatar, affiliation, hourly_rate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                username,
                first_name,
                last_name,
                hashedPassword,
                salt,
                'self-employed',
                'https://media.discordapp.net/attachments/813610330374144050/1172442187858984981/85434_guest_512x512.png?ex=656054e0&is=654ddfe0&hm=77bd3f750309b9e51fc4f5ce0dd391a4a6d621e45de38d47b999c590542af28e&=&width=576&height=576',
                'none',
                0,
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

async function updateUser(username, updateData, newPassword) {
    try {
        let updates = [];
        const updateValues = [];
        if (newPassword !== undefined && newPassword !== null && newPassword) {
            //hash
            const salt = crypto.randomBytes(16).toString('hex');
            updateData.salt = salt;
            const hashedPasswordBuffer = crypto.pbkdf2Sync(
                newPassword,
                salt,
                100000,
                64,
                'sha512'
            );
            const hashedPassword = hashedPasswordBuffer.toString('hex');
            updateData.password = hashedPassword;
        }
        for (const [key, value] of Object.entries(updateData)) {
            if (value !== undefined) {
                updates.push(`${key} = ?`);
                updateValues.push(value);
            }
        }

        const updateString = updates.join(', ');

        // Check if the user exists before trying to update
        const userCheck = await db.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        if (userCheck.results.length === 0) {
            throw { code: 404, message: 'User not found' };
        }
        console.log('this is the update string: ', updateString);
        console.log('this is the update values: ', updateValues);
        // Update the user
        const updateResults = await db.query(
            `UPDATE users SET ${updateString} WHERE username = ?`,
            [...updateValues, username]
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

function getUsersWithSameAffilaitionAsEmployer(username) {
    // First, get the employer's affiliation
    return db
        .query(
            'SELECT affiliation FROM users WHERE username = ? AND role = ?',
            [username, 'employer']
        )
        .then(({ results }) => {
            if (results.length === 0) {
                // No employer found with the given ID
                throw new Error('Emoloyer not found');
            }

            const employerAffiliation = results[0].affiliation;
            console.log('Thats my company right there: ', employerAffiliation);
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
    getUserByUsername: getUserByUsername,
    registerBusiness: registerBusiness,
};
