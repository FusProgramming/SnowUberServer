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
    const { firstname, lastname, emailaddress, password } = request.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        await db.query(
            "INSERT INTO users (firstname, lastname, emailaddress, password) values ($1, $2, $3, $4) returning *",
                [firstname, lastname, emailaddress, hashedPassword]
            );
       console.log(firstname, lastname, emailaddress, hashedPassword);
       return response.sendStatus(200);
    } catch(error) {
        console.error('Something went wrong while creating a new user: ' + error.message);
        return response.sendStatus(400);
    }
});

const port = process.env.PORT || 4100;
app.listen(port, () => console.log(`Server has started on localhost:${port}`));