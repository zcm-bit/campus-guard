-- 为学生表添加密码字段
SELECT COUNT(*) INTO @studentPwdExist FROM INFORMATION_SCHEMA.COLUMNS 
WHERE table_schema = 'campus_guard' AND table_name = 'students' AND column_name = 'password';
SET @sql = IF(@studentPwdExist = 0, 'ALTER TABLE students ADD COLUMN password VARCHAR(100) DEFAULT "123456"', 'SELECT "学生表密码字段已存在"');
PREPARE stmt FROM @sql;
EXECUTE stmt;

-- 为教师表添加密码字段
SELECT COUNT(*) INTO @teacherPwdExist FROM INFORMATION_SCHEMA.COLUMNS 
WHERE table_schema = 'campus_guard' AND table_name = 'teachers' AND column_name = 'password';
SET @sql = IF(@teacherPwdExist = 0, 'ALTER TABLE teachers ADD COLUMN password VARCHAR(100) DEFAULT "123456"', 'SELECT "教师表密码字段已存在"');
PREPARE stmt FROM @sql;
EXECUTE stmt;

-- 更新学生密码
UPDATE students SET password = '123456' WHERE password IS NULL OR password = '';

-- 更新教师密码
UPDATE teachers SET password = '123456' WHERE password IS NULL OR password = '';

-- 查询验证
SELECT '学生表' as table_name, COUNT(*) as count FROM students;
SELECT '教师表' as table_name, COUNT(*) as count FROM teachers;
