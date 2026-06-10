const mysql = require('mysql2/promise')

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '1314520xh',
  database: 'campus_guard',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000,
  socketPath: '\\\\.\\pipe\\MySQL80'
})

async function test() {
  try {
    const [rows] = await pool.query('SELECT status, COUNT(*) as count FROM alerts GROUP BY status')
    console.log('告警状态分布:')
    rows.forEach(row => {
      console.log(`  status: "${row.status}", count: ${row.count}`)
    })
    
    const [allAlerts] = await pool.query('SELECT id, title, status FROM alerts')
    console.log('\n所有告警记录:')
    allAlerts.forEach(row => {
      console.log(`  id: ${row.id}, title: "${row.title}", status: "${row.status}"`)
    })
  } catch (error) {
    console.error('查询错误:', error)
  } finally {
    process.exit(0)
  }
}

test()
