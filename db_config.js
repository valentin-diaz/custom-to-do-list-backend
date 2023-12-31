const {Pool} = require('pg');

const DATABASE_USER = process.env.DATABASE_USER;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_PORT = process.env.DATABASE_PORT;
const DATABASE_NAME = process.env.DATABASE_NAME;
const DATABASE_HOST= process.env.DATABASE_HOST;
const DATABASE_LINK = process.env.DATABASE_LINK;

let pool;
if (process.env.NODE_ENV === 'production') {
    console.log('Iniciando base de datos de producción');
    pool = new Pool({
        connectionString: DATABASE_LINK,
        ssl: {
            rejectUnauthorized: false
        }
    });
} else {
    console.log('Iniciando base de datos de desarrollo');
    pool = new Pool({
        user: DATABASE_USER,
        host: DATABASE_HOST,
        database: DATABASE_NAME,
        password: DATABASE_PASSWORD,
        port: DATABASE_PORT
    });
}

module.exports = { pool };