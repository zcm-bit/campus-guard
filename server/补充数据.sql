-- ========================================
-- 补充已存在表的测试数据
-- ========================================

USE campus_guard;

-- 补充通行记录数据（如果不存在）
INSERT IGNORE INTO access_records (person_name, person_number, person_type, access_point_id, access_point_name, access_time, access_type, result, reason) VALUES 
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

-- 补充访客数据（如果不存在）
INSERT IGNORE INTO visitors (name, id_card, phone, company, purpose, host_name, host_dept, visit_time, leave_time, access_area, status) VALUES 
('刘访客', '320100199001011234', '13900139020', 'XX科技公司', '拜访同学', '张三', '计算机学院', '2024-01-15 10:00:00', '2024-01-15 12:00:00', '宿舍楼', 'completed'),
('陈访客', '320200198505156789', '13900139021', 'XX研究所', '学术交流', '张教授', '计算机学院', '2024-01-15 09:00:00', '2024-01-15 11:30:00', '教学楼', 'completed'),
('周访客', '310100199208204567', '13900139022', 'XX企业', '项目洽谈', '李老师', '电子工程学院', '2024-01-16 14:00:00', NULL, '教学楼', 'visiting');

-- 补充人员档案数据（如果不存在）
INSERT IGNORE INTO personnel (name, number, type, department, class_name, phone, email, id_card, status) VALUES 
('张三', '2021001', 'student', '计算机学院', '2021级计算机1班', '13900139001', 'zhangsan@campus.cn', '320100200001011234', 'active'),
('李四', '2021002', 'student', '计算机学院', '2021级计算机1班', '13900139002', 'lisi@campus.cn', '320100200002022345', 'active'),
('王五', '2021003', 'student', '计算机学院', '2021级计算机2班', '13900139003', 'wangwu@campus.cn', '320100200003033456', 'active'),
('赵六', '2022001', 'student', '电子工程学院', '2022级电子1班', '13900139004', 'zhaoliu@campus.cn', '320100200101014567', 'active'),
('钱七', '2022002', 'student', '管理学院', '2022级管理1班', '13900139005', 'qianqi@campus.cn', '320100200102025678', 'active'),
('张教授', 'T001', 'teacher', '计算机学院', '', '13900139010', 'zhangprof@campus.cn', '320100197508123456', 'active'),
('李老师', 'T002', 'teacher', '计算机学院', '', '13900139011', 'liteacher@campus.cn', '320100198011204567', 'active'),
('王老师', 'T003', 'teacher', '电子工程学院', '', '13900139012', 'wangteacher@campus.cn', '320100198205155678', 'active'),
('管理员', 'admin', 'admin', '信息中心', '', '13800138000', 'admin@campus.cn', '320100197001011111', 'active');

-- 更新告警表的时间格式
UPDATE alerts SET created_at = '2024-01-15 09:00:00' WHERE id = 1;
UPDATE alerts SET created_at = '2024-01-15 09:10:00' WHERE id = 2;
UPDATE alerts SET created_at = '2024-01-15 09:20:00' WHERE id = 3;
UPDATE alerts SET created_at = '2024-01-15 09:30:00' WHERE id = 4;
UPDATE alerts SET created_at = '2024-01-15 09:15:00' WHERE id = 5;

SELECT '数据补充完成！' AS message;
