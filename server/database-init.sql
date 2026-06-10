-- 校园安全管理系统数据库完整初始化脚本
-- 运行前请确保MySQL服务已启动

CREATE DATABASE IF NOT EXISTS campus_guard DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE campus_guard;

-- 管理员用户表
CREATE TABLE IF NOT EXISTS admins (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  realname VARCHAR(50),
  phone VARCHAR(20),
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 学生表
CREATE TABLE IF NOT EXISTS students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(50) NOT NULL,
  class_name VARCHAR(100),
  department VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 教师表
CREATE TABLE IF NOT EXISTS teachers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  teacher_id VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(50) NOT NULL,
  title VARCHAR(50),
  department VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 门禁点表
CREATE TABLE IF NOT EXISTS access_points (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(200),
  type VARCHAR(50),
  status VARCHAR(20) DEFAULT 'normal',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 通行记录表
CREATE TABLE IF NOT EXISTS access_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  person_name VARCHAR(50) NOT NULL,
  person_number VARCHAR(50) NOT NULL,
  person_type VARCHAR(20) NOT NULL,
  access_point_id INT,
  access_point_name VARCHAR(100),
  access_time DATETIME NOT NULL,
  access_type VARCHAR(20),
  result VARCHAR(20),
  reason VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_access_time (access_time),
  INDEX idx_person_number (person_number)
);

-- 访客表
CREATE TABLE IF NOT EXISTS visitors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  id_card VARCHAR(50),
  phone VARCHAR(20),
  company VARCHAR(100),
  purpose VARCHAR(200),
  host_name VARCHAR(50),
  host_dept VARCHAR(100),
  visit_time DATETIME,
  leave_time DATETIME,
  access_area VARCHAR(200),
  status VARCHAR(20) DEFAULT 'reserved',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 监控点表
CREATE TABLE IF NOT EXISTS cameras (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(200),
  status VARCHAR(20) DEFAULT 'online',
  ip_address VARCHAR(50),
  resolution VARCHAR(20) DEFAULT '1080P',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 院系列表
CREATE TABLE IF NOT EXISTS departments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50),
  description VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 班级表
CREATE TABLE IF NOT EXISTS classes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  department_id INT,
  grade VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 宿舍表
CREATE TABLE IF NOT EXISTS dormitories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  building VARCHAR(50) NOT NULL,
  room_number VARCHAR(20) NOT NULL,
  floor INT,
  capacity INT,
  current_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 人员档案表
CREATE TABLE IF NOT EXISTS personnel (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  number VARCHAR(50) NOT NULL,
  type VARCHAR(20) NOT NULL,
  department VARCHAR(100),
  class_name VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  id_card VARCHAR(50),
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 告警表
CREATE TABLE IF NOT EXISTS alerts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  content TEXT,
  type VARCHAR(50) DEFAULT 'access',
  level VARCHAR(20) DEFAULT 'warning',
  location VARCHAR(200),
  status VARCHAR(20) DEFAULT 'pending',
  handle_time DATETIME,
  handle_result VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 巡检路线表
CREATE TABLE IF NOT EXISTS patrol_routes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(500),
  type VARCHAR(50) DEFAULT 'daily',
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 巡检计划表
CREATE TABLE IF NOT EXISTS patrol_plans (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  route_id INT,
  executor_name VARCHAR(50),
  shift_type VARCHAR(20) DEFAULT 'morning',
  period VARCHAR(20) DEFAULT 'daily',
  status INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (route_id) REFERENCES patrol_routes(id)
);

-- 巡检记录表
CREATE TABLE IF NOT EXISTS patrol_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  route_id INT,
  route_name VARCHAR(100),
  patrolman_id VARCHAR(50),
  patrolman_name VARCHAR(50),
  patrol_time DATETIME,
  status VARCHAR(20) DEFAULT 'normal',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (route_id) REFERENCES patrol_routes(id)
);

-- 消防设施表
CREATE TABLE IF NOT EXISTS fire_facilities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(200),
  type VARCHAR(50) DEFAULT 'fire_extinguisher',
  status VARCHAR(20) DEFAULT 'normal',
  last_inspection_date DATE,
  next_inspection_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 消防巡检记录表
CREATE TABLE IF NOT EXISTS fire_inspections (
  id INT PRIMARY KEY AUTO_INCREMENT,
  facility_id INT,
  inspector_name VARCHAR(50),
  inspection_date DATE,
  result VARCHAR(20) DEFAULT 'normal',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (facility_id) REFERENCES fire_facilities(id)
);

-- 角色表
CREATE TABLE IF NOT EXISTS roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  description VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 操作日志表
CREATE TABLE IF NOT EXISTS operation_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  username VARCHAR(50),
  action VARCHAR(100),
  module VARCHAR(50),
  detail TEXT,
  ip VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 巡检隐患表
CREATE TABLE IF NOT EXISTS patrol_hazards (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  location VARCHAR(200),
  hazard_level VARCHAR(20) DEFAULT 'medium',
  status VARCHAR(20) DEFAULT 'pending',
  reporter VARCHAR(50),
  report_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  handle_time DATETIME,
  handle_result VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 告警规则表
CREATE TABLE IF NOT EXISTS alert_rules (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50),
  `condition` TEXT,
  level VARCHAR(20) DEFAULT 'warning',
  enabled INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==================== 插入初始数据 ====================

-- 插入管理员数据
INSERT INTO admins (username, password, realname, phone, email) VALUES 
('admin', 'admin123', '系统管理员', '13800138000', 'admin@campus.cn'),
('admin2', 'admin123', '安全管理员', '13800138001', 'admin2@campus.cn')
ON DUPLICATE KEY UPDATE username=username;

-- 插入学生数据
INSERT INTO students (student_id, name, class_name, department, phone, email) VALUES 
('2021001', '张三', '2021级计算机1班', '计算机学院', '13900139001', 'zhangsan@campus.cn'),
('2021002', '李四', '2021级计算机1班', '计算机学院', '13900139002', 'lisi@campus.cn'),
('2021003', '王五', '2021级计算机2班', '计算机学院', '13900139003', 'wangwu@campus.cn'),
('2022001', '赵六', '2022级电子1班', '电子工程学院', '13900139004', 'zhaoliu@campus.cn'),
('2022002', '钱七', '2022级管理1班', '管理学院', '13900139005', 'qianqi@campus.cn')
ON DUPLICATE KEY UPDATE student_id=student_id;

-- 插入教师数据
INSERT INTO teachers (teacher_id, name, title, department, phone, email) VALUES 
('T001', '张教授', '教授', '计算机学院', '13900139010', 'zhangprof@campus.cn'),
('T002', '李老师', '副教授', '计算机学院', '13900139011', 'liteacher@campus.cn'),
('T003', '王老师', '讲师', '电子工程学院', '13900139012', 'wangteacher@campus.cn'),
('T004', '陈教授', '教授', '管理学院', '13900139013', 'chenprof@campus.cn')
ON DUPLICATE KEY UPDATE teacher_id=teacher_id;

-- 插入门禁点数据
INSERT INTO access_points (name, location, type, status) VALUES 
('正门门禁', '学校正门', 'gate', 'normal'),
('教学楼A门禁', '教学楼A栋', 'building', 'normal'),
('宿舍楼1门禁', '学生宿舍楼1栋', 'dormitory', 'normal'),
('图书馆门禁', '图书馆正门', 'library', 'normal'),
('体育馆门禁', '体育馆东门', 'gym', 'offline')
ON DUPLICATE KEY UPDATE name=name;

-- 插入门禁记录数据
INSERT INTO access_records (person_name, person_number, person_type, access_point_id, access_point_name, access_time, access_type, result, reason) VALUES 
('张三', '2021001', 'student', 1, '正门门禁', '2024-01-15 08:00:00', 'in', 'success', ''),
('李四', '2021002', 'student', 2, '教学楼A门禁', '2024-01-15 08:15:00', 'in', 'success', ''),
('张教授', 'T001', 'teacher', 2, '教学楼A门禁', '2024-01-15 08:30:00', 'in', 'success', ''),
('王五', '2021003', 'student', 1, '正门门禁', '2024-01-15 09:00:00', 'in', 'success', ''),
('张三', '2021001', 'student', 1, '正门门禁', '2024-01-15 12:00:00', 'out', 'success', ''),
('李四', '2021002', 'student', 3, '宿舍楼1门禁', '2024-01-15 12:30:00', 'out', 'success', ''),
('赵六', '2022001', 'student', 4, '图书馆门禁', '2024-01-15 14:00:00', 'in', 'success', ''),
('钱七', '2022002', 'student', 4, '图书馆门禁', '2024-01-15 14:10:00', 'in', 'success', ''),
('李老师', 'T002', 'teacher', 2, '教学楼A门禁', '2024-01-15 15:00:00', 'in', 'success', ''),
('张三', '2021001', 'student', 3, '宿舍楼1门禁', '2024-01-15 18:00:00', 'in', 'success', '');

-- 插入访客数据
INSERT INTO visitors (name, id_card, phone, company, purpose, host_name, host_dept, visit_time, leave_time, access_area, status) VALUES 
('刘访客', '320100199001011234', '13900139020', 'XX科技公司', '拜访同学', '张三', '计算机学院', '2024-01-15 10:00:00', '2024-01-15 12:00:00', '宿舍楼', 'completed'),
('陈访客', '320200198505156789', '13900139021', 'XX研究所', '学术交流', '张教授', '计算机学院', '2024-01-15 09:00:00', '2024-01-15 11:30:00', '教学楼', 'completed'),
('周访客', '310100199208204567', '13900139022', 'XX企业', '项目洽谈', '李老师', '电子工程学院', '2024-01-16 14:00:00', NULL, '教学楼', 'visiting');

-- 插入摄像头数据
INSERT INTO cameras (name, location, status) VALUES 
('正门摄像头', '正门上方', 'online'),
('教学楼A摄像头', '教学楼A大厅', 'online'),
('宿舍楼1摄像头', '宿舍楼1入口', 'online'),
('图书馆摄像头', '图书馆正门', 'offline'),
('体育馆摄像头', '体育馆东门', 'online')
ON DUPLICATE KEY UPDATE name=name;

-- 插入院系数据
INSERT INTO departments (name, code, description) VALUES 
('计算机学院', 'CS', '计算机科学与技术学院'),
('电子工程学院', 'EE', '电子信息工程学院'),
('管理学院', 'MG', '经济与管理学院'),
('外国语学院', 'FL', '外国语学院')
ON DUPLICATE KEY UPDATE name=name;

-- 插入班级数据
INSERT INTO classes (name, department_id, grade) VALUES 
('2021级计算机1班', 1, '2021'),
('2021级计算机2班', 1, '2021'),
('2022级电子1班', 2, '2022'),
('2022级管理1班', 3, '2022')
ON DUPLICATE KEY UPDATE name=name;

-- 插入宿舍数据
INSERT INTO dormitories (building, room_number, floor, capacity, current_count) VALUES 
('1号楼', '101', 1, 4, 3),
('1号楼', '102', 1, 4, 4),
('2号楼', '201', 2, 4, 2),
('2号楼', '202', 2, 4, 4)
ON DUPLICATE KEY UPDATE room_number=room_number;

-- 插入人员档案数据
INSERT INTO personnel (name, number, type, department, class_name, phone, email, id_card, status) VALUES 
('张三', '2021001', 'student', '计算机学院', '2021级计算机1班', '13900139001', 'zhangsan@campus.cn', '320100200001011234', 'active'),
('李四', '2021002', 'student', '计算机学院', '2021级计算机1班', '13900139002', 'lisi@campus.cn', '320100200002022345', 'active'),
('张教授', 'T001', 'teacher', '计算机学院', '', '13900139010', 'zhangprof@campus.cn', '320100197508123456', 'active'),
('李老师', 'T002', 'teacher', '计算机学院', '', '13900139011', 'liteacher@campus.cn', '320100198011204567', 'active'),
('管理员', 'admin', 'admin', '信息中心', '', '13800138000', 'admin@campus.cn', '320100197001011111', 'active')
ON DUPLICATE KEY UPDATE number=number;

-- 插入告警数据
INSERT INTO alerts (title, content, type, level, location, status, handle_time, handle_result) VALUES 
('南门-尾随告警', '检测到尾随行为，已自动锁定门禁', 'access', 'warning', '南门', 'pending', NULL, NULL),
('宿舍楼1-门长时间未关闭', '门已保持打开超过10分钟', 'access', 'serious', '宿舍楼1', 'pending', NULL, NULL),
('教学楼A-权限异常', '检测到异常刷卡行为', 'access', 'warning', '教学楼A', 'pending', NULL, NULL),
('东门-设备离线', '设备通信中断，请检查网络', 'device', 'info', '东门', 'pending', NULL, NULL),
('图书馆-非法闯入', '检测到未授权人员试图进入', 'access', 'serious', '图书馆', 'handled', '2024-01-15 09:15:00', '已通知安保人员处理');

-- 插入巡检路线数据
INSERT INTO patrol_routes (name, description, type, status) VALUES 
('日常巡检路线A', '正门-教学楼-图书馆-体育馆', 'daily', 'active'),
('夜间巡检路线B', '宿舍楼-体育馆-后门', 'night', 'active'),
('消防巡检路线', '各栋楼消防设施检查', 'fire', 'active')
ON DUPLICATE KEY UPDATE name=name;

-- 插入巡检计划数据
INSERT INTO patrol_plans (name, route_id, executor_name, shift_type, period, status) VALUES 
('日常巡检计划A', 1, '张教授', 'morning', 'daily', 1),
('夜间巡检计划B', 2, '李老师', 'night', 'daily', 1),
('消防巡检计划', 3, '王老师', 'morning', 'weekly', 1);

-- 插入巡检记录数据
INSERT INTO patrol_records (route_id, route_name, patrolman_id, patrolman_name, patrol_time, status, notes) VALUES 
(1, '日常巡检路线A', 'T001', '张教授', '2024-01-15 07:00:00', 'normal', '巡检完成，无异常'),
(1, '日常巡检路线A', 'T002', '李老师', '2024-01-15 08:00:00', 'normal', '巡检完成，无异常'),
(2, '夜间巡检路线B', 'T003', '王老师', '2024-01-14 22:00:00', 'abnormal', '发现体育馆后门未锁'),
(3, '消防巡检路线', 'T001', '张教授', '2024-01-15 10:00:00', 'normal', '消防设施检查完成');

-- 插入消防设施数据
INSERT INTO fire_facilities (name, location, type, status, last_inspection_date, next_inspection_date) VALUES 
('教学楼A-灭火器001', '教学楼A栋1楼', 'fire_extinguisher', 'normal', '2024-06-01', '2025-06-01'),
('教学楼A-灭火器002', '教学楼A栋2楼', 'fire_extinguisher', 'normal', '2024-06-01', '2025-06-01'),
('宿舍楼1-灭火器001', '宿舍楼1栋1楼', 'fire_extinguisher', 'expired', '2023-01-15', '2024-01-15'),
('图书馆-消火栓001', '图书馆1楼大厅', 'fire_hydrant', 'normal', '2024-01-01', '2025-01-01'),
('体育馆-灭火器001', '体育馆东门', 'fire_extinguisher', 'normal', '2024-03-01', '2025-03-01')
ON DUPLICATE KEY UPDATE name=name;

-- 插入消防巡检记录数据
INSERT INTO fire_inspections (facility_id, inspector_name, inspection_date, result, notes) VALUES 
(1, '张教授', '2024-06-01', 'normal', '检查正常'),
(2, '张教授', '2024-06-01', 'normal', '检查正常'),
(3, '李老师', '2024-01-10', 'abnormal', '灭火器已过期，需更换'),
(4, '王老师', '2024-01-01', 'normal', '检查正常'),
(5, '王老师', '2024-03-01', 'normal', '检查正常');

-- 插入角色数据
INSERT INTO roles (name, code, description) VALUES 
('管理员', 'admin', '系统管理员，拥有全部权限'),
('教师', 'teacher', '教师用户，可查看记录和部分操作'),
('学生', 'student', '学生用户，仅可查看数据大屏')
ON DUPLICATE KEY UPDATE code=code;

-- 插入巡检隐患数据
INSERT INTO patrol_hazards (title, description, location, hazard_level, status, reporter, report_time) VALUES 
('1号楼消防通道堵塞', '1号楼消防通道被杂物堵塞，存在安全隐患', '1号楼', 'high', 'pending', '张教授', '2024-01-15 09:00:00'),
('图书馆电源插座损坏', '图书馆2楼多个电源插座损坏', '图书馆2楼', 'medium', 'handled', '李老师', '2024-01-14 14:30:00');

-- 插入告警规则数据
INSERT INTO alert_rules (name, type, `condition`, level, enabled) VALUES 
('尾随检测', 'access', '检测到同一门禁点5分钟内连续刷卡超过3人', 'warning', 1),
('非法入侵检测', 'access', '检测到未授权时间段有人刷卡', 'serious', 1),
('设备离线告警', 'device', '设备离线超过10分钟', 'info', 1);

-- 插入操作日志示例
INSERT INTO operation_logs (user_id, username, action, module, detail, ip) VALUES 
(1, 'admin', '登录系统', 'auth', '管理员登录成功', '192.168.1.100'),
(1, 'admin', '添加门禁点', 'access', '添加了"正门门禁"门禁点', '192.168.1.100'),
(1, 'admin', '处理告警', 'alert', '处理了"南门-尾随告警"', '192.168.1.100');

SELECT '数据库初始化完成！所有表和数据已创建成功。' AS message;
