const jwt = require("jsonwebtoken");

jwtSecret = 'string';

function jwtGenerator(userid) {
    const payload = {
            users: userid
        };

    return jwt.sign(payload, jwtSecret, { expiresIn: "1h" });
}

module.exports = jwtGenerator;