const mysql = require('mysql2/promise')

// 尝试多种连接方式
async function initData() {
  let pool
  let dbExists = false
  
  try {
    // 尝试TCP/IP连接
    const connectionOptions = {
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 10000
    }
    
    // 首先检查数据库是否存在 - 使用TCP连接
    const checkPool = mysql.createPool({
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '1314520xh',
      ...connectionOptions
    })
    
    console.log('尝试连接MySQL服务器...')
    
    // 检查campus_guard数据库是否存在
    const [databases] = await checkPool.query('SHOW DATABASES LIKE "campus_guard"')
    dbExists = databases.length > 0
    await checkPool.end()
    
    if (!dbExists) {
      console.log('数据库campus_guard不存在，正在创建...')
      const createPool = mysql.createPool({
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '1314520xh',
        ...connectionOptions
      })
      
      await createPool.query('CREATE DATABASE IF NOT EXISTS campus_guard DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci')
      await createPool.end()
      console.log('数据库创建成功')
    }
    
    // 连接campus_guard数据库
    pool = mysql.createPool({
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '1314520xh',
      database: 'campus_guard',
      ...connectionOptions
    })
    
    // 测试连接
    const connection = await pool.getConnection()
    console.log('数据库连接成功')
    connection.release()
    
    console.log('开始初始化测试数据...')

    // 1. 插入管理员数据 (注意：密码是明文存储，生产环境应该用bcrypt加密)
    const adminData = [
      ['admin', 'admin123', '系统管理员', '13800138000', 'admin@campus.cn'],
      ['admin2', 'admin123', '安全管理员', '13800138001', 'admin2@campus.cn']
    ]
    await pool.query('INSERT IGNORE INTO admins (username, password, realname, phone, email) VALUES ?', [adminData])
    console.log('管理员数据初始化完成')

    // 2. 插入院系数据
    const departmentData = [
      ['计算机学院', 'CS', '计算机科学与技术学院'],
      ['电子工程学院', 'EE', '电子信息工程学院'],
      ['管理学院', 'MG', '经济与管理学院'],
      ['外国语学院', 'FL', '外国语学院']
    ]
    await pool.query('INSERT IGNORE INTO departments (name, code, description) VALUES ?', [departmentData])
    console.log('院系数据初始化完成')

    // 3. 插入班级数据
    const classData = [
      ['2021级计算机1班', 1, '2021'],
      ['2021级计算机2班', 1, '2021'],
      ['2022级电子1班', 2, '2022'],
      ['2022级管理1班', 3, '2022']
    ]
    await pool.query('INSERT IGNORE INTO classes (name, department_id, grade) VALUES ?', [classData])
    console.log('班级数据初始化完成')

    // 4. 插入学生数据 (匹配db.sql表结构)
    const studentData = [
      ['2021001', '张三', '2021级计算机1班', '计算机学院', '13900139001', 'zhangsan@campus.cn'],
      ['2021002', '李四', '2021级计算机1班', '计算机学院', '13900139002', 'lisi@campus.cn'],
      ['2021003', '王五', '2021级计算机2班', '计算机学院', '13900139003', 'wangwu@campus.cn'],
      ['2022001', '赵六', '2022级电子1班', '电子工程学院', '13900139004', 'zhaoliu@campus.cn'],
      ['2022002', '钱七', '2022级管理1班', '管理学院', '13900139005', 'qianqi@campus.cn']
    ]
    await pool.query('INSERT IGNORE INTO students (student_id, name, class_name, department, phone, email) VALUES ?', [studentData])
    console.log('学生数据初始化完成')

    // 5. 插入教师数据 (匹配db.sql表结构)
    const teacherData = [
      ['T001', '张教授', '教授', '计算机学院', '13900139010', 'zhangprof@campus.cn'],
      ['T002', '李老师', '副教授', '计算机学院', '13900139011', 'liteacher@campus.cn'],
      ['T003', '王老师', '讲师', '电子工程学院', '13900139012', 'wangteacher@campus.cn'],
      ['T004', '陈教授', '教授', '管理学院', '13900139013', 'chenprof@campus.cn']
    ]
    await pool.query('INSERT IGNORE INTO teachers (teacher_id, name, title, department, phone, email) VALUES ?', [teacherData])
    console.log('教师数据初始化完成')

    // 6. 插入门禁点数据
    const accessPointData = [
      ['正门门禁', '学校正门', 'gate', 'online'],
      ['教学楼A门禁', '教学楼A栋', 'building', 'online'],
      ['宿舍楼1门禁', '学生宿舍楼1栋', 'dormitory', 'online'],
      ['图书馆门禁', '图书馆正门', 'library', 'online'],
      ['体育馆门禁', '体育馆东门', 'gym', 'offline']
    ]
    await pool.query('INSERT IGNORE INTO access_points (name, location, type, status) VALUES ?', [accessPointData])
    console.log('门禁点数据初始化完成')

    // 7. 插入门禁记录数据
    const accessRecordData = [
      ['张三', '2021001', 'student', 1, '正门门禁', '2024-01-15 08:00:00', 'in', 'success', ''],
      ['李四', '2021002', 'student', 2, '教学楼A门禁', '2024-01-15 08:15:00', 'in', 'success', ''],
      ['张教授', 'T001', 'teacher', 2, '教学楼A门禁', '2024-01-15 08:30:00', 'in', 'success', ''],
      ['王五', '2021003', 'student', 1, '正门门禁', '2024-01-15 09:00:00', 'in', 'success', ''],
      ['张三', '2021001', 'student', 1, '正门门禁', '2024-01-15 12:00:00', 'out', 'success', ''],
      ['李四', '2021002', 'student', 3, '宿舍楼1门禁', '2024-01-15 12:30:00', 'out', 'success', ''],
      ['赵六', '2022001', 'student', 4, '图书馆门禁', '2024-01-15 14:00:00', 'in', 'success', ''],
      ['钱七', '2022002', 'student', 4, '图书馆门禁', '2024-01-15 14:10:00', 'in', 'success', ''],
      ['李老师', 'T002', 'teacher', 2, '教学楼A门禁', '2024-01-15 15:00:00', 'in', 'success', ''],
      ['张三', '2021001', 'student', 3, '宿舍楼1门禁', '2024-01-15 18:00:00', 'in', 'success', '']
    ]
    await pool.query('INSERT INTO access_records (person_name, person_number, person_type, access_point_id, access_point_name, access_time, access_type, result, reason) VALUES ?', [accessRecordData])
    console.log('门禁记录数据初始化完成')

    // 8. 插入访客数据 (匹配db.sql表结构)
    const visitorData = [
      ['刘访客', '320100199001011234', '13900139020', 'XX科技公司', '拜访同学', '张三', '计算机学院', '2024-01-15 10:00:00', '2024-01-15 12:00:00', '宿舍楼', 'completed'],
      ['陈访客', '320200198505156789', '13900139021', 'XX研究所', '学术交流', '张教授', '计算机学院', '2024-01-15 09:00:00', '2024-01-15 11:30:00', '教学楼', 'completed'],
      ['周访客', '310100199208204567', '13900139022', 'XX企业', '项目洽谈', '李老师', '电子工程学院', '2024-01-16 14:00:00', null, '教学楼', 'visiting']
    ]
    await pool.query('INSERT INTO visitors (name, id_card, phone, company, purpose, host_name, host_dept, visit_time, leave_time, access_area, status) VALUES ?', [visitorData])
    console.log('访客数据初始化完成')

    // 9. 插入摄像头数据 (匹配db.sql表结构)
    const cameraData = [
      ['正门摄像头', '正门上方', 'online'],
      ['教学楼A摄像头', '教学楼A大厅', 'online'],
      ['宿舍楼1摄像头', '宿舍楼1入口', 'online'],
      ['图书馆摄像头', '图书馆正门', 'offline'],
      ['体育馆摄像头', '体育馆东门', 'online']
    ]
    await pool.query('INSERT IGNORE INTO cameras (name, location, status) VALUES ?', [cameraData])
    console.log('摄像头数据初始化完成')

    // 10. 插入巡检路线数据
    const patrolRouteData = [
      ['日常巡检路线A', '正门-教学楼-图书馆-体育馆', 'daily', 'active'],
      ['夜间巡检路线B', '宿舍楼-体育馆-后门', 'night', 'active'],
      ['消防巡检路线', '各栋楼消防设施检查', 'fire', 'active']
    ]
    await pool.query('INSERT IGNORE INTO patrol_routes (name, description, type, status) VALUES ?', [patrolRouteData])
    console.log('巡检路线数据初始化完成')

    // 11. 插入巡检计划数据
    const patrolPlanData = [
      ['日常巡检计划A', 1, '张教授', 'morning', 'daily', 1],
      ['夜间巡检计划B', 2, '李老师', 'night', 'daily', 1],
      ['消防巡检计划', 3, '王老师', 'morning', 'weekly', 1]
    ]
    await pool.query('INSERT IGNORE INTO patrol_plans (name, route_id, executor_name, shift_type, period, status) VALUES ?', [patrolPlanData])
    console.log('巡检计划数据初始化完成')

    // 12. 插入巡检记录数据
    const patrolRecordData = [
      [1, '日常巡检路线A', 'T001', '张教授', '2024-01-15 07:00:00', 'normal', '巡检完成，无异常'],
      [1, '日常巡检路线A', 'T002', '李老师', '2024-01-15 08:00:00', 'normal', '巡检完成，无异常'],
      [2, '夜间巡检路线B', 'T003', '王老师', '2024-01-14 22:00:00', 'abnormal', '发现体育馆后门未锁'],
      [3, '消防巡检路线', 'T001', '张教授', '2024-01-15 10:00:00', 'normal', '消防设施检查完成']
    ]
    await pool.query('INSERT INTO patrol_records (route_id, route_name, patrolman_id, patrolman_name, patrol_time, status, notes) VALUES ?', [patrolRecordData])
    console.log('巡检记录数据初始化完成')

    // 13. 插入消防设施数据
    const fireFacilityData = [
      ['教学楼A-灭火器001', '教学楼A栋1楼', 'fire_extinguisher', 'normal', '2024-06-01', '2025-06-01'],
      ['教学楼A-灭火器002', '教学楼A栋2楼', 'fire_extinguisher', 'normal', '2024-06-01', '2025-06-01'],
      ['宿舍楼1-灭火器001', '宿舍楼1栋1楼', 'fire_extinguisher', 'expired', '2023-01-15', '2024-01-15'],
      ['图书馆-消火栓001', '图书馆1楼大厅', 'fire_hydrant', 'normal', '2024-01-01', '2025-01-01'],
      ['体育馆-灭火器001', '体育馆东门', 'fire_extinguisher', 'normal', '2024-03-01', '2025-03-01']
    ]
    await pool.query('INSERT IGNORE INTO fire_facilities (name, location, type, status, last_inspection_date, next_inspection_date) VALUES ?', [fireFacilityData])
    console.log('消防设施数据初始化完成')

    // 14. 插入消防巡检记录数据
    const fireInspectionData = [
      [1, '张教授', '2024-06-01', 'normal', '检查正常'],
      [2, '张教授', '2024-06-01', 'normal', '检查正常'],
      [3, '李老师', '2024-01-10', 'abnormal', '灭火器已过期，需更换'],
      [4, '王老师', '2024-01-01', 'normal', '检查正常'],
      [5, '王老师', '2024-03-01', 'normal', '检查正常']
    ]
    await pool.query('INSERT INTO fire_inspections (facility_id, inspector_name, inspection_date, result, notes) VALUES ?', [fireInspectionData])
    console.log('消防巡检记录数据初始化完成')

    // 15. 插入告警数据 (匹配db.sql表结构)
    const alertData = [
      ['南门-尾随告警', '检测到尾随行为，已自动锁定门禁', 'access', 'warning', '南门', 'pending', null, null],
      ['宿舍楼1-门长时间未关闭', '门已保持打开超过10分钟', 'access', 'serious', '宿舍楼1', 'pending', null, null],
      ['教学楼A-权限异常', '检测到异常刷卡行为', 'access', 'warning', '教学楼A', 'pending', null, null],
      ['东门-设备离线', '设备通信中断，请检查网络', 'device', 'info', '东门', 'pending', null, null],
      ['图书馆-非法闯入', '检测到未授权人员试图进入', 'access', 'serious', '图书馆', 'handling', '2024-01-15 09:15:00', '已通知安保人员处理']
    ]
    await pool.query('INSERT INTO alerts (title, content, type, level, location, status, handle_time, handle_result) VALUES ?', [alertData])
    console.log('告警数据初始化完成')

    // 16. 插入人员档案数据
    const personnelData = [
      ['张三', '2021001', 'student', '计算机学院', '2021级计算机1班', '13900139001', 'zhangsan@campus.cn', '320100200001011234', 'active'],
      ['李四', '2021002', 'student', '计算机学院', '2021级计算机1班', '13900139002', 'lisi@campus.cn', '320100200002022345', 'active'],
      ['张教授', 'T001', 'teacher', '计算机学院', '', '13900139010', 'zhangprof@campus.cn', '320100197508123456', 'active'],
      ['李老师', 'T002', 'teacher', '计算机学院', '', '13900139011', 'liteacher@campus.cn', '320100198011204567', 'active'],
      ['管理员', 'admin', 'admin', '信息中心', '', '13800138000', 'admin@campus.cn', '320100197001011111', 'active']
    ]
    await pool.query('INSERT IGNORE INTO personnel (name, number, type, department, class_name, phone, email, id_card, status) VALUES ?', [personnelData])
    console.log('人员档案数据初始化完成')

    // 17. 插入角色数据
    const roleData = [
      ['管理员', 'admin', '系统管理员，拥有全部权限'],
      ['教师', 'teacher', '教师用户，可查看记录和部分操作'],
      ['学生', 'student', '学生用户，仅可查看数据大屏']
    ]
    await pool.query('INSERT IGNORE INTO roles (name, code, description) VALUES ?', [roleData])
    console.log('角色数据初始化完成')

    console.log('所有测试数据初始化完成！')
    process.exit(0)
  } catch (error) {
    console.error('初始化数据失败:', error)
    process.exit(1)
  }
}

initData()