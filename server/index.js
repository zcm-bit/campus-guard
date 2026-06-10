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
  connectTimeout: 10000
})

// Mock数据
const mockData = {
  accessRecords: [
    { id: 1, person_name: '张三', person_number: '2021001', person_type: 'student', access_point_id: 1, access_point_name: '正门门禁', access_time: '2024-01-15 08:00:00', access_type: 'in', result: 'success', reason: '' },
    { id: 2, person_name: '李四', person_number: '2021002', person_type: 'student', access_point_id: 2, access_point_name: '教学楼A门禁', access_time: '2024-01-15 08:15:00', access_type: 'in', result: 'success', reason: '' },
    { id: 3, person_name: '张教授', person_number: 'T001', person_type: 'teacher', access_point_id: 2, access_point_name: '教学楼A门禁', access_time: '2024-01-15 08:30:00', access_type: 'in', result: 'success', reason: '' },
    { id: 4, person_name: '王五', person_number: '2021003', person_type: 'student', access_point_id: 1, access_point_name: '正门门禁', access_time: '2024-01-15 09:00:00', access_type: 'in', result: 'success', reason: '' },
    { id: 5, person_name: '张三', person_number: '2021001', person_type: 'student', access_point_id: 3, access_point_name: '宿舍楼1门禁', access_time: '2024-01-15 18:00:00', access_type: 'in', result: 'success', reason: '' },
    { id: 6, person_name: '李四', person_number: '2021002', person_type: 'student', access_point_id: 3, access_point_name: '宿舍楼1门禁', access_time: '2024-01-15 15:00:00', access_type: 'in', result: 'success', reason: '' },
    { id: 7, person_name: '赵六', person_number: '2022001', person_type: 'student', access_point_id: 4, access_point_name: '图书馆门禁', access_time: '2024-01-15 14:00:00', access_type: 'in', result: 'success', reason: '' },
    { id: 8, person_name: '钱七', person_number: '2022002', person_type: 'student', access_point_id: 4, access_point_name: '图书馆门禁', access_time: '2024-01-15 14:10:00', access_type: 'in', result: 'success', reason: '' },
    { id: 9, person_name: '李老师', person_number: 'T002', person_type: 'teacher', access_point_id: 2, access_point_name: '教学楼A门禁', access_time: '2024-01-15 15:00:00', access_type: 'in', result: 'success', reason: '' },
    { id: 10, person_name: '孙七', person_number: '2021005', person_type: 'student', access_point_id: 1, access_point_name: '正门门禁', access_time: '2024-01-15 09:20:15', access_type: 'in', result: '拒绝', reason: '权限不足' }
  ],
  personnel: [
    { id: 1, name: '张三', number: '2021001', type: 'student', department: '计算机学院', class_name: '2021级计算机1班', phone: '13900139001', email: 'zhangsan@campus.cn', id_card: '320100200001011234', status: 'active' },
    { id: 2, name: '李四', number: '2021002', type: 'student', department: '计算机学院', class_name: '2021级计算机1班', phone: '13900139002', email: 'lisi@campus.cn', id_card: '320100200002022345', status: 'active' },
    { id: 3, name: '王五', number: '2021003', type: 'student', department: '计算机学院', class_name: '2021级计算机2班', phone: '13900139003', email: 'wangwu@campus.cn', id_card: '320100200003033456', status: 'active' },
    { id: 4, name: '赵六', number: '2022001', type: 'student', department: '电子工程学院', class_name: '2022级电子1班', phone: '13900139004', email: 'zhaoliu@campus.cn', id_card: '320100200101014567', status: 'active' },
    { id: 5, name: '钱七', number: '2022002', type: 'student', department: '管理学院', class_name: '2022级管理1班', phone: '13900139005', email: 'qianqi@campus.cn', id_card: '320100200102025678', status: 'active' },
    { id: 6, name: '张教授', number: 'T001', type: 'teacher', department: '计算机学院', class_name: '', phone: '13900139010', email: 'zhangprof@campus.cn', id_card: '320100197508123456', status: 'active' },
    { id: 7, name: '李老师', number: 'T002', type: 'teacher', department: '计算机学院', class_name: '', phone: '13900139011', email: 'liteacher@campus.cn', id_card: '320100198011204567', status: 'active' },
    { id: 8, name: '王老师', number: 'T003', type: 'teacher', department: '电子工程学院', class_name: '', phone: '13900139012', email: 'wangteacher@campus.cn', id_card: '320100198205155678', status: 'active' }
  ],
  visitors: [
    { id: 1, name: '刘访客', id_card: '320100199001011234', phone: '13900139020', company: 'XX科技公司', purpose: '拜访同学', host_name: '张三', host_dept: '计算机学院', visit_time: '2024-01-15 10:00:00', leave_time: '2024-01-15 12:00:00', access_area: '宿舍楼', status: 'completed' },
    { id: 2, name: '陈访客', id_card: '320200198505156789', phone: '13900139021', company: 'XX研究所', purpose: '学术交流', host_name: '张教授', host_dept: '计算机学院', visit_time: '2024-01-15 09:00:00', leave_time: '2024-01-15 11:30:00', access_area: '教学楼', status: 'completed' },
    { id: 3, name: '周访客', id_card: '310100199208204567', phone: '13900139022', company: 'XX企业', purpose: '项目洽谈', host_name: '李老师', host_dept: '电子工程学院', visit_time: '2024-01-16 14:00:00', leave_time: null, access_area: '教学楼', status: 'visiting' }
  ],
  alerts: [
    { id: 1, title: '东门-设备离线', content: '设备通信中断，请检查网络', type: 'device', level: 'info', location: '东门', status: 'pending', handle_time: null, handle_result: null, created_at: '2024-01-15 09:30:00', updated_at: '2024-01-15 09:30:00' },
    { id: 2, title: '教学楼A-权限异常', content: '检测到异常刷卡行为', type: 'access', level: 'warning', location: '教学楼A', status: 'pending', handle_time: null, handle_result: null, created_at: '2024-01-15 09:20:00', updated_at: '2024-01-15 09:20:00' },
    { id: 3, title: '图书馆-非法闯入', content: '检测到未授权人员试图进入', type: 'access', level: 'serious', location: '图书馆', status: 'pending', handle_time: null, handle_result: null, created_at: '2024-01-15 09:15:00', updated_at: '2024-01-15 09:15:00' },
    { id: 4, title: '宿舍楼1-门长时间未关闭', content: '门已保持打开超过10分钟', type: 'access', level: 'serious', location: '宿舍楼1', status: 'pending', handle_time: null, handle_result: null, created_at: '2024-01-15 09:10:00', updated_at: '2024-01-15 09:10:00' },
    { id: 5, title: '南门-尾随告警', content: '检测到尾随行为，已自动锁定门禁', type: 'access', level: 'warning', location: '南门', status: 'pending', handle_time: null, handle_result: null, created_at: '2024-01-15 09:00:00', updated_at: '2024-01-15 09:00:00' },
    { id: 6, title: '消防通道-门被占用', content: '消防通道门被杂物堵塞', type: 'fire', level: 'warning', location: '教学楼B', status: 'handled', handle_time: '2024-01-15 10:00:00', handle_result: '已清理', created_at: '2024-01-15 08:30:00', updated_at: '2024-01-15 10:00:00' }
  ],
  accessPoints: [
    { id: 1, name: '正门门禁', location: '学校正门', device_no: 'AP001', type: 'gate', status: 'normal', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' },
    { id: 2, name: '教学楼A门禁', location: '教学楼A栋', device_no: 'AP002', type: 'building', status: 'normal', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' },
    { id: 3, name: '宿舍楼1门禁', location: '学生宿舍楼1栋', device_no: 'AP003', type: 'dormitory', status: 'normal', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' },
    { id: 4, name: '图书馆门禁', location: '图书馆正门', device_no: 'AP004', type: 'library', status: 'normal', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' },
    { id: 5, name: '南门门禁', location: '学校南门', device_no: 'AP005', type: 'gate', status: 'normal', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' },
    { id: 6, name: '东门门禁', location: '学校东门', device_no: 'AP006', type: 'gate', status: 'offline', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-15 09:30:00' },
    { id: 7, name: '教学楼B门禁', location: '教学楼B栋', device_no: 'AP007', type: 'building', status: 'normal', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' },
    { id: 8, name: '宿舍楼2门禁', location: '学生宿舍楼2栋', device_no: 'AP008', type: 'dormitory', status: 'normal', created_at: '2024-01-01 00:00:00', updated_at: '2024-01-01 00:00:00' }
  ],
  cameras: [
    { id: 1, name: '正门监控', location: '学校正门', status: 'online', ip_address: '192.168.1.101', resolution: '1080P', created_at: '2024-01-01 00:00:00' },
    { id: 2, name: '教学楼A监控', location: '教学楼A栋', status: 'online', ip_address: '192.168.1.102', resolution: '1080P', created_at: '2024-01-01 00:00:00' },
    { id: 3, name: '宿舍楼1监控', location: '学生宿舍楼1栋', status: 'online', ip_address: '192.168.1.103', resolution: '1080P', created_at: '2024-01-01 00:00:00' },
    { id: 4, name: '图书馆监控', location: '图书馆', status: 'online', ip_address: '192.168.1.104', resolution: '4K', created_at: '2024-01-01 00:00:00' },
    { id: 5, name: '南门监控', location: '学校南门', status: 'online', ip_address: '192.168.1.105', resolution: '1080P', created_at: '2024-01-01 00:00:00' },
    { id: 6, name: '东门监控', location: '学校东门', status: 'offline', ip_address: '192.168.1.106', resolution: '1080P', created_at: '2024-01-01 00:00:00' },
    { id: 7, name: '教学楼B监控', location: '教学楼B栋', status: 'online', ip_address: '192.168.1.107', resolution: '1080P', created_at: '2024-01-01 00:00:00' },
    { id: 8, name: '宿舍楼2监控', location: '学生宿舍楼2栋', status: 'online', ip_address: '192.168.1.108', resolution: '1080P', created_at: '2024-01-01 00:00:00' }
  ],
  departments: [
    { id: 1, name: '计算机学院', dean: '张教授', phone: '010-12345678', student_count: 1200, teacher_count: 85, description: '负责计算机相关学科教学与研究', created_at: '2024-01-01 00:00:00' },
    { id: 2, name: '电子工程学院', dean: '李教授', phone: '010-23456789', student_count: 900, teacher_count: 65, description: '负责电子工程相关学科教学与研究', created_at: '2024-01-01 00:00:00' },
    { id: 3, name: '管理学院', dean: '王教授', phone: '010-34567890', student_count: 800, teacher_count: 55, description: '负责管理学科教学与研究', created_at: '2024-01-01 00:00:00' },
    { id: 4, name: '信息中心', dean: '陈主任', phone: '010-45678901', student_count: 0, teacher_count: 30, description: '负责校园信息化建设与维护', created_at: '2024-01-01 00:00:00' }
  ],
  classes: [
    { id: 1, name: '2021级计算机1班', department_id: 1, department: '计算机学院', student_count: 30, teacher: '张教授', created_at: '2024-01-01 00:00:00' },
    { id: 2, name: '2021级计算机2班', department_id: 1, department: '计算机学院', student_count: 28, teacher: '李老师', created_at: '2024-01-01 00:00:00' },
    { id: 3, name: '2022级电子1班', department_id: 2, department: '电子工程学院', student_count: 32, teacher: '王老师', created_at: '2024-01-01 00:00:00' },
    { id: 4, name: '2022级管理1班', department_id: 3, department: '管理学院', student_count: 25, teacher: '陈老师', created_at: '2024-01-01 00:00:00' }
  ],
  dormitories: [
    { id: 1, name: '学生宿舍楼1栋', location: '校园东区', room_count: 60, capacity: 240, current_count: 210, status: 'normal', created_at: '2024-01-01 00:00:00' },
    { id: 2, name: '学生宿舍楼2栋', location: '校园东区', room_count: 60, capacity: 240, current_count: 205, status: 'normal', created_at: '2024-01-01 00:00:00' },
    { id: 3, name: '教师公寓1栋', location: '校园西区', room_count: 30, capacity: 60, current_count: 55, status: 'normal', created_at: '2024-01-01 00:00:00' }
  ],
  admins: [
    { id: 1, username: 'admin', password: '123456', name: '系统管理员', phone: '13800138000', email: 'admin@campus.cn', created_at: '2024-01-01 00:00:00' }
  ],
  teachers: [
    { id: 1, teacher_id: 'T001', name: '张教授', phone: '13900139010', email: 'zhangprof@campus.cn', department: '计算机学院', title: '教授', created_at: '2024-01-01 00:00:00' },
    { id: 2, teacher_id: 'T002', name: '李老师', phone: '13900139011', email: 'liteacher@campus.cn', department: '计算机学院', title: '讲师', created_at: '2024-01-01 00:00:00' },
    { id: 3, teacher_id: 'T003', name: '王老师', phone: '13900139012', email: 'wangteacher@campus.cn', department: '电子工程学院', title: '副教授', created_at: '2024-01-01 00:00:00' }
  ],
  students: [
    { id: 1, student_id: '2021001', name: '张三', phone: '13900139001', email: 'zhangsan@campus.cn', department: '计算机学院', class_name: '2021级计算机1班', dormitory: '学生宿舍楼1栋', status: 'active', created_at: '2024-01-01 00:00:00' },
    { id: 2, student_id: '2021002', name: '李四', phone: '13900139002', email: 'lisi@campus.cn', department: '计算机学院', class_name: '2021级计算机1班', dormitory: '学生宿舍楼1栋', status: 'active', created_at: '2024-01-01 00:00:00' },
    { id: 3, student_id: '2021003', name: '王五', phone: '13900139003', email: 'wangwu@campus.cn', department: '计算机学院', class_name: '2021级计算机2班', dormitory: '学生宿舍楼2栋', status: 'active', created_at: '2024-01-01 00:00:00' },
    { id: 4, student_id: '2022001', name: '赵六', phone: '13900139004', email: 'zhaoliu@campus.cn', department: '电子工程学院', class_name: '2022级电子1班', dormitory: '学生宿舍楼1栋', status: 'active', created_at: '2024-01-01 00:00:00' },
    { id: 5, student_id: '2022002', name: '钱七', phone: '13900139005', email: 'qianqi@campus.cn', department: '管理学院', class_name: '2022级管理1班', dormitory: '学生宿舍楼2栋', status: 'active', created_at: '2024-01-01 00:00:00' }
  ],
  patrolRoutes: [
    { id: 1, name: '东门-南门路线', description: '从东门巡逻到南门', type: 'daily', checkpoints: '东门,教学楼A,图书馆,南门', status: 'active', created_at: '2024-01-01 00:00:00' },
    { id: 2, name: '教学楼区域路线', description: '教学楼A和教学楼B之间巡逻', type: 'daily', checkpoints: '教学楼A,教学楼B,操场', status: 'active', created_at: '2024-01-01 00:00:00' },
    { id: 3, name: '宿舍区域路线', description: '宿舍楼1和宿舍楼2巡逻', type: 'night', checkpoints: '宿舍楼1,宿舍楼2,食堂', status: 'active', created_at: '2024-01-01 00:00:00' },
    { id: 4, name: '宿舍区域路线', description: '宿舍楼1和宿舍楼2巡逻', type: 'night', checkpoints: '宿舍楼1,宿舍楼2,食堂', status: 'active', created_at: '2024-01-01 00:00:00' },
    { id: 5, name: '东门-西门路线', description: '东门到西门的巡逻', type: 'fire', checkpoints: '东门,教学楼B,西门', status: 'active', created_at: '2024-01-01 00:00:00' }
  ],
  patrolPlans: [
    { id: 1, name: '白班巡逻计划', route_id: 1, route_name: '东门-南门路线', executor_name: '张保安', shift_type: 'morning', period: 'daily', status: 1, created_at: '2024-01-01 00:00:00' },
    { id: 2, name: '白班巡逻计划', route_id: 2, route_name: '教学楼区域路线', executor_name: '李保安', shift_type: 'morning', period: 'daily', status: 1, created_at: '2024-01-01 00:00:00' },
    { id: 3, name: '夜班巡逻计划', route_id: 3, route_name: '宿舍区域路线', executor_name: '王保安', shift_type: 'night', period: 'daily', status: 0, created_at: '2024-01-01 00:00:00' },
    { id: 4, name: '夜班巡逻计划', route_id: 3, route_name: '宿舍区域路线', executor_name: '赵保安', shift_type: 'night', period: 'monthly', status: 1, created_at: '2024-01-01 00:00:00' }
  ],
  patrolRecords: [
    { id: 1, route_id: 1, route_name: '东门-南门路线', patrol_time: '2024-01-15 08:00:00', completed: true, notes: '一切正常', created_at: '2024-01-15 08:00:00' },
    { id: 2, route_id: 2, route_name: '教学楼区域路线', patrol_time: '2024-01-15 10:00:00', completed: true, notes: '教学楼B后门未锁', created_at: '2024-01-15 10:00:00' },
    { id: 3, route_id: 1, route_name: '东门-南门路线', patrol_time: '2024-01-15 16:00:00', completed: true, notes: '一切正常', created_at: '2024-01-15 16:00:00' }
  ],
  fireFacilities: [
    { id: 1, name: '教学楼A灭火器1', location: '教学楼A-1楼走廊', type: 'fire_extinguisher', status: 'normal', last_inspection_date: '2024-01-01', next_inspection_date: '2024-07-01', created_at: '2024-01-01 00:00:00' },
    { id: 2, name: '教学楼A灭火器2', location: '教学楼A-2楼走廊', type: 'fire_extinguisher', status: 'normal', last_inspection_date: '2024-01-01', next_inspection_date: '2024-07-01', created_at: '2024-01-01 00:00:00' },
    { id: 3, name: '教学楼A灭火器2', location: '教学楼A-2楼走廊', type: 'fire_extinguisher', status: 'normal', last_inspection_date: '2024-01-01', next_inspection_date: '2024-07-01', created_at: '2024-01-01 00:00:00' },
    { id: 4, name: '宿舍楼1消火栓', location: '宿舍楼1-1楼大厅', type: 'fire_hydrant', status: 'normal', last_inspection_date: '2024-01-01', next_inspection_date: '2024-07-01', created_at: '2024-01-01 00:00:00' },
    { id: 5, name: '图书馆灭火器', location: '图书馆-1楼入口', type: 'fire_extinguisher', status: 'normal', last_inspection_date: '2024-01-01', next_inspection_date: '2024-07-01', created_at: '2024-01-01 00:00:00' },
    { id: 6, name: '图书馆灭火器', location: '图书馆-1楼入口', type: 'fire_extinguisher', status: 'normal', last_inspection_date: '2024-01-01', next_inspection_date: '2024-07-01', created_at: '2024-01-01 00:00:00' },
    { id: 7, name: '教学楼B灭火器', location: '教学楼B-1楼走廊', type: 'fire_extinguisher', status: 'expired', last_inspection_date: '2023-06-01', next_inspection_date: '2024-01-01', created_at: '2024-01-01 00:00:00' },
    { id: 8, name: '宿舍楼2消火栓', location: '宿舍楼2楼', type: 'fire_hydrant', status: 'normal', last_inspection_date: '2024-01-01', next_inspection_date: '2024-07-01', created_at: '2024-01-01 00:00:00' }
  ],
  fireInspections: [
    { id: 1, facility_id: 1, facility_name: '教学楼A灭火器1', inspector: '张安全员', inspection_time: '2024-01-01 10:00:00', result: '合格', notes: '压力正常', created_at: '2024-01-01 10:00:00' },
    { id: 2, facility_id: 2, facility_name: '教学楼A灭火器2', inspector: '张安全员', inspection_time: '2024-01-01 10:10:00', result: '合格', notes: '压力正常', created_at: '2024-01-01 10:10:00' },
    { id: 3, facility_id: 3, facility_name: '宿舍楼1消火栓', inspector: '李安全员', inspection_time: '2024-01-02 09:00:00', result: '合格', notes: '水压正常', created_at: '2024-01-02 09:00:00' },
    { id: 4, facility_id: 5, facility_name: '教学楼B灭火器', inspector: '张安全员', inspection_time: '2024-01-10 14:00:00', result: '不合格', notes: '已过期，需要更换', created_at: '2024-01-10 14:00:00' }
  ]
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
      const [rows] = await pool.query('SELECT * FROM teachers WHERE (teacher_id = ? OR name = ?) AND password = ?', [username, username, password])
      user = rows[0]
    } else if (loginType === 'student') {
      const [rows] = await pool.query('SELECT * FROM students WHERE (student_id = ? OR name = ?) AND password = ?', [username, username, password])
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
app.get('/api/auth/current', (req, res) => {
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
    const [accessResult] = await pool.query('SELECT COUNT(*) as total FROM access_records')
    const [personnelResult] = await pool.query('SELECT COUNT(*) as total FROM personnel')
    const [visitorsResult] = await pool.query('SELECT COUNT(*) as total FROM visitors')
    const [alertsResult] = await pool.query('SELECT COUNT(*) as total FROM alerts WHERE status = "pending" OR status = "handling"')
    
    res.json({
      success: true,
      data: {
        todayAccess: parseInt(accessResult[0]?.total) || 0,
        totalPersonnel: parseInt(personnelResult[0]?.total) || 0,
        todayVisitors: parseInt(visitorsResult[0]?.total) || 0,
        pendingAlertsCount: parseInt(alertsResult[0]?.total) || 0
      }
    })
  } catch (error) {
    console.error('获取统计数据失败:', error)
    // 如果数据库查询失败，使用mock数据作为备用
    const pendingAlerts = mockData.alerts.filter(a => a.status === 'pending' || a.status === 'handling')
    res.json({
      success: true,
      data: {
        todayAccess: mockData.accessRecords.length,
        totalPersonnel: mockData.personnel.length,
        todayVisitors: mockData.visitors.length,
        pendingAlertsCount: pendingAlerts.length
      }
    })
  }
})

// 通行记录接口
app.get('/api/stats/recent-records', (req, res) => {
  res.json({ success: true, data: mockData.accessRecords })
})

// 门禁记录列表接口
app.get('/api/access/records', (req, res) => {
  const { page = 1, pageSize = 10, keyword, personType, result, startDate, endDate } = req.query
  
  let filtered = [...mockData.accessRecords]
  
  if (keyword) {
    filtered = filtered.filter(item => 
      item.person_name?.toLowerCase().includes(keyword.toLowerCase()) ||
      item.person_number?.toLowerCase().includes(keyword.toLowerCase())
    )
  }
  if (personType) {
    filtered = filtered.filter(item => item.person_type === personType)
  }
  if (result) {
    filtered = filtered.filter(item => item.result === result)
  }
  if (startDate) {
    filtered = filtered.filter(item => item.access_time >= startDate)
  }
  if (endDate) {
    filtered = filtered.filter(item => item.access_time <= endDate)
  }
  
  filtered.sort((a, b) => new Date(b.access_time) - new Date(a.access_time))
  
  const total = filtered.length
  const start = (parseInt(page) - 1) * parseInt(pageSize)
  const end = start + parseInt(pageSize)
  const data = filtered.slice(start, end)
  
  res.json({ success: true, data, total })
})

// 告警列表接口
app.get('/api/alerts', async (req, res) => {
  const { type, level, status } = req.query
  
  try {
    let sql = 'SELECT * FROM alerts WHERE 1=1'
    let params = []
    
    if (type) {
      sql += ' AND type = ?'
      params.push(type)
    }
    if (level) {
      sql += ' AND level = ?'
      params.push(level)
    }
    if (status) {
      const statusList = status.split(',')
      sql += ' AND status IN (' + statusList.map(() => '?').join(',') + ')'
      params.push(...statusList)
    }
    
    sql += ' ORDER BY created_at DESC'
    
    const [rows] = await pool.query(sql, params)
    const [totalResult] = await pool.query('SELECT COUNT(*) as total FROM alerts WHERE 1=1' + 
      (type ? ' AND type = ?' : '') + 
      (level ? ' AND level = ?' : '') + 
      (status ? ' AND status IN (' + status.split(',').map(() => '?').join(',') + ')' : ''), params)
    
    res.json({ 
      success: true, 
      data: rows, 
      total: parseInt(totalResult[0]?.total) || 0 
    })
  } catch (error) {
    console.error('获取告警数据失败:', error)
    // 如果数据库查询失败，使用mock数据作为备用
    let filtered = [...mockData.alerts]
    
    if (type) {
      filtered = filtered.filter(a => a.type === type)
    }
    if (level) {
      filtered = filtered.filter(a => a.level === level)
    }
    if (status) {
      const statusList = status.split(',')
      filtered = filtered.filter(a => statusList.includes(a.status))
    }
    
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    
    res.json({ 
      success: true, 
      data: filtered, 
      total: filtered.length 
    })
  }
})

// 告警统计接口
app.get('/api/alerts/stats', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        SUM(CASE WHEN level = 'serious' OR level = 'critical' THEN 1 ELSE 0 END) as critical,
        SUM(CASE WHEN level = 'warning' THEN 1 ELSE 0 END) as warning,
        SUM(CASE WHEN level = 'info' THEN 1 ELSE 0 END) as info,
        SUM(CASE WHEN status = 'resolved' OR status = 'handled' OR status = 'handling' THEN 1 ELSE 0 END) as resolved,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
      FROM alerts
    `)
    res.json({
      success: true,
      data: rows[0]
    })
  } catch (error) {
    console.error('获取告警统计失败:', error)
    // 如果数据库操作失败，使用mock数据作为备用
    const critical = mockData.alerts.filter(a => a.level === 'serious' || a.level === 'critical').length
    const warning = mockData.alerts.filter(a => a.level === 'warning').length
    const info = mockData.alerts.filter(a => a.level === 'info').length
    const pending = mockData.alerts.filter(a => a.status === 'pending').length
    const resolved = mockData.alerts.filter(a => a.status === 'resolved' || a.status === 'handled' || a.status === 'handling').length
    
    res.json({
      success: true,
      data: { critical, warning, info, resolved, pending }
    })
  }
})

// 更新告警状态
app.put('/api/alerts/:id', async (req, res) => {
  const { id } = req.params
  const { status } = req.body
  
  try {
    await pool.query('UPDATE alerts SET status = ?, updated_at = NOW() WHERE id = ?', [status, id])
    res.json({ success: true, message: '操作成功' })
  } catch (error) {
    console.error('更新告警状态失败:', error)
    // 如果数据库操作失败，使用mock数据作为备用
    const alert = mockData.alerts.find(a => a.id === parseInt(id))
    if (alert) {
      alert.status = status
      alert.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ')
      res.json({ success: true, message: '操作成功' })
    } else {
      res.status(404).json({ success: false, message: '告警不存在' })
    }
  }
})

// 删除告警接口
app.delete('/api/alerts/:id', async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM alerts WHERE id = ?', [id])
    res.json({ success: true, message: '删除成功' })
  } catch (error) {
    console.error('删除告警失败:', error)
    // 如果数据库操作失败，使用mock数据作为备用
    const index = mockData.alerts.findIndex(a => a.id === parseInt(id))
    if (index !== -1) {
      mockData.alerts.splice(index, 1)
      res.json({ success: true, message: '删除成功' })
    } else {
      res.status(404).json({ success: false, message: '告警不存在' })
    }
  }
})

// 处理告警接口
app.put('/api/alerts/:id/process', async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('UPDATE alerts SET status = "resolved", handle_time = NOW() WHERE id = ?', [id])
    res.json({ success: true, message: '操作成功' })
  } catch (error) {
    console.error('处理告警失败:', error)
    // 如果数据库操作失败，使用mock数据作为备用
    const alert = mockData.alerts.find(a => a.id === parseInt(id))
    if (alert) {
      alert.status = 'resolved'
      alert.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ')
      res.json({ success: true, message: '操作成功' })
    } else {
      res.status(404).json({ success: false, message: '告警不存在' })
    }
  }
})

// 门禁点接口
app.get('/api/access/points', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM access_points ORDER BY id')
    // 将数据库字段 device_code 映射为 device_no
    const data = rows.map(item => ({
      ...item,
      device_no: item.device_code || item.device_no
    }))
    res.json({ success: true, data, total: data.length })
  } catch (error) {
    console.error('获取门禁点数据失败:', error)
    // 如果数据库查询失败，使用mock数据作为备用
    res.json({ success: true, data: mockData.accessPoints, total: mockData.accessPoints.length })
  }
})

app.post('/api/access/points', async (req, res) => {
  try {
    const { name, location, device_no, type, status } = req.body
    const [result] = await pool.query(
      'INSERT INTO access_points (name, location, device_code, type, status) VALUES (?, ?, ?, ?, ?)',
      [name, location, device_no, type || 'pedestrian', status || 1]
    )
    res.json({ success: true, data: { id: result.insertId, name, location, device_no, type, status } })
  } catch (error) {
    console.error('创建门禁点失败:', error)
    // 如果数据库操作失败，使用mock数据作为备用
    const { name, location, device_no, type, status } = req.body
    const newPoint = {
      id: Date.now(),
      name,
      location,
      device_no: device_no || '',
      type: type || 'gate',
      status: status || 'normal',
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
    mockData.accessPoints.push(newPoint)
    res.json({ success: true, data: newPoint })
  }
})

app.put('/api/access/points/:id', async (req, res) => {
  const { id } = req.params
  try {
    const { name, location, device_no, type, status } = req.body
    await pool.query(
      'UPDATE access_points SET name = ?, location = ?, device_code = ?, type = ?, status = ?, updated_at = NOW() WHERE id = ?',
      [name, location, device_no, type, status, id]
    )
    res.json({ success: true, data: { id, name, location, device_no, type, status } })
  } catch (error) {
    console.error('更新门禁点失败:', error)
    // 如果数据库操作失败，使用mock数据作为备用
    const point = mockData.accessPoints.find(p => p.id === parseInt(id))
    if (point) {
      const { name, location, device_no, type, status } = req.body
      point.name = name
      point.location = location
      point.device_no = device_no
      point.type = type
      point.status = status
      point.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ')
      res.json({ success: true, data: point })
    } else {
      res.status(404).json({ success: false, message: '门禁点不存在' })
    }
  }
})

app.delete('/api/access/points/:id', async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM access_points WHERE id = ?', [id])
    res.json({ success: true, message: '删除成功' })
  } catch (error) {
    console.error('删除门禁点失败:', error)
    // 如果数据库操作失败，使用mock数据作为备用
    const index = mockData.accessPoints.findIndex(p => p.id === parseInt(id))
    if (index !== -1) {
      mockData.accessPoints.splice(index, 1)
      res.json({ success: true, message: '删除成功' })
    } else {
      res.status(404).json({ success: false, message: '门禁点不存在' })
    }
  }
})

// 访客接口
app.get('/api/visitors', async (req, res) => {
  const { page = 1, pageSize = 10, keyword = '', status = '' } = req.query
  try {
    let query = 'SELECT * FROM visitors ORDER BY created_at DESC'
    const params = []
    
    if (keyword) {
      query = 'SELECT * FROM visitors WHERE name LIKE ? OR id_card LIKE ? OR phone LIKE ? ORDER BY created_at DESC'
      params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`)
    }
    
    if (status) {
      if (keyword) {
        query += ' AND status = ?'
      } else {
        query = 'SELECT * FROM visitors WHERE status = ? ORDER BY created_at DESC'
      }
      params.push(status)
    }
    
    const [rows] = await pool.query(query, params)
    const total = rows.length
    
    const start = (page - 1) * pageSize
    const end = start + parseInt(pageSize)
    const data = rows.slice(start, end)
    
    res.json({ success: true, data, total })
  } catch (error) {
    console.error('获取访客列表失败:', error)
    res.json({ success: true, data: mockData.visitors, total: mockData.visitors.length })
  }
})

app.post('/api/visitors', async (req, res) => {
  const { name, idCard, phone, company, purpose, hostName, hostDept, accessArea, visitTime } = req.body
  try {
    const [result] = await pool.query(
      'INSERT INTO visitors (name, id_card, phone, company, purpose, host_name, host_dept, access_area, visit_time, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, idCard, phone, company, purpose, hostName, hostDept, accessArea || '教学楼', visitTime, 'visiting']
    )
    const newVisitor = {
      id: result.insertId,
      name,
      id_card: idCard,
      phone,
      company,
      purpose,
      host_name: hostName,
      host_dept: hostDept,
      access_area: accessArea || '教学楼',
      visit_time: visitTime,
      leave_time: null,
      status: 'visiting',
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
    res.json({ success: true, data: newVisitor })
  } catch (error) {
    console.error('添加访客失败:', error)
    // 使用mock数据作为备用
    const newVisitor = {
      id: Date.now(),
      name,
      id_card: idCard,
      phone,
      company,
      purpose,
      host_name: hostName,
      host_dept: hostDept,
      access_area: accessArea || '教学楼',
      visit_time: visitTime,
      leave_time: null,
      status: 'visiting',
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
    mockData.visitors.push(newVisitor)
    res.json({ success: true, data: newVisitor })
  }
})

app.put('/api/visitors/:id/checkout', async (req, res) => {
  const { id } = req.params
  const leave_time = new Date().toISOString().slice(0, 19).replace('T', ' ')
  
  try {
    const [result] = await pool.query(
      'UPDATE visitors SET leave_time = ?, status = ? WHERE id = ?',
      [leave_time, 'left', id]
    )
    if (result.affectedRows > 0) {
      res.json({ success: true, message: '签离成功' })
    } else {
      res.status(404).json({ success: false, message: '访客不存在' })
    }
  } catch (error) {
    console.error('签离失败:', error)
    // 使用mock数据作为备用
    const visitor = mockData.visitors.find(v => v.id === parseInt(id))
    if (visitor) {
      visitor.leave_time = leave_time
      visitor.status = 'left'
      res.json({ success: true, message: '签离成功' })
    } else {
      res.status(404).json({ success: false, message: '访客不存在' })
    }
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

// 临时更新摄像头表结构和数据
app.get('/api/update-cameras', async (req, res) => {
  try {
    await pool.query('ALTER TABLE cameras ADD COLUMN IF NOT EXISTS ip_address VARCHAR(50)')
    await pool.query('ALTER TABLE cameras ADD COLUMN IF NOT EXISTS resolution VARCHAR(20) DEFAULT "1080P"')
    await pool.query('ALTER TABLE cameras ADD COLUMN IF NOT EXISTS type VARCHAR(20) DEFAULT "dome"')
    
    const ipAddresses = [
      { id: 1, ip: '192.168.1.101', resolution: '1080P', type: 'dome' },
      { id: 2, ip: '192.168.1.102', resolution: '1080P', type: 'dome' },
      { id: 3, ip: '192.168.1.103', resolution: '1080P', type: 'bullet' },
      { id: 4, ip: '192.168.1.104', resolution: '720P', type: 'bullet' },
      { id: 5, ip: '192.168.1.105', resolution: '1080P', type: 'dome' },
      { id: 6, ip: '192.168.1.106', resolution: '1080P', type: 'bullet' },
      { id: 7, ip: '192.168.1.107', resolution: '720P', type: 'dome' },
      { id: 8, ip: '192.168.1.108', resolution: '1080P', type: 'bullet' },
      { id: 9, ip: '192.168.1.109', resolution: '1080P', type: 'dome' },
      { id: 10, ip: '192.168.1.110', resolution: '1080P', type: 'bullet' }
    ]
    
    for (const item of ipAddresses) {
      await pool.query(
        'UPDATE cameras SET ip_address = ?, resolution = ?, type = ? WHERE id = ?',
        [item.ip, item.resolution, item.type, item.id]
      )
    }
    
    res.json({ success: true, message: '摄像头数据更新完成' })
  } catch (error) {
    console.error('更新摄像头数据失败:', error)
    res.status(500).json({ success: false, message: '更新失败' })
  }
})

// 监控摄像头接口
app.get('/api/cameras', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM cameras ORDER BY id')
    res.json({ success: true, data: rows, total: rows.length })
  } catch (error) {
    console.error('获取摄像头数据失败:', error)
    res.json({ success: true, data: mockData.cameras, total: mockData.cameras.length })
  }
})

app.post('/api/cameras', async (req, res) => {
  try {
    const { name, location, status, ip_address, resolution } = req.body
    const [result] = await pool.query(
      'INSERT INTO cameras (name, location, status, ip_address, resolution) VALUES (?, ?, ?, ?, ?)',
      [name, location, status || 'online', ip_address, resolution || '1080P']
    )
    res.json({ success: true, data: { id: result.insertId, name, location, status, ip_address, resolution } })
  } catch (error) {
    console.error('创建摄像头失败:', error)
    const { name, location, status, ip_address, resolution } = req.body
    const newCamera = {
      id: Date.now(),
      name,
      location,
      status: status || 'online',
      ip_address,
      resolution: resolution || '1080P',
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
    mockData.cameras.push(newCamera)
    res.json({ success: true, data: newCamera })
  }
})

app.put('/api/cameras/:id', async (req, res) => {
  const { id } = req.params
  try {
    const { name, location, status, ip_address, resolution, type } = req.body
    await pool.query(
      'UPDATE cameras SET name = ?, location = ?, status = ?, ip_address = ?, resolution = ?, type = ?, updated_at = NOW() WHERE id = ?',
      [name, location, status, ip_address, resolution, type, id]
    )
    res.json({ success: true, data: { id, name, location, status, ip_address, resolution, type } })
  } catch (error) {
    console.error('更新摄像头失败:', error)
    const { name, location, status, ip_address, resolution, type } = req.body
    const camera = mockData.cameras.find(c => c.id === parseInt(id))
    if (camera) {
      camera.name = name
      camera.location = location
      camera.status = status
      camera.ip_address = ip_address
      camera.resolution = resolution
      camera.type = type
      res.json({ success: true, data: camera })
    } else {
      res.status(404).json({ success: false, message: '摄像头不存在' })
    }
  }
})

app.delete('/api/cameras/:id', async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM cameras WHERE id = ?', [id])
    res.json({ success: true, message: '删除成功' })
  } catch (error) {
    console.error('删除摄像头失败:', error)
    const index = mockData.cameras.findIndex(c => c.id === parseInt(id))
    if (index !== -1) {
      mockData.cameras.splice(index, 1)
      res.json({ success: true, message: '删除成功' })
    } else {
      res.status(404).json({ success: false, message: '摄像头不存在' })
    }
  }
})

// 人员管理接口
app.get('/api/personnel', (req, res) => {
  res.json({ success: true, data: mockData.personnel, total: mockData.personnel.length })
})

app.post('/api/personnel', (req, res) => {
  const { name, number, type, department, class_name, phone, email, id_card, status } = req.body
  const newPerson = {
    id: Date.now(),
    name,
    number,
    type: type || 'student',
    department,
    class_name: class_name || '',
    phone,
    email,
    id_card,
    status: status || 'active',
    created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
  mockData.personnel.push(newPerson)
  res.json({ success: true, data: newPerson })
})

app.put('/api/personnel/:id', (req, res) => {
  const { id } = req.params
  const { name, department, class_name, phone, email, status } = req.body
  
  const person = mockData.personnel.find(p => p.id === parseInt(id))
  if (person) {
    person.name = name
    person.department = department
    person.class_name = class_name
    person.phone = phone
    person.email = email
    person.status = status
    res.json({ success: true, data: person })
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

// 部门管理接口
app.get('/api/departments', (req, res) => {
  res.json({ success: true, data: mockData.departments, total: mockData.departments.length })
})

app.post('/api/departments', (req, res) => {
  const { name, dean, phone, student_count, teacher_count, description } = req.body
  const newDept = {
    id: Date.now(),
    name,
    dean: dean || '',
    phone: phone || '',
    student_count: parseInt(student_count) || 0,
    teacher_count: parseInt(teacher_count) || 0,
    description: description || '',
    created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
  mockData.departments.push(newDept)
  res.json({ success: true, data: newDept })
})

app.put('/api/departments/:id', (req, res) => {
  const { id } = req.params
  const { name, dean, phone, student_count, teacher_count, description } = req.body
  
  const dept = mockData.departments.find(d => d.id === parseInt(id))
  if (dept) {
    dept.name = name
    dept.dean = dean
    dept.phone = phone
    dept.student_count = parseInt(student_count) || 0
    dept.teacher_count = parseInt(teacher_count) || 0
    dept.description = description
    res.json({ success: true, data: dept })
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

// 班级管理接口
app.get('/api/classes', (req, res) => {
  res.json({ success: true, data: mockData.classes, total: mockData.classes.length })
})

app.post('/api/classes', (req, res) => {
  const { name, department, teacher } = req.body
  const newClass = {
    id: Date.now(),
    name,
    department: department || '',
    teacher: teacher || '',
    student_count: 0,
    created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
  mockData.classes.push(newClass)
  res.json({ success: true, data: newClass })
})

app.put('/api/classes/:id', (req, res) => {
  const { id } = req.params
  const { name, department, teacher } = req.body
  
  const cls = mockData.classes.find(c => c.id === parseInt(id))
  if (cls) {
    cls.name = name
    cls.department = department
    cls.teacher = teacher
    res.json({ success: true, data: cls })
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

// 宿舍管理接口
app.get('/api/dormitories', (req, res) => {
  res.json({ success: true, data: mockData.dormitories, total: mockData.dormitories.length })
})

app.post('/api/dormitories', (req, res) => {
  const { name, location, room_count, capacity, current_count, status } = req.body
  const newDorm = {
    id: Date.now(),
    name,
    location,
    room_count: parseInt(room_count) || 0,
    capacity: parseInt(capacity) || 0,
    current_count: parseInt(current_count) || 0,
    status: status || 'normal',
    created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
  mockData.dormitories.push(newDorm)
  res.json({ success: true, data: newDorm })
})

app.put('/api/dormitories/:id', (req, res) => {
  const { id } = req.params
  const { name, location, room_count, capacity, current_count, status } = req.body
  
  const dorm = mockData.dormitories.find(d => d.id === parseInt(id))
  if (dorm) {
    dorm.name = name
    dorm.location = location
    dorm.room_count = parseInt(room_count)
    dorm.capacity = parseInt(capacity)
    dorm.current_count = parseInt(current_count)
    dorm.status = status
    res.json({ success: true, data: dorm })
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

// 巡逻路线接口
app.get('/api/patrol/routes', (req, res) => {
  res.json({ success: true, data: mockData.patrolRoutes, total: mockData.patrolRoutes.length })
})

app.post('/api/patrol/routes', (req, res) => {
  const { name, description, type, checkpoints, status } = req.body
  const newRoute = {
    id: Date.now(),
    name,
    description: description || '',
    type: type || 'daily',
    checkpoints,
    status: status || 'active',
    created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
  mockData.patrolRoutes.push(newRoute)
  res.json({ success: true, data: newRoute })
})

app.put('/api/patrol/routes/:id', (req, res) => {
  const { id } = req.params
  const { name, description, type, checkpoints, status } = req.body
  
  const route = mockData.patrolRoutes.find(r => r.id === parseInt(id))
  if (route) {
    route.name = name
    route.description = description
    route.type = type
    route.checkpoints = checkpoints
    route.status = status
    res.json({ success: true, data: route })
  } else {
    res.status(404).json({ success: false, message: '巡逻路线不存在' })
  }
})

app.delete('/api/patrol/routes/:id', (req, res) => {
  const { id } = req.params
  const index = mockData.patrolRoutes.findIndex(r => r.id === parseInt(id))
  if (index !== -1) {
    mockData.patrolRoutes.splice(index, 1)
    res.json({ success: true, message: '删除成功' })
  } else {
    res.status(404).json({ success: false, message: '巡逻路线不存在' })
  }
})

// 巡逻计划接口
app.get('/api/patrol/plans', (req, res) => {
  res.json({ success: true, data: mockData.patrolPlans, total: mockData.patrolPlans.length })
})

app.post('/api/patrol/plans', (req, res) => {
  const { name, route_id, executor_name, shift_type, period, status } = req.body
  const newPlan = {
    id: Date.now(),
    name,
    route_id: parseInt(route_id),
    executor_name,
    shift_type: shift_type || 'morning',
    period: period || 'daily',
    status: status || 1,
    created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
  mockData.patrolPlans.push(newPlan)
  res.json({ success: true, data: newPlan })
})

app.put('/api/patrol/plans/:id', (req, res) => {
  const { id } = req.params
  const { name, route_id, executor_name, shift_type, period, status } = req.body
  
  const plan = mockData.patrolPlans.find(p => p.id === parseInt(id))
  if (plan) {
    plan.name = name
    plan.route_id = parseInt(route_id)
    const route = mockData.patrolRoutes.find(r => r.id === parseInt(route_id))
    if (route) {
      plan.route_name = route.name
    }
    plan.executor_name = executor_name
    plan.shift_type = shift_type
    plan.period = period
    plan.status = status
    res.json({ success: true, data: plan })
  } else {
    res.status(404).json({ success: false, message: '巡逻计划不存在' })
  }
})

app.delete('/api/patrol/plans/:id', (req, res) => {
  const { id } = req.params
  const index = mockData.patrolPlans.findIndex(p => p.id === parseInt(id))
  if (index !== -1) {
    mockData.patrolPlans.splice(index, 1)
    res.json({ success: true, message: '删除成功' })
  } else {
    res.status(404).json({ success: false, message: '巡逻计划不存在' })
  }
})

// 巡逻记录接口
app.get('/api/patrol/records', (req, res) => {
  res.json({ success: true, data: mockData.patrolRecords, total: mockData.patrolRecords.length })
})

app.post('/api/patrol/records', (req, res) => {
  const { route_id, route_name, patrol_time, completed, notes } = req.body
  const newRecord = {
    id: Date.now(),
    route_id: parseInt(route_id),
    route_name,
    patrol_time,
    completed: completed === 'true' || completed === true,
    notes: notes || '',
    created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
  mockData.patrolRecords.push(newRecord)
  res.json({ success: true, data: newRecord })
})

// 消防设施接口
app.get('/api/fire/facilities', (req, res) => {
  res.json({ success: true, data: mockData.fireFacilities, total: mockData.fireFacilities.length })
})

app.post('/api/fire/facilities', (req, res) => {
  const { name, location, type, status, last_inspection_date, next_inspection_date } = req.body
  const newFacility = {
    id: Date.now(),
    name,
    location,
    type: type || 'fire_extinguisher',
    status: status || 'normal',
    last_inspection_date,
    next_inspection_date,
    created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
  mockData.fireFacilities.push(newFacility)
  res.json({ success: true, data: newFacility })
})

app.put('/api/fire/facilities/:id', (req, res) => {
  const { id } = req.params
  const { name, location, type, status, last_inspection_date, next_inspection_date } = req.body
  
  const facility = mockData.fireFacilities.find(f => f.id === parseInt(id))
  if (facility) {
    facility.name = name
    facility.location = location
    facility.type = type
    facility.status = status
    facility.last_inspection_date = last_inspection_date
    facility.next_inspection_date = next_inspection_date
    res.json({ success: true, data: facility })
  } else {
    res.status(404).json({ success: false, message: '消防设施不存在' })
  }
})

app.delete('/api/fire/facilities/:id', (req, res) => {
  const { id } = req.params
  const index = mockData.fireFacilities.findIndex(f => f.id === parseInt(id))
  if (index !== -1) {
    mockData.fireFacilities.splice(index, 1)
    res.json({ success: true, message: '删除成功' })
  } else {
    res.status(404).json({ success: false, message: '消防设施不存在' })
  }
})

// 消防检查记录接口
app.get('/api/fire/inspections', (req, res) => {
  res.json({ success: true, data: mockData.fireInspections, total: mockData.fireInspections.length })
})

app.post('/api/fire/inspections', (req, res) => {
  const { facility_id, facility_name, inspector, inspection_time, result, notes } = req.body
  const newInspection = {
    id: Date.now(),
    facility_id: parseInt(facility_id),
    facility_name,
    inspector,
    inspection_time,
    result,
    notes: notes || '',
    created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
  mockData.fireInspections.push(newInspection)
  res.json({ success: true, data: newInspection })
})

// 用户管理接口
app.get('/api/users/admins', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, username, realname, role, phone, email, created_at FROM admins ORDER BY id')
    res.json({ success: true, data: rows })
  } catch (error) {
    console.error('获取管理员列表失败:', error)
    res.status(500).json({ success: false, message: '获取失败' })
  }
})

app.post('/api/users/admins', async (req, res) => {
  try {
    const { username, password, realname, phone, email } = req.body
    const [result] = await pool.query(
      'INSERT INTO admins (username, password, realname, phone, email) VALUES (?, ?, ?, ?, ?)',
      [username, password, realname, phone, email]
    )
    const newUser = {
      id: result.insertId,
      username,
      realname,
      phone,
      email,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
    res.json({ success: true, data: newUser, message: '创建成功' })
  } catch (error) {
    console.error('创建管理员失败:', error)
    res.status(500).json({ success: false, message: '创建失败' })
  }
})

app.put('/api/users/admins/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { username, realname, phone, email, role } = req.body
    await pool.query(
      'UPDATE admins SET username = ?, realname = ?, phone = ?, email = ?, role = ? WHERE id = ?',
      [username, realname, phone, email, role, id]
    )
    res.json({ success: true, data: { id, username, realname, phone, email, role }, message: '更新成功' })
  } catch (error) {
    console.error('更新管理员失败:', error)
    res.status(500).json({ success: false, message: '更新失败' })
  }
})

app.delete('/api/users/admins/:id', async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM admins WHERE id = ?', [id])
    res.json({ success: true, message: '删除成功' })
  } catch (error) {
    console.error('删除管理员失败:', error)
    res.status(500).json({ success: false, message: '删除失败' })
  }
})

// 角色管理接口
app.get('/api/roles', (req, res) => {
  const mockRoles = [
    { id: 1, name: '超级管理员', code: 'super_admin', description: '拥有系统最高权限', created_at: '2024-01-01 00:00:00' },
    { id: 2, name: '管理员', code: 'admin', description: '拥有系统管理权限', created_at: '2024-01-01 00:00:00' },
    { id: 3, name: '安保主管', code: 'security', description: '负责安保相关管理', created_at: '2024-01-01 00:00:00' },
    { id: 4, name: '保安', code: 'guard', description: '执行巡逻和监控任务', created_at: '2024-01-01 00:00:00' },
    { id: 5, name: '教师', code: 'teacher', description: '查看相关记录', created_at: '2024-01-01 00:00:00' }
  ]
  res.json({ success: true, data: mockRoles })
})

app.post('/api/roles', (req, res) => {
  const { name, code, description } = req.body
  const newRole = {
    id: Date.now(),
    name,
    code,
    description,
    created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
  res.json({ success: true, data: newRole, message: '添加成功' })
})

app.put('/api/roles/:id', (req, res) => {
  const { id } = req.params
  const { name, code, description } = req.body
  res.json({ success: true, data: { id, name, code, description }, message: '更新成功' })
})

app.delete('/api/roles/:id', (req, res) => {
  res.json({ success: true, message: '删除成功' })
})

// 操作日志接口
app.get('/api/logs', (req, res) => {
  const { keyword, module, page = 1, pageSize = 10 } = req.query
  
  const mockLogs = [
    { id: 1, username: 'admin', module: '用户管理', action: '新增', content: '新增用户: 测试用户', ip: '192.168.1.100', created_at: '2024-01-15 10:30:00' },
    { id: 2, username: 'admin', module: '门禁管理', action: '编辑', content: '编辑门禁点: 南门门禁', ip: '192.168.1.100', created_at: '2024-01-15 10:25:00' },
    { id: 3, username: 'security', module: '访客管理', action: '新增', content: '新增访客: 刘访客', ip: '192.168.1.101', created_at: '2024-01-15 10:20:00' },
    { id: 4, username: 'guard01', module: '监控管理', action: '查看', content: '查看监控: 正门监控', ip: '192.168.1.102', created_at: '2024-01-15 10:15:00' },
    { id: 5, username: 'admin', module: '用户管理', action: '删除', content: '删除用户: test_user', ip: '192.168.1.100', created_at: '2024-01-15 10:10:00' },
    { id: 6, username: 'teacher', module: '门禁管理', action: '查看', content: '查看通行记录', ip: '192.168.1.103', created_at: '2024-01-15 10:05:00' },
    { id: 7, username: 'security', module: '消防管理', action: '检查', content: '检查消防设施: 教学楼A灭火器', ip: '192.168.1.101', created_at: '2024-01-15 09:30:00' },
    { id: 8, username: 'guard02', module: '巡逻管理', action: '记录', content: '完成巡逻: 东门-南门路线', ip: '192.168.1.104', created_at: '2024-01-15 09:00:00' }
  ]
  
  let filtered = mockLogs
  if (keyword) {
    filtered = filtered.filter(log => log.content.includes(keyword))
  }
  if (module) {
    filtered = filtered.filter(log => log.module === module)
  }
  
  const total = filtered.length
  const start = (parseInt(page) - 1) * parseInt(pageSize)
  const end = start + parseInt(pageSize)
  const data = filtered.slice(start, end)
  
  res.json({ success: true, data, total })
})

// 隐患上报接口
app.get('/api/patrol/hazards', async (req, res) => {
  const { keyword, level, status } = req.query
  
  try {
    let query = 'SELECT id, title, location, hazard_level as level, status, reporter as reporter_name, report_time as created_at FROM patrol_hazards ORDER BY id'
    let params = []
    
    const [rows] = await pool.query(query, params)
    res.json({ success: true, data: rows, total: rows.length })
  } catch (error) {
    console.error('获取隐患列表失败:', error)
    res.status(500).json({ success: false, message: '获取失败' })
  }
})

app.post('/api/patrol/hazards', async (req, res) => {
  try {
    const { title, location, level, status } = req.body
    const [result] = await pool.query(
      'INSERT INTO patrol_hazards (title, location, hazard_level, status, reporter, report_time) VALUES (?, ?, ?, ?, ?, NOW())',
      [title, location, level || 'general', status || 'pending', '当前用户']
    )
    const newHazard = {
      id: result.insertId,
      title,
      location,
      level: level || 'general',
      status: status || 'pending',
      reporter_name: '当前用户',
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    }
    res.json({ success: true, data: newHazard, message: '创建成功' })
  } catch (error) {
    console.error('创建隐患失败:', error)
    res.status(500).json({ success: false, message: '创建失败' })
  }
})

app.put('/api/patrol/hazards/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { title, location, level, status } = req.body
    await pool.query(
      'UPDATE patrol_hazards SET title = ?, location = ?, hazard_level = ?, status = ? WHERE id = ?',
      [title, location, level, status, id]
    )
    res.json({ success: true, data: { id, title, location, level, status }, message: '更新成功' })
  } catch (error) {
    console.error('更新隐患失败:', error)
    res.status(500).json({ success: false, message: '更新失败' })
  }
})

app.delete('/api/patrol/hazards/:id', async (req, res) => {
  try {
    const { id } = req.params
    await pool.query('DELETE FROM patrol_hazards WHERE id = ?', [id])
    res.json({ success: true, message: '删除成功' })
  } catch (error) {
    console.error('删除隐患失败:', error)
    res.status(500).json({ success: false, message: '删除失败' })
  }
})

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`)
  console.log(`API文档: http://localhost:${PORT}/api`)
})