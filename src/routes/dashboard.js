const router = require("express").Router();
const authorize = require("../middleware/AuthHandler");
const db = require("../db");

router.post("/", authorize, async (request, response ) => {
    console.log("1222222222222222222222");
    try {
        const user = await db.query(
            "SELECT firstName FROM users WHERE userid = $1",
            [request.users.id]
        );

        return await response.json( user.rows[0]);
    } catch (error) {
        return response.sendStatus(200);
    }

});

module.exports = router;
