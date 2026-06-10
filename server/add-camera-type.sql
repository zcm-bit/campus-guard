-- 添加类型字段到摄像头表（先检查是否已存在）
SELECT COUNT(*) INTO @exist FROM INFORMATION_SCHEMA.COLUMNS 
WHERE table_schema = 'campus_guard' AND table_name = 'cameras' AND column_name = 'type';

-- 如果不存在则添加字段
SET @sql = IF(@exist = 0, 'ALTER TABLE cameras ADD COLUMN type VARCHAR(20) DEFAULT "dome"', 'SELECT "字段已存在"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 更新所有摄像头的类型数据
UPDATE cameras SET type = 'dome' WHERE id = 1;   -- 正门摄像头 -> 球机
UPDATE cameras SET type = 'dome' WHERE id = 2;   -- 教学楼A摄像头 -> 球机
UPDATE cameras SET type = 'bullet' WHERE id = 3; -- 教学楼A摄像头 -> 枪机
UPDATE cameras SET type = 'bullet' WHERE id = 4; -- 宿舍楼1摄像头 -> 枪机
UPDATE cameras SET type = 'dome' WHERE id = 5;   -- 图书馆摄像头 -> 球机
UPDATE cameras SET type = 'dome' WHERE id = 6;   -- 图书馆摄像头 -> 球机
UPDATE cameras SET type = 'bullet' WHERE id = 7; -- 体育馆摄像头 -> 枪机
UPDATE cameras SET type = 'bullet' WHERE id = 8; -- 正门摄像头 -> 枪机
UPDATE cameras SET type = 'dome' WHERE id = 9;   -- 教学楼A摄像头 -> 球机
UPDATE cameras SET type = 'dome' WHERE id = 10;  -- 宿舍楼1摄像头 -> 球机

-- 查看更新结果
SELECT id, name, type, ip_address FROM cameras;
