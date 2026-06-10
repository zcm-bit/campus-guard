-- ========================================
-- 数据库缺失表结构和数据
-- ========================================

USE campus_guard;

-- ==================== 缺失表结构 ====================
-- 1. 告警表
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

-- 2. 巡检路线表
CREATE TABLE IF NOT EXISTS patrol_routes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(500),
  type VARCHAR(50) DEFAULT 'daily',
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. 巡检计划表
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

-- 4. 巡检记录表
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

-- 5. 消防设施表
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

-- 6. 消防巡检记录表
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

-- 7. 角色表
CREATE TABLE IF NOT EXISTS roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  description VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 8. 巡检隐患表
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

-- 9. 告警规则表
CREATE TABLE IF NOT EXISTS alert_rules (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50),
  condition TEXT,
  level VARCHAR(20) DEFAULT 'warning',
  enabled INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==================== 缺失表初始数据 ====================

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
('消防巡检路线', '各栋楼消防设施检查', 'fire', 'active');

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
('体育馆-灭火器001', '体育馆东门', 'fire_extinguisher', 'normal', '2024-03-01', '2025-03-01');

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
('学生', 'student', '学生用户，仅可查看数据大屏');

-- 插入巡检隐患数据
INSERT INTO patrol_hazards (title, description, location, hazard_level, status, reporter, report_time) VALUES 
('1号楼消防通道堵塞', '1号楼消防通道被杂物堵塞，存在安全隐患', '1号楼', 'high', 'pending', '张教授', '2024-01-15 09:00:00'),
('图书馆电源插座损坏', '图书馆2楼多个电源插座损坏', '图书馆2楼', 'medium', 'handled', '李老师', '2024-01-14 14:30:00');

-- 插入告警规则数据
INSERT INTO alert_rules (name, type, `condition`, level, enabled) VALUES 
('尾随检测', 'access', '检测到同一门禁点5分钟内连续刷卡超过3人', 'warning', 1),
('非法入侵检测', 'access', '检测到未授权时间段有人刷卡', 'serious', 1),
('设备离线告警', 'device', '设备离线超过10分钟', 'info', 1);
-- 1. 告警表
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

-- 2. 巡检路线表
CREATE TABLE IF NOT EXISTS patrol_routes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(500),
  type VARCHAR(50) DEFAULT 'daily',
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. 巡检计划表
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

-- 4. 巡检记录表
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

-- 5. 消防设施表
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

-- 6. 消防巡检记录表
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

-- 7. 角色表
CREATE TABLE IF NOT EXISTS roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  description VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 8. 巡检隐患表
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

-- 9. 告警规则表
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

-- ==================== 缺失表初始数据 ====================

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
('消防巡检路线', '各栋楼消防设施检查', 'fire', 'active');

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
('体育馆-灭火器001', '体育馆东门', 'fire_extinguisher', 'normal', '2024-03-01', '2025-03-01');

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
('学生', 'student', '学生用户，仅可查看数据大屏');

-- 插入巡检隐患数据
INSERT INTO patrol_hazards (title, description, location, hazard_level, status, reporter, report_time) VALUES 
('1号楼消防通道堵塞', '1号楼消防通道被杂物堵塞，存在安全隐患', '1号楼', 'high', 'pending', '张教授', '2024-01-15 09:00:00'),
('图书馆电源插座损坏', '图书馆2楼多个电源插座损坏', '图书馆2楼', 'medium', 'handled', '李老师', '2024-01-14 14:30:00');

-- 插入告警规则数据
INSERT INTO alert_rules (name, type, `condition`, level, enabled) VALUES 
('尾随检测', 'access', '检测到同一门禁点5分钟内连续刷卡超过3人', 'warning', 1),
('非法入侵检测', 'access', '检测到未授权时间段有人刷卡', 'serious', 1),
('设备离线告警', 'device', '设备离线超过10分钟', 'info', 1);

SELECT '缺失表创建和数据插入完成！' AS message;
