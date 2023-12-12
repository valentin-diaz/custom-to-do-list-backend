const express = require('express');
require('dotenv').config();

const app = express();

app.get('/', (req, res) => {
    res.send('Hello world!')
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started in port ${PORT}...`));