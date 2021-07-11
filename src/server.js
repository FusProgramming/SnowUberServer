const Express = require('express');
const app = Express();
const  db = require("./db");
const path = require('path');
const bcrypt = require('bcryptjs');
const jwtGenerator = require('./utils/jwtGenerator');
const cors = require("cors");
const authorize = require("./middleware/AuthHandler");

const clientAppDirectory = path.join(__dirname, '../public', 'build');

app.use(cors());
app.use(Express.json());
app.use(Express.static(clientAppDirectory));

//----------------------------------------------------------------------------------------------------------------------
app.get("/getAll", async (req, res) => {
    const results = await db.query("select * from testtable");
    console.log(results);
    res.status(200).json({
        status: "successss"
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

        const userToken = jwtGenerator(user.rows[0].userid);
        console.log(userToken);

        return response.status(200).json(validPassword);

    } catch(error) {
        console.error(error);
        response.status(400).send("Server error");
    }
});

//--------------------------------------------------------------------------------------------------------------------------

app.use("/authentication", require("./routes/RegistrationPage"));

app.use("/dashboard", require("./routes/dashboard"));

app.post("/verify", authorize, (req, res) => {
    try {

        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});

const port = process.env.PORT || 4100;
app.listen(port, () => console.log(`Server has started on localhost:${port}`));