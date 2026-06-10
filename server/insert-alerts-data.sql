-- 插入门禁告警数据
INSERT INTO alerts (title, type, level, location, status, created_at) VALUES 
('东门-设备离线', '设备告警', 'info', '东门', 'pending', '2024-01-15 10:30:00'),
('教学楼A-权限异常', '门禁告警', 'warning', '教学楼A', 'pending', '2024-01-15 10:20:00'),
('教学楼A-非法闯入', '门禁告警', 'warning', '教学楼A', 'pending', '2024-01-15 10:20:00'),
('图书馆-非法闯入', '门禁告警', 'serious', '图书馆', 'pending', '2024-01-15 10:15:00'),
('宿舍楼1-门长时间未关闭', '门禁告警', 'serious', '宿舍楼1', 'pending', '2024-01-15 10:10:00'),
('南门-尾随告警', '门禁告警', 'warning', '南门', 'pending', '2024-01-15 10:00:00'),
('西门-设备故障', '设备告警', 'warning', '西门', 'handling', '2024-01-14 16:30:00'),
('实验楼-权限变更', '门禁告警', 'info', '实验楼', 'resolved', '2024-01-14 14:00:00'),
('体育馆-设备离线', '设备告警', 'info', '体育馆', 'pending', '2024-01-14 11:00:00'),
('行政楼-非法刷卡', '门禁告警', 'warning', '行政楼', 'pending', '2024-01-14 09:30:00');

-- 查看插入结果
SELECT id, title, type, level, location, status, created_at FROM alerts ORDER BY id;
