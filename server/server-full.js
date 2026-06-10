const express = require('express')
const cors = require('cors')

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 完整的Mock数据
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
    { id: 2, name: '李四', number: '2021002', person_type: 'student', department: '计算机学院', class_name: '2021级计算机1班', phone: '13900139002', email: 'lisi@campus.cn', id_card: '320100200002022345', status: 'active' },
    { id: 3, name: '王五', number: '2021003', person_type: 'student', department: '计算机学院', class_name: '2021级计算机2班', phone: '13900139003', email: 'wangwu@campus.cn', id_card: '320100200003033456', status: 'active' },
    { id: 4, name: '赵六', number: '2022001', person_type: 'student', department: '电子工程学院', class_name: '2022级电子1班', phone: '13900139004', email: 'zhaoliu@campus.cn', id_card: '320100200101014567', status: 'active' },
    { id: 5, name: '钱七', number: '2022002', person_type: 'student', department: '管理学院', class_name: '2022级管理1班', phone: '13900139005', email: 'qianqi@campus.cn', id_card: '320100200102025678', status: 'active' },
    { id: 6, name: '张教授', number: 'T001', person_type: 'teacher', department: '计算机学院', class_name: '', phone: '13900139010', email: 'zhangprof@campus.cn', id_card: '320100197508123456', status: 'active' },
    { id: 7, name: '李老师', number: 'T002', person_type: 'teacher', department: '计算机学院', class_name: '', phone: '13900139011', email: 'liteacher@campus.cn', id_card: '320100198011204567', status: 'active' },
    { id: 8, name: '王老师', number: 'T003', person_type: 'teacher', department: '电子工程学院', class_name: '', phone: '13900139012', email: 'wangteacher@campus.cn', id_card: '320100198205155678', status: 'active' },
    { id: 9, name: '管理员', number: 'admin', person_type: 'admin', department: '信息中心', class_name: '', phone: '13800138000', email: 'admin@campus.cn', id_card: '320100197001011111', status: 'active' }
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
  ],
  departments: [
    { id: 1, name: '计算机学院', code: 'CS', description: '计算机科学与技术学院', status: 'active', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' },
    { id: 2, name: '电子工程学院', code: 'EE', description: '电子信息工程学院', status: 'active', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' },
    { id: 3, name: '管理学院', code: 'MA', description: '经济管理学院', status: 'active', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' },
    { id: 4, name: '信息中心', code: 'IC', description: '校园信息化管理中心', status: 'active', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' }
  ],
  classes: [
    { id: 1, name: '2021级计算机1班', department_id: 1, grade: '2021', major: '计算机科学与技术', class_no: '1', status: 'active', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' },
    { id: 2, name: '2021级计算机2班', department_id: 1, grade: '2021', major: '计算机科学与技术', class_no: '2', status: 'active', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' },
    { id: 3, name: '2022级电子1班', department_id: 2, grade: '2022', major: '电子信息工程', class_no: '1', status: 'active', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' },
    { id: 4, name: '2022级管理1班', department_id: 3, grade: '2022', major: '工商管理', class_no: '1', status: 'active', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' }
  ],
  dormitories: [
    { id: 1, name: '宿舍楼1栋', building: '1', floor: '1-6', rooms: 60, status: 'normal', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' },
    { id: 2, name: '宿舍楼2栋', building: '2', floor: '1-6', rooms: 60, status: 'normal', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' },
    { id: 3, name: '宿舍楼3栋', building: '3', floor: '1-6', rooms: 60, status: 'normal', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' }
  ],
  patrolRoutes: [
    { id: 1, name: '校园主干道巡逻', description: '沿校园主干道进行日常巡逻', points: '正门,教学楼,图书馆,体育馆,宿舍楼', status: 'active', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' },
    { id: 2, name: '夜间重点区域巡逻', description: '夜间重点区域安全巡逻', points: '宿舍楼,教学楼,图书馆,正门', status: 'active', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' }
  ],
  patrolPlans: [
    { id: 1, name: '日常巡逻计划', route_id: 1, start_time: '08:00', end_time: '18:00', frequency: '2小时', status: 'active', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' },
    { id: 2, name: '夜间巡逻计划', route_id: 2, start_time: '20:00', end_time: '06:00', frequency: '3小时', status: 'active', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' }
  ],
  fireFacilities: [
    { id: 1, name: '教学楼A灭火器', type: '灭火器', location: '教学楼A栋大厅', status: 'normal', last_check: '2024-01-01 00:00:00', next_check: '2024-07-01 00:00:00', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' },
    { id: 2, name: '图书馆消防栓', type: '消防栓', location: '图书馆一层', status: 'normal', last_check: '2024-01-01 00:00:00', next_check: '2024-07-01 00:00:00', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' },
    { id: 3, name: '宿舍楼1消防箱', type: '消防箱', location: '宿舍楼1栋一层', status: 'needs_check', last_check: '2023-12-01 00:00:00', next_check: '2024-06-01 00:00:00', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' }
  ]
}

let currentUser = null
let token = null

// 请求日志
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`)
  next()
})

// ==================== 认证相关接口 ====================
app.post('/api/auth/login', (req, res) => {
  const { username, password, loginType } = req.body
  
  let user = null
  if (loginType === 'admin') {
    user = mockData.admins.find(u => u.username === username && u.password === password)
  } else if (loginType === 'teacher') {
    user = mockData.teachers.find(u => u.teacher_id === username)
  } else if (loginType === 'student') {
    user = mockData.students.find(u => u.student_id === username)
  }
  
  if (user) {
    token = `token_${Date.now()}_${username}`
    currentUser = {
      id: user.id,
      username: username,
      realname: user.realname || user.name,
      type: loginType
    }
    res.json({
      success: true,
      data: { ...currentUser, token },
      message: '登录成功'
    })
  } else {
    res.json({ success: false, message: '用户名或密码错误' })
  }
})

app.post('/api/auth/logout', (req, res) => {
  token = null
  currentUser = null
  res.json({ success: true, message: '登出成功' })
})

app.get('/api/auth/current', (req, res) => {
  if (!currentUser) {
    return res.status(401).json({ success: false, message: '未登录' })
  }
  res.json({ success: true, data: currentUser })
})

// ==================== 统计数据接口 ====================
app.get('/api/stats/dashboard', (req, res) => {
  const stats = {
    todayAccess: mockData.accessRecords.length,
    totalPersonnel: mockData.personnel.length,
    todayVisitors: mockData.visitors.length,
    pendingAlertsCount: mockData.alerts.filter(a => a.status === 'pending').length
  }
  console.log('返回统计数据:', stats)
  res.json({ success: true, data: stats })
})

app.get('/api/stats/recent-records', (req, res) => {
  res.json({ success: true, data: mockData.accessRecords.slice(0, 10) })
})

// ==================== 告警相关接口 ====================
app.get('/api/alerts', (req, res) => {
  const { pageSize = 10 } = req.query
  res.json({
    success: true,
    data: mockData.alerts.slice(0, pageSize),
    total: mockData.alerts.length
  })
})

app.get('/api/alerts/stats', (req, res) => {
  const stats = {
    serious: mockData.alerts.filter(a => a.level === 'serious').length,
    warning: mockData.alerts.filter(a => a.level === 'warning').length,
    info: mockData.alerts.filter(a => a.level === 'info').length,
    handled: mockData.alerts.filter(a => a.status === 'handled').length
  }
  res.json({ success: true, data: stats })
})

app.put('/api/alerts/:id', (req, res) => {
  const { id } = req.params
  const { status } = req.body
  const alert = mockData.alerts.find(a => a.id === parseInt(id))
  if (alert) {
    alert.status = status
    alert.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
  res.json({ success: true, message: '操作成功' })
})

app.put('/api/alerts/:id/process', (req, res) => {
  const { id } = req.params
  const alert = mockData.alerts.find(a => a.id === parseInt(id))
  if (alert) {
    alert.status = 'handling'
    alert.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
  res.json({ success: true, message: '操作成功' })
})

// ==================== 门禁相关接口 ====================
app.get('/api/access/points', (req, res) => {
  res.json({ success: true, data: mockData.accessPoints, total: mockData.accessPoints.length })
})

app.post('/api/access/points', (req, res) => {
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
})

app.put('/api/access/points/:id', (req, res) => {
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
})

app.delete('/api/access/points/:id', (req, res) => {
  const { id } = req.params
  const index = mockData.accessPoints.findIndex(p => p.id === parseInt(id))
  if (index !== -1) {
    mockData.accessPoints.splice(index, 1)
    res.json({ success: true, message: '删除成功' })
  } else {
    res.status(404).json({ success: false, message: '门禁点不存在' })
  }
})

app.get('/api/access/records', (req, res) => {
  res.json({ success: true, data: mockData.accessRecords, total: mockData.accessRecords.length })
})

app.post('/api/access/records', (req, res) => {
  const newRecord = {
    id: mockData.accessRecords.length + 1,
    ...req.body,
    created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
  mockData.accessRecords.unshift(newRecord)
  res.json({ success: true, data: newRecord })
})

app.delete('/api/access/records/:id', (req, res) => {
  const { id } = req.params
  const index = mockData.accessRecords.findIndex(r => r.id === parseInt(id))
  if (index !== -1) {
    mockData.accessRecords.splice(index, 1)
    res.json({ success: true, message: '删除成功' })
  } else {
    res.status(404).json({ success: false, message: '记录不存在' })
  }
})

// ==================== 访客相关接口 ====================
app.get('/api/visitors', (req, res) => {
  res.json({ success: true, data: mockData.visitors, total: mockData.visitors.length })
})

app.post('/api/visitors', (req, res) => {
  const newVisitor = {
    id: mockData.visitors.length + 1,
    ...req.body,
    status: 'visiting',
    created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
  mockData.visitors.unshift(newVisitor)
  res.json({ success: true, data: newVisitor })
})

app.put('/api/visitors/:id', (req, res) => {
  const { id } = req.params
  const index = mockData.visitors.findIndex(v => v.id === parseInt(id))
  if (index !== -1) {
    mockData.visitors[index] = {
      ...mockData.visitors[index],
      ...req.body,
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
    res.json({ success: true, data: mockData.visitors[index] })
  } else {
    res.status(404).json({ success: false, message: '访客不存在' })
  }
})

app.put('/api/visitors/:id/checkout', (req, res) => {
  const { id } = req.params
  const visitor = mockData.visitors.find(v => v.id === parseInt(id))
  if (visitor) {
    visitor.status = 'completed'
    visitor.leave_time = new Date().toISOString().slice(0, 19).replace('T', ' ')
    res.json({ success: true, data: visitor })
  } else {
    res.status(404).json({ success: false, message: '访客不存在' })
  }
})

app.delete('/api/visitors/:id', (req, res) => {
  const { id } = req.params
  const index = mockData.visitors.findIndex(v => v.id === parseInt(id))
  if (index !== -1) {
    mockData.visitors.splice(index, 1)
    res.json({ success: true, message: '删除成功' })
  } else {
    res.status(404).json({ success: false, message: '访客不存在' })
  }
})

// ==================== 摄像头相关接口 ====================
app.get('/api/cameras', (req, res) => {
  res.json({ success: true, data: mockData.cameras, total: mockData.cameras.length })
})

app.post('/api/cameras', (req, res) => {
  const newCamera = {
    id: mockData.cameras.length + 1,
    ...req.body,
    created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
  mockData.cameras.push(newCamera)
  res.json({ success: true, data: newCamera })
})

app.put('/api/cameras/:id', (req, res) => {
  const { id } = req.params
  const index = mockData.cameras.findIndex(c => c.id === parseInt(id))
  if (index !== -1) {
    mockData.cameras[index] = {
      ...mockData.cameras[index],
      ...req.body,
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
    res.json({ success: true, data: mockData.cameras[index] })
  } else {
    res.status(404).json({ success: false, message: '摄像头不存在' })
  }
})

app.delete('/api/cameras/:id', (req, res) => {
  const { id } = req.params
  const index = mockData.cameras.findIndex(c => c.id === parseInt(id))
  if (index !== -1) {
    mockData.cameras.splice(index, 1)
    res.json({ success: true, message: '删除成功' })
  } else {
    res.status(404).json({ success: false, message: '摄像头不存在' })
  }
})

// ==================== 人员相关接口 ====================
app.get('/api/personnel', (req, res) => {
  res.json({ success: true, data: mockData.personnel, total: mockData.personnel.length })
})

app.post('/api/personnel', (req, res) => {
  const newPersonnel = {
    id: mockData.personnel.length + 1,
    ...req.body,
    created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
  mockData.personnel.push(newPersonnel)
  res.json({ success: true, data: newPersonnel })
})

app.put('/api/personnel/:id', (req, res) => {
  const { id } = req.params
  const index = mockData.personnel.findIndex(p => p.id === parseInt(id))
  if (index !== -1) {
    mockData.personnel[index] = {
      ...mockData.personnel[index],
      ...req.body,
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
    res.json({ success: true, data: mockData.personnel[index] })
  } else {
    res.status(404).json({ success: false, message: '人员不存在' })
  }
})

app.delete('/api/personnel/:id', (req, res) => {
  const { id } = req.params
  const index = mockData.personnel.findIndex(p => p.id === parseInt(id))
  if (index !== -1) {
    mockData.personnel.splice(index, 1)
    res.json({ success: true, message: '删除成功' })
  } else {
    res.status(404).json({ success: false, message: '人员不存在' })
  }
})

// ==================== 部门相关接口 ====================
app.get('/api/departments', (req, res) => {
  res.json({ success: true, data: mockData.departments, total: mockData.departments.length })
})

app.post('/api/departments', (req, res) => {
  const newDept = {
    id: mockData.departments.length + 1,
    ...req.body,
    created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
  mockData.departments.push(newDept)
  res.json({ success: true, data: newDept })
})

app.put('/api/departments/:id', (req, res) => {
  const { id } = req.params
  const index = mockData.departments.findIndex(d => d.id === parseInt(id))
  if (index !== -1) {
    mockData.departments[index] = {
      ...mockData.departments[index],
      ...req.body,
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
    res.json({ success: true, data: mockData.departments[index] })
  } else {
    res.status(404).json({ success: false, message: '部门不存在' })
  }
})

app.delete('/api/departments/:id', (req, res) => {
  const { id } = req.params
  const index = mockData.departments.findIndex(d => d.id === parseInt(id))
  if (index !== -1) {
    mockData.departments.splice(index, 1)
    res.json({ success: true, message: '删除成功' })
  } else {
    res.status(404).json({ success: false, message: '部门不存在' })
  }
})

// ==================== 班级相关接口 ====================
app.get('/api/classes', (req, res) => {
  res.json({ success: true, data: mockData.classes, total: mockData.classes.length })
})

app.post('/api/classes', (req, res) => {
  const newClass = {
    id: mockData.classes.length + 1,
    ...req.body,
    created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
  mockData.classes.push(newClass)
  res.json({ success: true, data: newClass })
})

app.put('/api/classes/:id', (req, res) => {
  const { id } = req.params
  const index = mockData.classes.findIndex(c => c.id === parseInt(id))
  if (index !== -1) {
    mockData.classes[index] = {
      ...mockData.classes[index],
      ...req.body,
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
    res.json({ success: true, data: mockData.classes[index] })
  } else {
    res.status(404).json({ success: false, message: '班级不存在' })
  }
})

app.delete('/api/classes/:id', (req, res) => {
  const { id } = req.params
  const index = mockData.classes.findIndex(c => c.id === parseInt(id))
  if (index !== -1) {
    mockData.classes.splice(index, 1)
    res.json({ success: true, message: '删除成功' })
  } else {
    res.status(404).json({ success: false, message: '班级不存在' })
  }
})

// ==================== 宿舍相关接口 ====================
app.get('/api/dormitories', (req, res) => {
  res.json({ success: true, data: mockData.dormitories, total: mockData.dormitories.length })
})

app.post('/api/dormitories', (req, res) => {
  const newDorm = {
    id: mockData.dormitories.length + 1,
    ...req.body,
    created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
  mockData.dormitories.push(newDorm)
  res.json({ success: true, data: newDorm })
})

app.put('/api/dormitories/:id', (req, res) => {
  const { id } = req.params
  const index = mockData.dormitories.findIndex(d => d.id === parseInt(id))
  if (index !== -1) {
    mockData.dormitories[index] = {
      ...mockData.dormitories[index],
      ...req.body,
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
    res.json({ success: true, data: mockData.dormitories[index] })
  } else {
    res.status(404).json({ success: false, message: '宿舍不存在' })
  }
})

app.delete('/api/dormitories/:id', (req, res) => {
  const { id } = req.params
  const index = mockData.dormitories.findIndex(d => d.id === parseInt(id))
  if (index !== -1) {
    mockData.dormitories.splice(index, 1)
    res.json({ success: true, message: '删除成功' })
  } else {
    res.status(404).json({ success: false, message: '宿舍不存在' })
  }
})

// ==================== 巡逻路线相关接口 ====================
app.get('/api/patrol/routes', (req, res) => {
  res.json({ success: true, data: mockData.patrolRoutes, total: mockData.patrolRoutes.length })
})

app.post('/api/patrol/routes', (req, res) => {
  const newRoute = {
    id: mockData.patrolRoutes.length + 1,
    ...req.body,
    created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
  mockData.patrolRoutes.push(newRoute)
  res.json({ success: true, data: newRoute })
})

app.put('/api/patrol/routes/:id', (req, res) => {
  const { id } = req.params
  const index = mockData.patrolRoutes.findIndex(r => r.id === parseInt(id))
  if (index !== -1) {
    mockData.patrolRoutes[index] = {
      ...mockData.patrolRoutes[index],
      ...req.body,
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
    res.json({ success: true, data: mockData.patrolRoutes[index] })
  } else {
    res.status(404).json({ success: false, message: '路线不存在' })
  }
})

app.delete('/api/patrol/routes/:id', (req, res) => {
  const { id } = req.params
  const index = mockData.patrolRoutes.findIndex(r => r.id === parseInt(id))
  if (index !== -1) {
    mockData.patrolRoutes.splice(index, 1)
    res.json({ success: true, message: '删除成功' })
  } else {
    res.status(404).json({ success: false, message: '路线不存在' })
  }
})

// ==================== 巡逻计划相关接口 ====================
app.get('/api/patrol/plans', (req, res) => {
  res.json({ success: true, data: mockData.patrolPlans, total: mockData.patrolPlans.length })
})

app.post('/api/patrol/plans', (req, res) => {
  const newPlan = {
    id: mockData.patrolPlans.length + 1,
    ...req.body,
    created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
  mockData.patrolPlans.push(newPlan)
  res.json({ success: true, data: newPlan })
})

app.put('/api/patrol/plans/:id', (req, res) => {
  const { id } = req.params
  const index = mockData.patrolPlans.findIndex(p => p.id === parseInt(id))
  if (index !== -1) {
    mockData.patrolPlans[index] = {
      ...mockData.patrolPlans[index],
      ...req.body,
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
    res.json({ success: true, data: mockData.patrolPlans[index] })
  } else {
    res.status(404).json({ success: false, message: '计划不存在' })
  }
})

app.delete('/api/patrol/plans/:id', (req, res) => {
  const { id } = req.params
  const index = mockData.patrolPlans.findIndex(p => p.id === parseInt(id))
  if (index !== -1) {
    mockData.patrolPlans.splice(index, 1)
    res.json({ success: true, message: '删除成功' })
  } else {
    res.status(404).json({ success: false, message: '计划不存在' })
  }
})

// ==================== 消防设施相关接口 ====================
app.get('/api/fire/facilities', (req, res) => {
  res.json({ success: true, data: mockData.fireFacilities, total: mockData.fireFacilities.length })
})

app.post('/api/fire/facilities', (req, res) => {
  const newFacility = {
    id: mockData.fireFacilities.length + 1,
    ...req.body,
    created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
  mockData.fireFacilities.push(newFacility)
  res.json({ success: true, data: newFacility })
})

app.put('/api/fire/facilities/:id', (req, res) => {
  const { id } = req.params
  const index = mockData.fireFacilities.findIndex(f => f.id === parseInt(id))
  if (index !== -1) {
    mockData.fireFacilities[index] = {
      ...mockData.fireFacilities[index],
      ...req.body,
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
    res.json({ success: true, data: mockData.fireFacilities[index] })
  } else {
    res.status(404).json({ success: false, message: '设施不存在' })
  }
})

app.delete('/api/fire/facilities/:id', (req, res) => {
  const { id } = req.params
  const index = mockData.fireFacilities.findIndex(f => f.id === parseInt(id))
  if (index !== -1) {
    mockData.fireFacilities.splice(index, 1)
    res.json({ success: true, message: '删除成功' })
  } else {
    res.status(404).json({ success: false, message: '设施不存在' })
  }
})

// ==================== 管理员用户相关接口 ====================
app.get('/api/users/admins', (req, res) => {
  res.json({ success: true, data: mockData.admins, total: mockData.admins.length })
})

app.post('/api/users/admins', (req, res) => {
  const newAdmin = {
    id: mockData.admins.length + 1,
    ...req.body,
    created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
  mockData.admins.push(newAdmin)
  res.json({ success: true, data: newAdmin })
})

app.put('/api/users/admins/:id', (req, res) => {
  const { id } = req.params
  const index = mockData.admins.findIndex(a => a.id === parseInt(id))
  if (index !== -1) {
    mockData.admins[index] = {
      ...mockData.admins[index],
      ...req.body,
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
    res.json({ success: true, data: mockData.admins[index] })
  } else {
    res.status(404).json({ success: false, message: '管理员不存在' })
  }
})

app.delete('/api/users/admins/:id', (req, res) => {
  const { id } = req.params
  const index = mockData.admins.findIndex(a => a.id === parseInt(id))
  if (index !== -1) {
    mockData.admins.splice(index, 1)
    res.json({ success: true, message: '删除成功' })
  } else {
    res.status(404).json({ success: false, message: '管理员不存在' })
  }
})

app.put('/api/users/admins/:id/password', (req, res) => {
  const { id } = req.params
  const admin = mockData.admins.find(a => a.id === parseInt(id))
  if (admin) {
    admin.password = req.body.password
    admin.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ')
    res.json({ success: true, message: '密码重置成功' })
  } else {
    res.status(404).json({ success: false, message: '管理员不存在' })
  }
})

// 404处理
app.use((req, res) => {
  console.log('未找到的路由:', req.method, req.originalUrl)
  res.status(404).json({ success: false, message: '接口不存在' })
})

// 启动服务器
app.listen(PORT, () => {
  console.log('\n========================================')
  console.log('  校园安全管理系统后端服务已启动')
  console.log(`  端口: http://localhost:${PORT}`)
  console.log('  数据源: Mock数据（完整）')
  console.log('========================================\n')
  console.log('可用的主要接口:')
  console.log('  POST  /api/auth/login          - 登录')
  console.log('  POST  /api/auth/logout         - 登出')
  console.log('  GET   /api/auth/current        - 获取当前用户')
  console.log('  GET   /api/stats/dashboard     - 统计数据')
  console.log('  GET   /api/alerts              - 告警列表')
  console.log('  GET   /api/access/points       - 门禁点列表')
  console.log('  GET   /api/access/records      - 门禁记录')
  console.log('  GET   /api/visitors            - 访客列表')
  console.log('  GET   /api/cameras             - 摄像头列表')
  console.log('  GET   /api/personnel           - 人员列表')
  console.log('  GET   /api/departments         - 部门列表')
  console.log('  GET   /api/patrol/routes       - 巡逻路线')
  console.log('  GET   /api/patrol/plans        - 巡逻计划')
  console.log('  GET   /api/fire/facilities     - 消防设施')
  console.log('\n等待请求...\n')
})
