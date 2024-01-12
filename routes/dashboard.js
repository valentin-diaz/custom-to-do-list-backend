const express = require('express');
const router = express.Router();

const { pool } = require('../db_config');

router.get('/', async (req, res) => {
    let queryString;
    let rows;
    
    // Gráfico 1: Tiempo por cada categoría
    queryString = 'select category, sum(reported_hours) from tasks where is_complete = true group by category order by sum(reported_hours) desc;';
    ({ rows: timePerCategory } = await pool.query(queryString));

    // Gráfico 2: Eficiencia de tareas
    // Tareas completadas
    queryString = 'select count(*) from tasks where is_complete = true;';
    ({ rows } = await pool.query(queryString));
    const completedTasks = parseInt(rows[0].count);
    
    // Total de tareas
    queryString = 'select count (*) from tasks;';
    ({ rows } = await pool.query(queryString));
    const totalTasks = parseInt(rows[0].count);

    // Gráfico 3: Categoría con más tareas creadas
    queryString = "select category, count(*) from tasks group by category order by count(*) desc;";
    const { rows: tasksPerCategory } = await pool.query(queryString);

    // Gráfico 4: Porcentaje de días dedicados a Literature en el último mes
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    queryString = 'select createdAt::date, count(*) from tasks where category = \'Música\' and createdAt::date > $1::date - 30  group by createdAt::date order by createdAt::date desc ;';
    const { rows: tasksPerDay } = await pool.query(queryString, [date])
    const daysWithTaskCreated = tasksPerDay.length
    
    
    res.json({  
        timePerCategoryPlot: timePerCategory,
        taskCompletionPlot: {
            completedTasks,
            totalTasks
        },
        tasksPerCategoryPlot: tasksPerCategory,
        daysWithTaskCreatedPlot: {
            dayRange: 30,
            category: 'Música',
            daysWithTaskCreated
        }
    })
})


module.exports = router;