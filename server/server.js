const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 创建数据库连接池
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

// 测试数据库连接
async function testConnection() {
  try {
    const connection = await pool.getConnection()
    console.log('数据库连接成功!')
    connection.release()
  } catch (error) {
    console.error('数据库连接失败:', error.message)
    process.exit(1)
  }
}

// 登录接口
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password, loginType } = req.body
    
    let user = null
    if (loginType === 'admin') {
      const [rows] = await pool.query('SELECT * FROM admins WHERE username = ? AND password = ?', [username, password])
      user = rows[0]
    } else if (loginType === 'teacher') {
      const [rows] = await pool.query('SELECT * FROM teachers WHERE teacher_id = ?', [username])
      user = rows[0]
    } else if (loginType === 'student') {
      const [rows] = await pool.query('SELECT * FROM students WHERE student_id = ?', [username])
      user = rows[0]
    }
    
    if (user) {
      const token = `token_${Date.now()}_${username}`
      res.json({
        success: true,
        data: {
          id: user.id,
          username: username,
          realname: user.name || user.realname,
          type: loginType,
          token: token
        },
        message: '登录成功'
      })
    } else {
      res.json({ success: false, message: '用户名或密码错误' })
    }
  } catch (error) {
    console.error('登录失败:', error)
    res.status(500).json({ success: false, message: '服务器错误' })
  }
})

// 获取当前用户信息
app.get('/api/auth/current', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ success: false, message: '未登录' })
  }
  
  const username = token.split('_')[2]
  res.json({
    success: true,
    data: {
      id: 1,
      username: username,
      realname: username === 'admin' ? '系统管理员' : username,
      type: username === 'admin' ? 'admin' : username.startsWith('T') ? 'teacher' : 'student'
    }
  })
})

// 统计数据接口
app.get('/api/stats/dashboard', async (req, res) => {
  try {
    console.log('收到统计请求...')
    
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
    console.error('统计接口错误:', error)
    res.status(500).json({ success: false, message: '服务器错误' })
  }
})

// 告警列表接口
app.get('/api/alerts', async (req, res) => {
  try {
    console.log('收到告警请求...')
    const [rows] = await pool.query('SELECT * FROM alerts ORDER BY created_at DESC LIMIT 10')
    const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM alerts')
    console.log('告警数据:', rows.length, '条')
    res.json({ success: true, data: rows, total })
  } catch (error) {
    console.error('告警接口错误:', error)
    res.status(500).json({ success: false, message: '服务器错误' })
  }
})

// 告警统计接口
app.get('/api/alerts/stats', async (req, res) => {
  try {
    console.log('收到告警统计请求...')
    const [critical] = await pool.query('SELECT COUNT(*) as count FROM alerts WHERE level = "serious"')
    const [warning] = await pool.query('SELECT COUNT(*) as count FROM alerts WHERE level = "warning"')
    const [info] = await pool.query('SELECT COUNT(*) as count FROM alerts WHERE level = "info"')
    const [resolved] = await pool.query('SELECT COUNT(*) as count FROM alerts WHERE status = "handled"')
    
    res.json({
      success: true,
      data: {
        critical: parseInt(critical[0]?.count) || 0,
        warning: parseInt(warning[0]?.count) || 0,
        info: parseInt(info[0]?.count) || 0,
        resolved: parseInt(resolved[0]?.count) || 0
      }
    })
  } catch (error) {
    console.error('告警统计接口错误:', error)
    res.status(500).json({ success: false, message: '服务器错误' })
  }
})

// 处理告警接口
app.put('/api/alerts/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    await pool.query('UPDATE alerts SET status = ? WHERE id = ?', [status, id])
    res.json({ success: true, message: '操作成功' })
  } catch (error) {
    console.error('处理告警错误:', error)
    res.status(500).json({ success: false, message: '服务器错误' })
  }
})

// 通行记录接口
app.get('/api/stats/recent-records', async (req, res) => {
  try {
    console.log('收到通行记录请求...')
    const [rows] = await pool.query('SELECT * FROM access_records ORDER BY access_time DESC LIMIT 10')
    console.log('通行记录:', rows.length, '条')
    res.json({ success: true, data: rows })
  } catch (error) {
    console.error('通行记录接口错误:', error)
    res.status(500).json({ success: false, message: '服务器错误' })
  }
})

