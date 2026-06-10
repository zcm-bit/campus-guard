-- 插入管理员用户数据（跳过已存在的用户）
INSERT IGNORE INTO admins (username, password, realname, phone, email) VALUES
('admin', '123456', '系统管理员', '13800138000', 'admin@campus.cn'),
('security', '123456', '安保主管', '13800138001', 'security@campus.cn'),
('guard01', '123456', '张保安', '13800138002', 'guard01@campus.cn'),
('guard02', '123456', '李保安', '13800138003', 'guard02@campus.cn'),
('guard03', '123456', '王保安', '13800138004', 'guard03@campus.cn');

-- 查看插入结果
SELECT id, username, realname, phone, email FROM admins;
