-- 检查并添加 handle_time 字段
SELECT COUNT(*) INTO @exist FROM INFORMATION_SCHEMA.COLUMNS 
WHERE table_schema = 'campus_guard' AND table_name = 'alerts' AND column_name = 'handle_time';

SET @sql = IF(@exist = 0, 'ALTER TABLE alerts ADD COLUMN handle_time DATETIME', 'SELECT "字段已存在"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 查看表结构
DESCRIBE alerts;
