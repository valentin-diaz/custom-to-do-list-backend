const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { pool } = require('./db_config.js')

const app = express();

console.log(`APP corriendo en ${process.env.NODE_ENV}`)

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/tasks', require('./routes/tasks'))

app.get('/categories', async (req, res) => {
    res.json([
        'Literatura',
        'Videojuegos',
        'Cine',
        'Carrera',
        'Música',
        'Fitness',
        'Historia',
        'Navi',
        'Cotidiano'
    ])
})

app.get('/dashboard', async (req, res) => {
    const queryString = 'select category, sum(reported_hours) from tasks where is_complete = true group by category';
    const { rows } = await pool.query(queryString);
    res.json({
        timePerCategory: rows,
    })
})

app.get('/test-db', async (req, res) => {
    const queryString = 'select * from prueba;'
    const { rows } = await pool.query(queryString);
    res.json(rows)
})

app.get('/test-nodb', async (req, res) => {
    res.send('La API funciona')
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started in port ${PORT}...`));