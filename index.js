const express = require('express');
require('dotenv').config();

const {Pool} = require('pg');

const DATABASE_USER = process.env.DATABASE_USER;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_PORT = process.env.DATABASE_PORT;
const DATABASE_NAME = process.env.DATABASE_NAME;
const DATABASE_HOST= process.env.DATABASE_HOST

const pool = new Pool({
    user: DATABASE_USER,
    host: DATABASE_HOST,
    database: DATABASE_NAME,
    password: DATABASE_PASSWORD,
    port: DATABASE_PORT
});

const app = express();

app.get('/', async (req, res) => {
    const queryString = 'select * from tasks;';
    const { rows } = await pool.query(queryString)
    res.json(rows)
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started in port ${PORT}...`));