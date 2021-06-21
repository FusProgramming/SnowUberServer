const Express = require('express');
const app = Express();
const  db = require("./db");
const path = require('path');
const bcrypt = require('bcryptjs');
const jwtGenerator = require('../utils/jwtGenerator');
const userRegisterAuth = require('./routes/UserRegister');

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

//--------------------------------------------------------------------------------------------------------------------------

app.use('/', userRegisterAuth);

const port = process.env.PORT || 4100;
app.listen(port, () => console.log(`Server has started on localhost:${port}`));