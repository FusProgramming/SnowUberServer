const express = require("express");
const app = express.Router();
const bcrypt = require('bcryptjs');
const db = require("../db");
const jwtGenerator = require('../utils/jwtGenerator');

app.post('/register', async (request, response) => {
    console.log('A request came in with the body: ' + JSON.stringify(request.body));
    const {firstName, lastName, emailAddress, emailAddress2, userPassword } = request.body;
    try {
        const user = await db.query("SELECT * FROM users WHERE emailAddress = $1", [emailAddress]);

        if(user.rows.length > 0) {
            return response.status(401).json("User already exist!");
        }

        const hashedPassword = await bcrypt.hash(userPassword, 12);

        const newUser = await db.query(
            "INSERT INTO users (firstName, lastName, emailAddress, emailAddress2, userPassword, userPassword2) values ($1, $2, $3, $4, $5, $6) returning *",
            [firstName, lastName, emailAddress, emailAddress2, hashedPassword, hashedPassword]
        );
        const jwtToken = jwtGenerator(newUser.rows[0].userid);
        return await response.json({ jwtToken}).sendStatus(200);
    } catch(error) {
        console.error('Something went wrong while creating a new user: ' + error.message);
        return response.sendStatus(400);
    }
});




module.exports = app;