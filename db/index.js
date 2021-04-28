const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.PGUSER,
    host: "localhost",
    database: "snowuberdb",
    password: "password",
    port: 5432,
});
module.exports = {
    query: (text, params) => pool.query(text, params),
};


