-- 添加 role 字段到 admins 表
SELECT COUNT(*) INTO @exist FROM INFORMATION_SCHEMA.COLUMNS 
WHERE table_schema = 'campus_guard' AND table_name = 'admins' AND column_name = 'role';

SET @sql = IF(@exist = 0, 'ALTER TABLE admins ADD COLUMN role VARCHAR(50) DEFAULT "admin"', 'SELECT "字段已存在"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 更新现有管理员的角色
UPDATE admins SET role = 'super_admin' WHERE username = 'admin';
UPDATE admins SET role = 'admin' WHERE username = 'admin2';
UPDATE admins SET role = 'security' WHERE username = 'security';
UPDATE admins SET role = 'guard' WHERE username = 'guard01';
UPDATE admins SET role = 'guard' WHERE username = 'guard02';
UPDATE admins SET role = 'guard' WHERE username = 'guard03';

-- 查看结果
SELECT id, username, realname, role FROM admins;
