const express = require("express");
const app = express.Router();
const bcrypt = require('bcryptjs');
const db = require("../db");
const jwtGenerator = require('../utils/jwtGenerator');

app.post("/login", async (request, response)=> {
    const { emailAddress, userPassword} = request.body;
    try {
        const user = await db.query("SELECT * FROM users WHERE emailAddress = $1", [emailAddress]);
        if (user.rows.length === 0) {
            return response.sendStatus(401);
        }
        const validPassword = await bcrypt.compare(userPassword, user.rows[0].userpassword);

        if (!validPassword) {
            return response.status(401).json("Invalid Credential");
        }

        const userToken = jwtGenerator(user.rows[0].userid);
        console.log(userToken);

        return response.status(200).json(validPassword);

    } catch(error) {
        console.error(error);
        response.status(400).send("Server error");
    }
});


module.exports = app;