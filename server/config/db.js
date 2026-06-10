const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '1314520xh',
  database: 'campus_guard',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
})

module.exports = pool
