const sql = require('mysql2');
require('dotenv').config();

const userDB = sql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

userDB.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('Connected to the MySQL database.');
});

module.exports = userDB;