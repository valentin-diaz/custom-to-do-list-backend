const express = require('express');
const router = express.Router();

const { pool } = require('../db_config');

router.get('/', async (req, res) => {
    const queryString = 'select category, sum(reported_hours) from tasks where is_complete = true group by category';
    const { rows } = await pool.query(queryString);
    res.json({
        timePerCategory: rows,
    })
})


module.exports = router;