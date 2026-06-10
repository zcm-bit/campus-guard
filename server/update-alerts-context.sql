-- 更新门禁告警的 context 字段
UPDATE alerts SET context = '检测到门禁设备离线，已自动发送通知' WHERE title = '东门-设备离线';
UPDATE alerts SET context = '检测到异常刷卡行为，请核实身份' WHERE title = '教学楼A-权限异常';
UPDATE alerts SET context = '检测到非法闯入，已触发警报' WHERE title = '教学楼A-非法闯入';
UPDATE alerts SET context = '检测到未授权人员试图进入' WHERE title = '图书馆-非法闯入';
UPDATE alerts SET context = '门开启时间过长，请及时关闭' WHERE title = '宿舍楼1-门长时间未关闭';
UPDATE alerts SET context = '检测到尾随行为，请加强监控' WHERE title = '南门-尾随告警';
UPDATE alerts SET context = '门禁读卡器故障，需要维修' WHERE title = '西门-设备故障';
UPDATE alerts SET context = '门禁权限已变更，请确认' WHERE title = '实验楼-权限变更';
UPDATE alerts SET context = '体育馆门禁设备离线' WHERE title = '体育馆-设备离线';
UPDATE alerts SET context = '检测到无效卡片刷卡' WHERE title = '行政楼-非法刷卡';

-- 查看更新结果
SELECT id, title, context FROM alerts ORDER BY id;
