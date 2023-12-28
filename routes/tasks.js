const express = require('express');
const router = express.Router();

const { pool } = require('../db_config')

router.get('/', async (req, res) => {
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

router.post('/', async (req, res) => {
    // Validar el body
    console.log('POST TASK')
    if (!req.body.title || !req.body.category) {
        return res.status(400).send('title y category son requeridos')
    }

    const queryString = 'insert into tasks (title, category) values ($1, $2)';
    await pool.query(queryString, [req.body.title, req.body.category])
    res.send('Tarea creada');
});

router.put('/:id/complete', async (req, res) => {
    const taskId = parseInt(req.params.id)

    const queryString = 'update tasks set is_complete = true where id = $1';
    await pool.query(queryString, [taskId]);
    res.send('Tarea actualizada')
})

router.put('/:id/uncomplete', async (req, res) => {
    const taskId = parseInt(req.params.id)

    const queryString = 'update tasks set is_complete = false where id = $1';
    await pool.query(queryString, [taskId]);
    res.send('Tarea actualizada')
})

router.put('/:id/report', async (req, res) => {
    const taskId = parseInt(req.params.id)
    const reportedHours = req.body.reportedHours;

    const queryString = 'update tasks set reported_hours = $1 where id = $2';
    await pool.query(queryString, [reportedHours, taskId]);
    res.send('Tarea actualizada')
})

router.delete('/:id', async (req, res) => {
    const taskId = parseInt(req.params.id);

    const queryString = 'delete from tasks where id = $1';
    await pool.query(queryString, [taskId]);
    res.send('Tarea eliminada')
})

module.exports = router;