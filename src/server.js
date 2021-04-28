const Express = require('express');
const app = Express();
const  db = require("../db");


app.get("/getAll", async (req, res) => {

    const results = await db.query("select * from testtable");
    console.log(results);
    res.status(200).json({
        status: "success"
    })
});

const port = process.env.PORT || 4100;
app.listen(port, () => console.log(`Server has started on localhost:${port}`));