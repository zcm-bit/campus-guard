-- 查看所有重复记录
SELECT title, location, COUNT(*) as count 
FROM alerts 
GROUP BY title, location 
HAVING COUNT(*) > 1;

-- 删除重复记录，保留每个组合中ID最小的记录
-- 教学楼A-权限异常：保留id=3，删除id=7
DELETE FROM alerts WHERE id = 7;

-- 图书馆-非法闯入：保留id=9，删除id=5,6
DELETE FROM alerts WHERE id IN (5, 6);

-- 宿舍楼1-门长时间未关闭：保留id=2，删除id=10
DELETE FROM alerts WHERE id = 10;

-- 东门-设备离线：保留id=4（handling状态），检查是否有重复
DELETE FROM alerts WHERE id = 8;

-- 删除南门-尾随告警的重复（保留id=1）
DELETE FROM alerts WHERE id = (SELECT id FROM alerts WHERE title = '南门-尾随告警' AND id != 1 LIMIT 1);

-- 查看清理后的结果
SELECT id, title, type, level, location, status FROM alerts ORDER BY id;

-- 统计待处理告警数量
SELECT COUNT(*) as pending_count FROM alerts WHERE status = 'pending' OR status = 'handling';
