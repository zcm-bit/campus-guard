-- 校园安全管理系统数据库
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

-- 插入默认管理员
INSERT INTO admins (username, password, realname, phone, email) VALUES 
('admin', '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE/sLenFcLigBC', '系统管理员', '13800138000', 'admin@campus.cn')
ON DUPLICATE KEY UPDATE username=username;

-- 插入默认门禁点
INSERT INTO access_points (name, location, type, status) VALUES 
('南门', '学校南侧主入口', 'gate', 'normal'),
('东门', '学校东侧', 'gate', 'normal'),
('宿舍楼1', '1号宿舍楼入口', 'building', 'normal'),
('教学楼A', 'A教学楼大厅', 'building', 'normal')
ON DUPLICATE KEY UPDATE name=name;

-- 插入默认监控点
INSERT INTO cameras (name, location, status) VALUES 
('监控点1-南门', '南门入口', 'online'),
('监控点2-东门', '东门入口', 'online'),
('监控点3-操场', '操场看台', 'online'),
('监控点4-图书馆', '图书馆大厅', 'online')
ON DUPLICATE KEY UPDATE name=name;

-- 插入默认部门
INSERT INTO departments (name, code, description) VALUES 
('计算机学院', 'CS', '计算机科学与技术学院'),
('信息工程学院', 'IE', '信息与通信工程学院'),
('机械工程学院', 'ME', '机械与动力工程学院'),
('经济管理学院', 'EM', '经济与管理学院')
ON DUPLICATE KEY UPDATE name=name;
