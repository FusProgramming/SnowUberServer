const Express = require('express');
const app = Express();
const  db = require("../db");
const path = require('path');
const bcrypt = require('bcryptjs');
const jwtGenerator = require('../utils/jwtGenerator');

const clientAppDirectory = path.join(__dirname, '../public', 'build');

app.use(Express.json());
app.use(Express.static(clientAppDirectory));

//----------------------------------------------------------------------------------------------------------------------
app.get("/getAll", async (req, res) => {
    const results = await db.query("select * from testtable");
    console.log(results);
    res.status(200).json({
        status: "success"
    })
});
//----------------------------------------------------------------------------------------------------------------------
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

        return response.status(401).json(validPassword);

    } catch(error) {
        console.error(error);
        response.status(500).send("Server error");
    }
});

//----------------------------------------------------------------------------------------------------------------------
app.post('/api/users', async (request, response) => {
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

});

const port = process.env.PORT || 4100;
app.listen(port, () => console.log(`Server has started on localhost:${port}`));