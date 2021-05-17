const Express = require('express');
const app = Express();
const  db = require("../db");
const path = require('path');
const bcrypt = require('bcryptjs');

const clientAppDirectory = path.join(__dirname, '../public', 'build');

app.use(Express.json());
app.use(Express.static(clientAppDirectory));

app.get("/getAll", async (req, res) => {

    const results = await db.query("select * from testtable");
    console.log(results);
    res.status(200).json({
        status: "success"
    })
});


app.post('/api/users', async (request, response) => {
    console.log('A request came in with the body: ' + JSON.stringify(request.body));
    const { firstName, lastName, emailAddress, emailAddress2, userPassword, userPassword2 } = request.body;
    try {
        if(!firstName || !lastName || !emailAddress || !emailAddress2 || !userPassword || !userPassword2 ) {
            errors.push({ message: "Please enter all fields" });
        }
        const hashedPassword = await bcrypt.hash(userPassword, 12);
        const hashedPassword2 = await bcrypt.hash(userPassword2, 12);
        await db.query(
            "INSERT INTO users (firstName, lastName, emailAddress, emailAddress2, userPassword, userPassword2) values ($1, $2, $3, $4, $5, $6) returning *",
                [firstName, lastName, emailAddress, emailAddress2, hashedPassword, hashedPassword2]
            );
       console.log(firstName, lastName, emailAddress, emailAddress2, hashedPassword, hashedPassword2);
       return response.sendStatus(200);
    } catch(error) {
        console.error('Something went wrong while creating a new user: ' + error.message);
        return response.sendStatus(400);
    }
});

const port = process.env.PORT || 4100;
app.listen(port, () => console.log(`Server has started on localhost:${port}`));