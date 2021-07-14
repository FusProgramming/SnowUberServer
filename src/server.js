const Express = require('express');
const app = Express();
const  db = require("./db");
const path = require('path');
const bcrypt = require('bcryptjs');
const jwtGenerator = require('./utils/jwtGenerator');
const cors = require("cors");
const authorize = require("./middleware/AuthHandler");
const RegisterRoute = require("./routes/RegistrationPage");
const LoginRoute = require("./routes/LoginRoute");

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
app.use("/authentication", LoginRoute);

//----------------------------------------------------------------------------------------------------------------------
app.use("/authentication", RegisterRoute);




const port = process.env.PORT || 4100;
app.listen(port, () => console.log(`Server has started on localhost:${port}`));