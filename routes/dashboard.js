const express = require('express');
const router = express.Router();

const { pool } = require('../db_config');

router.get('/', async (req, res) => {
    let queryString;
    let rows;
    
    // Gráfico 1: Tiempo por cada categoría
    queryString = 'select category, sum(reported_hours) from tasks where is_complete = true group by category;';
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
    
    
    res.json({  
        timePerCategoryPlot: timePerCategory,
        taskCompletion: {
            completedTasks,
            totalTasks
        }
    })
})


module.exports = router;