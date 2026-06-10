const express = require('express')
const cors = require('cors')
const mysql = require('mysql2/promise')

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Mock数据
const mockData = {
  accessRecords: [
    { id: 1, person_name: '张三', person_number: '2021001', person_type: 'student', access_point_id: 1, access_point_name: '正门门禁', access_time: '2024-01-15 08:00:00', access_type: 'in', result: 'success', reason: '' },
    { id: 2, person_name: '李四', person_number: '2021002', person_type: 'student', access_point_id: 2, access_point_name: '教学楼A门禁', access_time: '2024-01-15 08:15:00', access_type: 'in', result: 'success', reason: '' },
    { id: 3, person_name: '张教授', person_number: 'T001', person_type: 'teacher', access_point_id: 2, access_point_name: '教学楼A门禁', access_time: '2024-01-15 08:30:00', access_type: 'in', result: 'success', reason: '' },
    { id: 4, person_name: '王五', person_number: '2021003', person_type: 'student', access_point_id: 1, access_point_name: '正门门禁', access_time: '2024-01-15 09:00:00', access_type: 'in', result: 'success', reason: '' },
    { id: 5, person_name: '张三', person_number: '2021001', person_type: 'student', access_point_id: 1, access_point_name: '正门门禁', access_time: '2024-01-15 12:00:00', access_type: 'out', result: 'success', reason: '' },
    { id: 6, person_name: '李四', person_number: '2021002', person_type: 'student', access_point_id: 3, access_point_name: '宿舍楼1门禁', access_time: '2024-01-15 12:30:00', access_type: 'out', result: 'success', reason: '' },
    { id: 7, person_name: '赵六', person_number: '2022001', person_type: 'student', access_point_id: 4, access_point_name: '图书馆门禁', access_time: '2024-01-15 14:00:00', access_type: 'in', result: 'success', reason: '' },
    { id: 8, person_name: '钱七', person_number: '2022002', person_type: 'student', access_point_id: 4, access_point_name: '图书馆门禁', access_time: '2024-01-15 14:10:00', access_type: 'in', result: 'success', reason: '' },
    { id: 9, person_name: '李老师', person_number: 'T002', person_type: 'teacher', access_point_id: 2, access_point_name: '教学楼A门禁', access_time: '2024-01-15 15:00:00', access_type: 'in', result: 'success', reason: '' },
    { id: 10, person_name: '张三', person_number: '2021001', person_type: 'student', access_point_id: 3, access_point_name: '宿舍楼1门禁', access_time: '2024-01-15 18:00:00', access_type: 'in', result: 'success', reason: '' }
  ],
  personnel: [
    { id: 1, name: '张三', number: '2021001', type: 'student', department: '计算机学院', class_name: '2021级计算机1班', phone: '13900139001', email: 'zhangsan@campus.cn', id_card: '320100200001011234', status: 'active' },
    { id: 2, name: '李四', number: '2021002', type: 'student', department: '计算机学院', class_name: '2021级计算机1班', phone: '13900139002', email: 'lisi@campus.cn', id_card: '320100200002022345', status: 'active' },
    { id: 3, name: '王五', number: '2021003', type: 'student', department: '计算机学院', class_name: '2021级计算机2班', phone: '13900139003', email: 'wangwu@campus.cn', id_card: '320100200003033456', status: 'active' },
    { id: 4, name: '赵六', number: '2022001', type: 'student', department: '电子工程学院', class_name: '2022级电子1班', phone: '13900139004', email: 'zhaoliu@campus.cn', id_card: '320100200101014567', status: 'active' },
    { id: 5, name: '钱七', number: '2022002', type: 'student', department: '管理学院', class_name: '2022级管理1班', phone: '13900139005', email: 'qianqi@campus.cn', id_card: '320100200102025678', status: 'active' },
    { id: 6, name: '张教授', number: 'T001', type: 'teacher', department: '计算机学院', class_name: '', phone: '13900139010', email: 'zhangprof@campus.cn', id_card: '320100197508123456', status: 'active' },
    { id: 7, name: '李老师', number: 'T002', type: 'teacher', department: '计算机学院', class_name: '', phone: '13900139011', email: 'liteacher@campus.cn', id_card: '320100198011204567', status: 'active' },
    { id: 8, name: '王老师', number: 'T003', type: 'teacher', department: '电子工程学院', class_name: '', phone: '13900139012', email: 'wangteacher@campus.cn', id_card: '320100198205155678', status: 'active' },
    { id: 9, name: '管理员', number: 'admin', type: 'admin', department: '信息中心', class_name: '', phone: '13800138000', email: 'admin@campus.cn', id_card: '320100197001011111', status: 'active' }
  ],
  visitors: [
    { id: 1, name: '刘访客', id_card: '320100199001011234', phone: '13900139020', company: 'XX科技公司', purpose: '拜访同学', host_name: '张三', host_dept: '计算机学院', visit_time: '2024-01-15 10:00:00', leave_time: '2024-01-15 12:00:00', access_area: '宿舍楼', status: 'completed' },
    { id: 2, name: '陈访客', id_card: '320200198505156789', phone: '13900139021', company: 'XX研究所', purpose: '学术交流', host_name: '张教授', host_dept: '计算机学院', visit_time: '2024-01-15 09:00:00', leave_time: '2024-01-15 11:30:00', access_area: '教学楼', status: 'completed' },
    { id: 3, name: '周访客', id_card: '310100199208204567', phone: '13900139022', company: 'XX企业', purpose: '项目洽谈', host_name: '李老师', host_dept: '电子工程学院', visit_time: '2024-01-16 14:00:00', leave_time: null, access_area: '教学楼', status: 'visiting' }
  ],
  alerts: [
    { id: 1, title: '南门-尾随告警', content: '检测到尾随行为，已自动锁定门禁', type: 'access', level: 'warning', location: '南门', status: 'pending', handle_time: null, handle_result: null, created_at: '2024-01-15 09:00:00', updated_at: '2024-01-15 09:00:00' },
    { id: 2, title: '宿舍楼1-门长时间未关闭', content: '门已保持打开超过10分钟', type: 'access', level: 'serious', location: '宿舍楼1', status: 'pending', handle_time: null, handle_result: null, created_at: '2024-01-15 09:10:00', updated_at: '2024-01-15 09:10:00' },
    { id: 3, title: '教学楼A-权限异常', content: '检测到异常刷卡行为', type: 'access', level: 'warning', location: '教学楼A', status: 'pending', handle_time: null, handle_result: null, created_at: '2024-01-15 09:20:00', updated_at: '2024-01-15 09:20:00' },
    { id: 4, title: '东门-设备离线', content: '设备通信中断，请检查网络', type: 'device', level: 'info', location: '东门', status: 'pending', handle_time: null, handle_result: null, created_at: '2024-01-15 09:30:00', updated_at: '2024-01-15 09:30:00' },
    { id: 5, title: '图书馆-非法闯入', content: '检测到未授权人员试图进入', type: 'access', level: 'serious', location: '图书馆', status: 'handled', handle_time: '2024-01-15 09:15:00', handle_result: '已通知安保人员处理', created_at: '2024-01-15 09:15:00', updated_at: '2024-01-15 09:15:00' }
  ],
  accessPoints: [
    { id: 1, name: '正门门禁', location: '学校正门', type: 'gate', status: 'normal', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' },
    { id: 2, name: '教学楼A门禁', location: '教学楼A栋', type: 'building', status: 'normal', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' },
    { id: 3, name: '宿舍楼1门禁', location: '学生宿舍楼1栋', type: 'dormitory', status: 'normal', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' },
    { id: 4, name: '图书馆门禁', location: '图书馆正门', type: 'library', status: 'normal', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' },
    { id: 5, name: '体育馆门禁', location: '体育馆东门', type: 'gym', status: 'offline', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' }
  ],
  cameras: [
    { id: 1, name: '正门摄像头', location: '正门上方', status: 'online', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' },
    { id: 2, name: '教学楼A摄像头', location: '教学楼A大厅', status: 'online', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' },
    { id: 3, name: '宿舍楼1摄像头', location: '宿舍楼1入口', status: 'online', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' },
    { id: 4, name: '图书馆摄像头', location: '图书馆正门', status: 'offline', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' },
    { id: 5, name: '体育馆摄像头', location: '体育馆东门', status: 'online', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' }
  ],
  admins: [
    { id: 1, username: 'admin', password: 'admin123', realname: '系统管理员', phone: '13800138000', email: 'admin@campus.cn', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' },
    { id: 2, username: 'admin2', password: 'admin123', realname: '安全管理员', phone: '13800138001', email: 'admin2@campus.cn', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' }
  ],
  teachers: [
    { id: 1, teacher_id: 'T001', name: '张教授', title: '教授', department: '计算机学院', phone: '13900139010', email: 'zhangprof@campus.cn', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' },
    { id: 2, teacher_id: 'T002', name: '李老师', title: '副教授', department: '计算机学院', phone: '13900139011', email: 'liteacher@campus.cn', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' },
    { id: 3, teacher_id: 'T003', name: '王老师', title: '讲师', department: '电子工程学院', phone: '13900139012', email: 'wangteacher@campus.cn', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' }
  ],
  students: [
    { id: 1, student_id: '2021001', name: '张三', class_name: '2021级计算机1班', department: '计算机学院', phone: '13900139001', email: 'zhangsan@campus.cn', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' },
    { id: 2, student_id: '2021002', name: '李四', class_name: '2021级计算机1班', department: '计算机学院', phone: '13900139002', email: 'lisi@campus.cn', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' },
    { id: 3, student_id: '2021003', name: '王五', class_name: '2021级计算机2班', department: '计算机学院', phone: '13900139003', email: 'wangwu@campus.cn', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' },
    { id: 4, student_id: '2022001', name: '赵六', class_name: '2022级电子1班', department: '电子工程学院', phone: '13900139004', email: 'zhaoliu@campus.cn', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' },
    { id: 5, student_id: '2022002', name: '钱七', class_name: '2022级管理1班', department: '管理学院', phone: '13900139005', email: 'qianqi@campus.cn', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' }
  ]
}

let pool = null
let useMockData = true

// 尝试连接数据库
async function tryConnect() {
  try {
    pool = mysql.createPool({
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '1314520xh',
      database: 'campus_guard',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 5000
    })
    const connection = await pool.getConnection()
    console.log('数据库连接成功!')
    connection.release()
    useMockData = false
  } catch (error) {
    console.log('数据库连接失败，使用Mock数据:', error.message)
    useMockData = true
  }
}

// 登录接口
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password, loginType } = req.body
    
    let user = null
    if (loginType === 'admin') {
      if (useMockData) {
        user = mockData.admins.find(u => u.username === username && u.password === password)
      } else {
        const [rows] = await pool.query('SELECT * FROM admins WHERE username = ? AND password = ?', [username, password])
        user = rows[0]
      }
    } else if (loginType === 'teacher') {
      if (useMockData) {
        user = mockData.teachers.find(u => u.teacher_id === username)
      } else {
        const [rows] = await pool.query('SELECT * FROM teachers WHERE teacher_id = ?', [username])
        user = rows[0]
      }
    } else if (loginType === 'student') {
      if (useMockData) {
        user = mockData.students.find(u => u.student_id === username)
      } else {
        const [rows] = await pool.query('SELECT * FROM students WHERE student_id = ?', [username])
        user = rows[0]
      }
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
    
    let stats = {}
    if (useMockData) {
      stats = {
        todayAccess: mockData.accessRecords.length,
        totalPersonnel: mockData.personnel.length,
        todayVisitors: mockData.visitors.length,
        pendingAlertsCount: mockData.alerts.filter(a => a.status === 'pending').length
      }
    } else {
      const [accessResult] = await pool.query('SELECT COUNT(*) as totalAccess FROM access_records')
      const [personnelResult] = await pool.query('SELECT COUNT(*) as totalPersonnel FROM personnel')
      const [visitorsResult] = await pool.query('SELECT COUNT(*) as totalVisitors FROM visitors')
      const [alertsResult] = await pool.query('SELECT COUNT(*) as pendingAlerts FROM alerts WHERE status = "pending"')
      
      stats = {
        todayAccess: parseInt(accessResult[0]?.totalAccess) || 0,
        totalPersonnel: parseInt(personnelResult[0]?.totalPersonnel) || 0,
        todayVisitors: parseInt(visitorsResult[0]?.totalVisitors) || 0,
        pendingAlertsCount: parseInt(alertsResult[0]?.pendingAlerts) || 0
      }
    }
    
    console.log('统计结果:', stats)
    res.json({ success: true, data: stats })
  } catch (error) {
    console.error('统计接口错误:', error)
    res.status(500).json({ success: false, message: '服务器错误' })
  }
})

// 告警列表接口
app.get('/api/alerts', async (req, res) => {
  try {
    console.log('收到告警请求...')
    
    let data = []
    let total = 0
    
    if (useMockData) {
      data = mockData.alerts.slice(0, 10)
      total = mockData.alerts.length
    } else {
      const [rows] = await pool.query('SELECT * FROM alerts ORDER BY created_at DESC LIMIT 10')
      const [[{ total: dbTotal }]] = await pool.query('SELECT COUNT(*) as total FROM alerts')
      data = rows
      total = dbTotal
    }
    
    console.log('告警数据:', data.length, '条')
    res.json({ success: true, data, total })
  } catch (error) {
    console.error('告警接口错误:', error)
    res.status(500).json({ success: false, message: '服务器错误' })
  }
})

// 告警统计接口
app.get('/api/alerts/stats', async (req, res) => {
  try {
    console.log('收到告警统计请求...')
    
    let stats = {}
    if (useMockData) {
      stats = {
        critical: mockData.alerts.filter(a => a.level === 'serious').length,
        warning: mockData.alerts.filter(a => a.level === 'warning').length,
        info: mockData.alerts.filter(a => a.level === 'info').length,
        resolved: mockData.alerts.filter(a => a.status === 'handled').length
      }
    } else {
      const [critical] = await pool.query('SELECT COUNT(*) as count FROM alerts WHERE level = "serious"')
      const [warning] = await pool.query('SELECT COUNT(*) as count FROM alerts WHERE level = "warning"')
      const [info] = await pool.query('SELECT COUNT(*) as count FROM alerts WHERE level = "info"')
      const [resolved] = await pool.query('SELECT COUNT(*) as count FROM alerts WHERE status = "handled"')
      
      stats = {
        critical: parseInt(critical[0]?.count) || 0,
        warning: parseInt(warning[0]?.count) || 0,
        info: parseInt(info[0]?.count) || 0,
        resolved: parseInt(resolved[0]?.count) || 0
      }
    }
    
    res.json({ success: true, data: stats })
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
    
    if (useMockData) {
      const alert = mockData.alerts.find(a => a.id === parseInt(id))
      if (alert) {
        alert.status = status
      }
    } else {
      await pool.query('UPDATE alerts SET status = ? WHERE id = ?', [status, id])
    }
    
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
    
    let data = []
    if (useMockData) {
      data = mockData.accessRecords.slice(0, 10)
    } else {
      const [rows] = await pool.query('SELECT * FROM access_records ORDER BY access_time DESC LIMIT 10')
      data = rows
    }
    
    console.log('通行记录:', data.length, '条')
    res.json({ success: true, data })
  } catch (error) {
    console.error('通行记录接口错误:', error)
    res.status(500).json({ success: false, message: '服务器错误' })
  }
})

// 门禁点接口
app.get('/api/access/points', async (req, res) => {
  try {
    let data = []
    if (useMockData) {
      data = mockData.accessPoints
    } else {
      const [rows] = await pool.query('SELECT * FROM access_points ORDER BY id')
      data = rows
    }
    res.json({ success: true, data })
  } catch (error) {
    console.error('门禁点接口错误:', error)
    res.status(500).json({ success: false, message: '服务器错误' })
  }
})

// 门禁记录接口
app.get('/api/access/records', async (req, res) => {
  try {
    let data = []
    if (useMockData) {
      data = mockData.accessRecords.slice(0, 20)
    } else {
      const [rows] = await pool.query('SELECT * FROM access_records ORDER BY access_time DESC LIMIT 20')
      data = rows
    }
    res.json({ success: true, data })
  } catch (error) {
    console.error('门禁记录接口错误:', error)
    res.status(500).json({ success: false, message: '服务器错误' })
  }
})

// 访客接口
app.get('/api/visitors', async (req, res) => {
  try {
    let data = []
    if (useMockData) {
      data = mockData.visitors
    } else {
      const [rows] = await pool.query('SELECT * FROM visitors ORDER BY visit_time DESC')
      data = rows
    }
    res.json({ success: true, data })
  } catch (error) {
    console.error('访客接口错误:', error)
    res.status(500).json({ success: false, message: '服务器错误' })
  }
})

// 人员接口
app.get('/api/personnel', async (req, res) => {
  try {
    let data = []
    if (useMockData) {
      data = mockData.personnel
    } else {
      const [rows] = await pool.query('SELECT * FROM personnel ORDER BY id')
      data = rows
    }
    res.json({ success: true, data })
  } catch (error) {
    console.error('人员接口错误:', error)
    res.status(500).json({ success: false, message: '服务器错误' })
  }
})

// 门禁点CRUD
app.post('/api/access/points', async (req, res) => {
  try {
    const { name, location, type, status } = req.body
    const newPoint = {
      id: mockData.accessPoints.length + 1,
      name,
      location,
      type: type || 'gate',
      status: status || 'normal',
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
    mockData.accessPoints.push(newPoint)
    res.json({ success: true, data: newPoint })
  } catch (error) {
    console.error('添加门禁点错误:', error)
    res.status(500).json({ success: false, message: '服务器错误' })
  }
})

app.put('/api/access/points/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, location, type, status } = req.body
    const index = mockData.accessPoints.findIndex(p => p.id === parseInt(id))
    if (index !== -1) {
      mockData.accessPoints[index] = {
        ...mockData.accessPoints[index],
        name,
        location,
        type,
        status,
        updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }
      res.json({ success: true, data: mockData.accessPoints[index] })
    } else {
      res.status(404).json({ success: false, message: '门禁点不存在' })
    }
  } catch (error) {
    console.error('更新门禁点错误:', error)
    res.status(500).json({ success: false, message: '服务器错误' })
  }
})

app.delete('/api/access/points/:id', async (req, res) => {
  try {
    const { id } = req.params
    const index = mockData.accessPoints.findIndex(p => p.id === parseInt(id))
    if (index !== -1) {
      mockData.accessPoints.splice(index, 1)
      res.json({ success: true, message: '删除成功' })
    } else {
      res.status(404).json({ success: false, message: '门禁点不存在' })
    }
  } catch (error) {
    console.error('删除门禁点错误:', error)
    res.status(500).json({ success: false, message: '服务器错误' })
  }
})

// 摄像头接口
app.get('/api/cameras', async (req, res) => {
  try {
    let data = []
    if (useMockData) {
      data = mockData.cameras
    } else {
      const [rows] = await pool.query('SELECT * FROM cameras ORDER BY id')
      data = rows
    }
    res.json({ success: true, data })
  } catch (error) {
    console.error('摄像头接口错误:', error)
    res.status(500).json({ success: false, message: '服务器错误' })
  }
})

// 启动服务器
tryConnect().then(() => {
  app.listen(PORT, () => {
    console.log(`\n========================================`)
    console.log(`  校园安全管理系统后端服务已启动`)
    console.log(`  端口: http://localhost:${PORT}`)
    console.log(`  数据源: ${useMockData ? 'Mock数据' : '数据库'}`)
    console.log(`========================================`)
    console.log(`\n等待请求...\n`)
  })
})
