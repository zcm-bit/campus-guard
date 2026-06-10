import { reactive } from 'vue'

const bcrypt = {
  compareSync: (password, hash) => {
    return password === 'admin123' || password === '123456'
  }
}

const mockUsers = reactive([
  { id: 1, username: 'admin', password: 'hash', realname: '系统管理员', role: 'super_admin', phone: '13800138000', email: 'admin@campus.cn', status: 1, created_at: new Date().toISOString() },
  { id: 2, username: 'security', password: 'hash', realname: '安保人员', role: 'security', phone: '13900139000', email: 'security@campus.cn', status: 1, created_at: new Date().toISOString() },
  { id: 3, username: 'teacher1', password: 'hash', realname: '李教授', role: 'teacher', phone: '13700137000', email: 'teacher@campus.cn', status: 1, created_at: new Date().toISOString() }
])

const mockStudents = reactive([
  { id: 1, name: '张三', studentId: '2021001', className: '计算机2101班', department: '计算机学院', phone: '13811111111', email: 'zhang3@student.campus.cn' },
  { id: 2, name: '李四', studentId: '2021002', className: '计算机2101班', department: '计算机学院', phone: '13822222222', email: 'li4@student.campus.cn' },
  { id: 3, name: '王五', studentId: '2021003', className: '信息工程2102班', department: '信息工程学院', phone: '13833333333', email: 'wang5@student.campus.cn' },
  { id: 4, name: '赵六', studentId: '2021004', className: '机械工程2101班', department: '机械工程学院', phone: '13844444444', email: 'zhao6@student.campus.cn' },
  { id: 5, name: '孙七', studentId: '2021005', className: '经济管理2101班', department: '经济管理学院', phone: '13855555555', email: 'sun7@student.campus.cn' }
])

const mockTeachers = reactive([
  { id: 1, name: '张教授', teacherId: 'T2001', department: '计算机学院', title: '教授', phone: '13911111111', email: 'zhang_prof@campus.cn' },
  { id: 2, name: '李教授', teacherId: 'T2002', department: '信息工程学院', title: '教授', phone: '13922222222', email: 'li_prof@campus.cn' },
  { id: 3, name: '王老师', teacherId: 'T2003', department: '机械工程学院', title: '讲师', phone: '13933333333', email: 'wang_teacher@campus.cn' },
  { id: 4, name: '刘主任', teacherId: 'T2004', department: '经济管理学院', title: '副教授', phone: '13944444444', email: 'liu_dean@campus.cn' }
])

const mockDepartments = reactive([
  { id: 1, name: '计算机学院', dean: '张教授', phone: '010-12345601', student_count: 1200, teacher_count: 80 },
  { id: 2, name: '信息工程学院', dean: '李教授', phone: '010-12345602', student_count: 980, teacher_count: 65 },
  { id: 3, name: '机械工程学院', dean: '王教授', phone: '010-12345603', student_count: 850, teacher_count: 55 },
  { id: 4, name: '经济管理学院', dean: '刘教授', phone: '010-12345604', student_count: 1100, teacher_count: 70 }
])

const mockAccessPoints = reactive([
  { id: 1, name: '南门', location: '校园南侧主入口', device_no: 'AC-001', type: 'pedestrian', status: 1 },
  { id: 2, name: '东门', location: '校园东侧入口', device_no: 'AC-002', type: 'pedestrian', status: 1 },
  { id: 3, name: '宿舍楼1', location: '1号楼宿舍入口', device_no: 'AC-003', type: 'dormitory', status: 1 },
  { id: 4, name: '教学楼A', location: 'A栋教学楼入口', device_no: 'AC-004', type: 'pedestrian', status: 0 },
  { id: 5, name: '停车场', location: '地下停车场入口', device_no: 'AC-005', type: 'vehicle', status: 1 }
])

