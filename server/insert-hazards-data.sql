-- 插入巡检隐患数据
INSERT INTO patrol_hazards (title, description, location, hazard_level, status, reporter, report_time) VALUES 
('教学楼A楼道灯损坏', '教学楼A-3楼多个楼道灯损坏', '教学楼A-3楼', 'general', 'pending', '张保安', '2024-01-15 14:30:00'),
('宿舍楼1消防通道堵塞', '宿舍楼1-1楼消防通道被杂物堵塞', '宿舍楼1-1楼', 'high', 'handling', '李保安', '2024-01-15 14:00:00'),
('图书馆后门未锁', '图书馆后门夜间未上锁', '图书馆', 'medium', 'resolved', '王保安', '2024-01-15 10:30:00'),
('操场围栏破损', '操场东侧围栏有破损', '操场', 'general', 'pending', '张保安', '2024-01-15 09:15:00'),
('食堂灭火器过期', '食堂部分灭火器已过期', '食堂', 'high', 'handling', '李保安', '2024-01-14 16:00:00'),
('教学楼B电梯故障', '教学楼B电梯运行异常', '教学楼B', 'high', 'resolved', '王保安', '2024-01-14 10:00:00'),
('实验楼漏水', '实验楼3楼水管漏水', '实验楼3楼', 'medium', 'pending', '张教授', '2024-01-16 08:30:00'),
('体育馆玻璃破损', '体育馆西门玻璃破损', '体育馆', 'medium', 'handling', '刘保安', '2024-01-16 11:00:00'),
('停车场照明不足', '地下停车场部分区域照明不足', '地下停车场', 'general', 'resolved', '赵保安', '2024-01-13 15:00:00'),
('行政楼门禁故障', '行政楼主门门禁刷卡不灵敏', '行政楼', 'medium', 'pending', '周保安', '2024-01-16 09:00:00');

-- 查看插入结果
SELECT id, title, location, hazard_level, status, reporter, report_time FROM patrol_hazards ORDER BY id;
