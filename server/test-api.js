// 测试API脚本
const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())

// 创建数据库连接
const pool = mysql.createPool({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '1314520xh',
  database: 'campus_guard',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

// 测试统计接口
app.get('/api/stats/dashboard', async (req, res) => {
  try {
    console.log('收到统计请求')
    const [accessResult] = await pool.query('SELECT COUNT(*) as totalAccess FROM access_records')
    const [personnelResult] = await pool.query('SELECT COUNT(*) as totalPersonnel FROM personnel')
    const [visitorsResult] = await pool.query('SELECT COUNT(*) as totalVisitors FROM visitors')
    const [alertsResult] = await pool.query('SELECT COUNT(*) as pendingAlerts FROM alerts WHERE status = "pending"')
    
    const result = {
      todayAccess: parseInt(accessResult[0]?.totalAccess) || 0,
      totalPersonnel: parseInt(personnelResult[0]?.totalPersonnel) || 0,
      todayVisitors: parseInt(visitorsResult[0]?.totalVisitors) || 0,
      pendingAlertsCount: parseInt(alertsResult[0]?.pendingAlerts) || 0
    }
    
    console.log('统计结果:', result)
    res.json({ success: true, data: result })
  } catch (error) {
    console.error('数据库错误:', error)
    res.status(500).json({ success: false, message: '数据库错误' })
  }
})

// 测试告警接口
app.get('/api/alerts', async (req, res) => {
  try {
    console.log('收到告警请求')
    const [rows] = await pool.query('SELECT * FROM alerts ORDER BY created_at DESC LIMIT 10')
    const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM alerts')
    console.log('告警数据:', rows.length, '条')
    res.json({ success: true, data: rows, total })
  } catch (error) {
    console.error('数据库错误:', error)
    res.status(500).json({ success: false, message: '数据库错误' })
  }
})

// 测试通行记录接口
app.get('/api/stats/recent-records', async (req, res) => {
  try {
    console.log('收到通行记录请求')
    const [rows] = await pool.query('SELECT * FROM access_records ORDER BY access_time DESC LIMIT 10')
    console.log('通行记录:', rows.length, '条')
    res.json({ success: true, data: rows })
  } catch (error) {
    console.error('数据库错误:', error)
    res.status(500).json({ success: false, message: '数据库错误' })
  }
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`测试服务器已启动: http://localhost:${PORT}`)
  console.log('测试API:')
  console.log('  GET /api/stats/dashboard')
  console.log('  GET /api/alerts')
  console.log('  GET /api/stats/recent-records')
})