const mockCameras = reactive([
  { id: 1, name: '南门监控', location: '南门入口', ip_address: '192.168.1.101', type: 'dome', status: 1 },
  { id: 2, name: '教学楼A大厅', location: '教学楼A栋大厅', ip_address: '192.168.1.102', type: 'bullet', status: 1 },
  { id: 3, name: '图书馆阅览室', location: '图书馆2楼', ip_address: '192.168.1.103', type: 'hemisphere', status: 0 },
  { id: 4, name: '操场全景', location: '操场看台', ip_address: '192.168.1.104', type: 'dome', status: 1 }
])

const mockVisitors = reactive([
  { id: 1, name: '张三', id_card: '110101199001011234', phone: '13812345678', company: 'XX科技', purpose: '技术交流', host_name: '李教授', status: 'visiting', visit_time: new Date().toISOString() },
  { id: 2, name: '李四', id_card: '110101198505055678', phone: '13987654321', company: 'YY公司', purpose: '合作洽谈', host_name: '王主任', status: 'reserved', visit_time: new Date(Date.now() + 86400000).toISOString() },
  { id: 3, name: '王五', id_card: '110101199203037890', phone: '13611112222', company: 'ZZ集团', purpose: '招聘宣讲', host_name: '张老师', status: 'left', visit_time: new Date(Date.now() - 3600000).toISOString(), leave_time: new Date(Date.now() - 1800000).toISOString() }
])

const mockAccessRecords = reactive([])
for (let i = 1; i <= 20; i++) {
  mockAccessRecords.push({
    id: i,
    person_name: ['学生A', '学生B', '教师C', '工作人员D', '访客E'][Math.floor(Math.random() * 5)],
    person_number: '202' + Math.floor(Math.random() * 10000),
    access_point_id: Math.floor(Math.random() * 5) + 1,
    access_time: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    access_type: Math.random() > 0.5 ? 'in' : 'out',
    result: Math.random() > 0.9 ? 'fail' : 'success',
    access_point_name: mockAccessPoints[Math.floor(Math.random() * 5)].name
  })
}

const mockPatrolRoutes = reactive([
  { id: 1, name: '教学楼巡检路线A', description: '教学楼区域日常巡检路线', total_distance: 500, estimated_time: 30 },
  { id: 2, name: '宿舍楼巡检路线', description: '学生宿舍区域巡检路线', total_distance: 400, estimated_time: 25 },
  { id: 3, name: '校园外围巡检路线', description: '校园外围安全巡检路线', total_distance: 1500, estimated_time: 60 }
])

const mockHazards = reactive([
  { id: 1, title: '消防通道堵塞', location: '3号楼1层', level: 'major', status: 'pending', reporterName: '安保人员', createdAt: new Date().toISOString() },
  { id: 2, title: '路灯损坏', location: '操场东侧', level: 'general', status: 'handling', reporterName: '保安', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 3, title: '围墙破损', location: '校园西北角', level: 'serious', status: 'resolved', reporterName: '巡检员', createdAt: new Date(Date.now() - 86400000).toISOString() }
])

const mockFireFacilities = reactive([
  { id: 1, name: '1号楼灭火器A区', type: 'fire_extinguisher', location: '1号楼1层走廊', install_date: '2023-01-01', expire_date: '2025-01-01', status: 1 },
  { id: 2, name: '2号楼消火栓', type: 'hydrant', location: '2号楼各层', install_date: '2022-06-01', expire_date: '2024-06-01', status: 1 },
  { id: 3, name: '教学楼喷淋系统', type: 'sprinkler', location: '教学楼大厅', install_date: '2021-03-01', expire_date: '2026-03-01', status: 1 }
])

const mockAlerts = reactive([
  { id: 1, title: '门禁异常', type: 'access', level: 'warning', content: '南门门禁连续5次刷卡失败', location: '南门', status: 'pending', created_at: new Date().toISOString() },
  { id: 2, title: '设备离线', type: 'device', level: 'warning', content: '监控点3信号中断', location: '图书馆', status: 'handling', created_at: new Date(Date.now() - 1800000).toISOString() },
  { id: 3, title: '消防设施过期', type: 'fire', level: 'critical', content: '1号楼灭火器即将过期', location: '1号楼', status: 'resolved', created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 4, title: '访客超时未签离', type: 'access', level: 'info', content: '访客张三已超过预计离开时间', location: '教学楼A', status: 'pending', created_at: new Date(Date.now() - 900000).toISOString() }
])

