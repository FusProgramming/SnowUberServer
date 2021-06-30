const router = require("express").Router();
const authorize = require("../middleware/AuthHandler");
const db = require("../db");


router.post("/UserHomePage", authorize, async (request, response ) => {
    const {firstName} = request.body;
    try {
        const user = await db.query(
            "SELECT firstName FROM users WHERE userid = $1",
            [firstName]
        );

        return response.sendStatus(200).json(user.rows[0]);
    } catch (error) {
        console.error('Something went wrong while creating a new user: ' + error.message);
        return response.sendStatus(400);
    }

});

module.exports = router;
