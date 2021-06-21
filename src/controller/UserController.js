const User = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const  db = require("../db");


exports.register = async (request, response) => {
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
        return response.sendStatus(200);
    } catch(error) {
        console.error('Something went wrong while creating a new user: ' + error.message);
        return response.sendStatus(400);
    }

};
