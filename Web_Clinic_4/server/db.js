const mysql = require('mysql2');

require('dotenv').config()

const pool = mysql.createPool({
    host: process.env.ENV_DB_HOST,
    user: process.env.ENV_DB_USER,
    password: process.env.ENV_DB_PASS,
    database: process.env.ENV_DB_TABLE,
    waitForConnections: true
  });

module.exports = pool;