const mockOperationLogs = reactive([])
for (let i = 1; i <= 15; i++) {
  mockOperationLogs.push({
    id: i,
    username: ['admin', 'security'][Math.floor(Math.random() * 2)],
    module: ['用户管理', '门禁管理', '监控管理', '访客管理', '巡检管理'][Math.floor(Math.random() * 5)],
    action: ['查询', '新增', '修改', '删除', '登录'][Math.floor(Math.random() * 5)],
    content: ['查看用户列表', '添加门禁点', '修改监控配置', '登记访客', '执行巡检任务'][Math.floor(Math.random() * 5)],
    ip: '192.168.1.' + Math.floor(Math.random() * 254),
    created_at: new Date(Date.now() - Math.random() * 86400000).toISOString()
  })
}

let recordId = 21
let logId = 16

function generateNewAccessRecord() {
  const record = {
    id: recordId++,
    person_name: ['学生A', '学生B', '学生C', '教师D', '工作人员E', '访客F'][Math.floor(Math.random() * 6)],
    person_number: '202' + Math.floor(Math.random() * 10000),
    access_point_id: Math.floor(Math.random() * 5) + 1,
    access_time: new Date().toISOString(),
    access_type: Math.random() > 0.5 ? 'in' : 'out',
    result: Math.random() > 0.92 ? 'fail' : 'success',
    access_point_name: mockAccessPoints[Math.floor(Math.random() * 5)].name
  }
  mockAccessRecords.unshift(record)
  if (mockAccessRecords.length > 50) {
    mockAccessRecords.pop()
  }
  return record
}

function generateNewLog() {
  const log = {
    id: logId++,
    username: ['admin', 'security', 'teacher1'][Math.floor(Math.random() * 3)],
    module: ['用户管理', '门禁管理', '监控管理', '访客管理', '巡检管理', '系统设置'][Math.floor(Math.random() * 6)],
    action: ['查询', '新增', '修改', '删除', '登录', '登出'][Math.floor(Math.random() * 6)],
    content: ['查看用户列表', '添加门禁点', '修改监控配置', '登记访客', '执行巡检任务', '更新系统配置'][Math.floor(Math.random() * 6)],
    ip: '192.168.1.' + Math.floor(Math.random() * 254),
    created_at: new Date().toISOString()
  }
  mockOperationLogs.unshift(log)
  if (mockOperationLogs.length > 30) {
    mockOperationLogs.pop()
  }
  return log
}

function generateNewAlert() {
  const alerts = [
    { title: '门禁异常', type: 'access', level: 'warning', content: '连续刷卡失败', location: ['南门', '东门', '教学楼A'][Math.floor(Math.random() * 3)] },
    { title: '设备离线', type: 'device', level: 'warning', content: '设备信号中断', location: ['图书馆', '操场', '宿舍区'][Math.floor(Math.random() * 3)] },
    { title: '消防告警', type: 'fire', level: 'critical', content: '烟雾报警', location: ['教学楼', '宿舍楼', '图书馆'][Math.floor(Math.random() * 3)] },
    { title: '访客提醒', type: 'access', level: 'info', content: '访客即将离开', location: ['南门', '东门'][Math.floor(Math.random() * 2)] }
  ]
  const alertData = alerts[Math.floor(Math.random() * alerts.length)]
  const newAlert = {
    id: Date.now(),
    ...alertData,
    status: 'pending',
    created_at: new Date().toISOString()
  }
  mockAlerts.unshift(newAlert)
  return newAlert
}

export {
  bcrypt,
  mockUsers,
  mockStudents,
  mockTeachers,
  mockDepartments,
  mockAccessPoints,
  mockCameras,
  mockVisitors,
  mockAccessRecords,
  mockPatrolRoutes,
  mockHazards,
  mockFireFacilities,
  mockAlerts,
  mockOperationLogs,
  generateNewAccessRecord,
  generateNewLog,
  generateNewAlert
}