// 门禁点接口
app.get('/api/access/points', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM access_points ORDER BY id')
    res.json({ success: true, data: rows })
  } catch (error) {
    console.error('门禁点接口错误:', error)
    res.status(500).json({ success: false, message: '服务器错误' })
  }
})

// 门禁记录接口
app.get('/api/access/records', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM access_records ORDER BY access_time DESC LIMIT 20')
    res.json({ success: true, data: rows })
  } catch (error) {
    console.error('门禁记录接口错误:', error)
    res.status(500).json({ success: false, message: '服务器错误' })
  }
})

// 访客接口
app.get('/api/visitors', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM visitors ORDER BY visit_time DESC')
    res.json({ success: true, data: rows })
  } catch (error) {
    console.error('访客接口错误:', error)
    res.status(500).json({ success: false, message: '服务器错误' })
  }
})

// 人员接口
app.get('/api/personnel', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM personnel ORDER BY id')
    res.json({ success: true, data: rows })
  } catch (error) {
    console.error('人员接口错误:', error)
    res.status(500).json({ success: false, message: '服务器错误' })
  }
})

// 门禁点CRUD
app.post('/api/access/points', async (req, res) => {
  try {
    const { name, location, type, status } = req.body
    const [result] = await pool.query(
      'INSERT INTO access_points (name, location, type, status) VALUES (?, ?, ?, ?)',
      [name, location, type || 'gate', status || 'normal']
    )
    const [rows] = await pool.query('SELECT * FROM access_points WHERE id = ?', [result.insertId])
    res.json({ success: true, data: rows[0] })
  } catch (error) {
    console.error('添加门禁点错误:', error)
    res.status(500).json({ success: false, message: '服务器错误' })
  }
})

app.put('/api/access/points/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, location, type, status } = req.body
    await pool.query(
      'UPDATE access_points SET name = ?, location = ?, type = ?, status = ? WHERE id = ?',
      [name, location, type, status, id]
    )
    const [rows] = await pool.query('SELECT * FROM access_points WHERE id = ?', [id])
    res.json({ success: true, data: rows[0] })
  } catch (error) {
    console.error('更新门禁点错误:', error)
    res.status(500).json({ success: false, message: '服务器错误' })
  }
})

app.delete('/api/access/points/:id', async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM access_points WHERE id = ?', [id])
    res.json({ success: true, message: '删除成功' })
  } catch (error) {
    console.error('删除门禁点错误:', error)
    res.status(500).json({ success: false, message: '服务器错误' })
  }
})

// 监听错误
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error)
})

process.on('unhandledRejection', (error) => {
  console.error('未处理的Promise拒绝:', error)
})

// 启动服务器
testConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`\n========================================`)
    console.log(`  校园安全管理系统后端服务已启动`)
    console.log(`  端口: http://localhost:${PORT}`)
    console.log(`========================================`)
    console.log(`\n可用API:`)
    console.log(`  POST  /api/auth/login          - 登录`)
    console.log(`  GET   /api/auth/current         - 获取当前用户`)
    console.log(`  GET   /api/stats/dashboard      - 统计数据`)
    console.log(`  GET   /api/alerts               - 告警列表`)
    console.log(`  GET   /api/alerts/stats         - 告警统计`)
    console.log(`  PUT   /api/alerts/:id           - 更新告警`)
    console.log(`  GET   /api/stats/recent-records - 通行记录`)
    console.log(`  GET   /api/access/points        - 门禁点列表`)
    console.log(`  POST  /api/access/points        - 添加门禁点`)
    console.log(`  PUT   /api/access/points/:id    - 更新门禁点`)
    console.log(`  DELETE /api/access/points/:id   - 删除门禁点`)
    console.log(`  GET   /api/access/records       - 门禁记录`)
    console.log(`  GET   /api/visitors             - 访客列表`)
    console.log(`  GET   /api/personnel            - 人员列表`)
    console.log(`\n等待请求...\n`)
  })
})
