-- 查看重复数据
SELECT title, location, COUNT(*) as count 
FROM alerts 
GROUP BY title, location 
HAVING COUNT(*) > 1;

-- 删除重复数据，保留每个重复组中ID最小的记录
DELETE a1 
FROM alerts a1
JOIN alerts a2 
ON a1.title = a2.title 
AND a1.location = a2.location 
AND a1.id > a2.id;

-- 查看清理后的结果
SELECT id, title, location, status, created_at FROM alerts ORDER BY id;
