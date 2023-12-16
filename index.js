const express = require('express');
require('dotenv').config();

const { pool } = require('./db_config.js')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/tasks', async (req, res) => {
    const queryString = 'select * from tasks;';
    const { rows } = await pool.query(queryString)
    res.json(rows)
});

app.post('/task', async (req, res) => {
    // Validar el body
    if (!req.body.title || !req.body.category) {
        return res.status(400).send('title y category son requeridos')
    }

    const queryString = 'insert into tasks (title, category) values ($1, $2)';
    await pool.query(queryString, [req.body.title, req.body.category])
    res.send('Tarea creada');
});

app.put('/tasks/:id/complete', async (req, res) => {
    console.log(req.params)
    const taskId = parseInt(req.params.id)
    console.log(taskId)

    const queryString = 'update tasks set is_complete = true where id = $1';
    await pool.query(queryString, [taskId]);
    res.send('Tarea actualizada')
})

app.put('/tasks/:id/uncomplete', async (req, res) => {
    console.log(req.params)
    const taskId = parseInt(req.params.id)
    console.log(taskId)

    const queryString = 'update tasks set is_complete = false where id = $1';
    await pool.query(queryString, [taskId]);
    res.send('Tarea actualizada')
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started in port ${PORT}...`));