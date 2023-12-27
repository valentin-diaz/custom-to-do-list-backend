const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { pool } = require('./db_config.js')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get('/tasks', async (req, res) => {
    console.log('GET TASKS')
    const date = req.query.date;

    if (date) {
        const queryString = 'select * from tasks where createdAt::date = $1  order by createdAt';
        const { rows } = await pool.query(queryString, [date]);
        return res.json(rows);

    } else {
        const queryString = 'select * from tasks order by createdAt;';
        const { rows } = await pool.query(queryString);
        return res.json(rows);
    }
});

app.post('/task', async (req, res) => {
    // Validar el body
    console.log('POST TASK')
    if (!req.body.title || !req.body.category) {
        return res.status(400).send('title y category son requeridos')
    }

    const queryString = 'insert into tasks (title, category) values ($1, $2)';
    await pool.query(queryString, [req.body.title, req.body.category])
    res.send('Tarea creada');
});

app.put('/tasks/:id/complete', async (req, res) => {
    const taskId = parseInt(req.params.id)

    const queryString = 'update tasks set is_complete = true where id = $1';
    await pool.query(queryString, [taskId]);
    res.send('Tarea actualizada')
})

app.put('/tasks/:id/uncomplete', async (req, res) => {
    const taskId = parseInt(req.params.id)

    const queryString = 'update tasks set is_complete = false where id = $1';
    await pool.query(queryString, [taskId]);
    res.send('Tarea actualizada')
})

app.put('/tasks/:id/report', async (req, res) => {
    const taskId = parseInt(req.params.id)
    const reportedHours = req.body.reportedHours;

    const queryString = 'update tasks set reported_hours = $1 where id = $2';
    await pool.query(queryString, [reportedHours, taskId]);
    res.send('Tarea actualizada')
})

app.delete('/tasks/:id', async (req, res) => {
    const taskId = parseInt(req.params.id);

    const queryString = 'delete from tasks where id = $1';
    await pool.query(queryString, [taskId]);
    res.send('Tarea eliminada')
})

app.get('/categories', async (req, res) => {
    res.json([
        'Literatura',
        'Videojuegos',
        'Cine',
        'Carrera',
        'Fitness',
        'Historia',
        'Navi',
        'Cotidiano'
    ])
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started in port ${PORT}...`));