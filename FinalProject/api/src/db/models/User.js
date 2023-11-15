const crypto = require('crypto');

module.exports = class {
    id = null;
    first_name = null;
    last_name = null;
    username = null;
    avatar = null;
    role = null;
    affiliation = null;
    hourly_rate = null;
    #salt = null;;
    #password = null;;

    constructor(data) {
        this.id = data.id;
        this.first_name = data.first_name;
        this.last_name = data.last_name;
        this.username = data.username;
        this.avatar = data.avatar;
        this.role = data.role;
        this.affiliation = data.affiliation;
        this.hourly_rate = data.hourly_rate;
        this.#salt = data.salt;
        this.#password = data.password;
    }

    validatePassword(password) {
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(password, this.#salt, 100000, 64, 'sha512', (err, derivedKey) => {
                if (err) { //problem computing digest, like hash function not available
                    reject("Error: " + err);
                }

                const digest = derivedKey.toString('hex');
                if (this.#password == digest) {
                    resolve(this);
                }
                else {
                    const error = new Error("Invalid username or password");
                    error.status = 401;
                    reject(error);
                }
            });
        });
    }

    toJSON() {
        return {
            id: this.id,
            first_name: this.first_name,
            last_name: this.last_name,
            username: this.username,
            avatar: this.avatar,
            role: this.role,
            affiliation: this.affiliation,
            hourly_rate: this.hourly_rate
        }
    }
}