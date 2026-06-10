-- 添加缺失的字段
ALTER TABLE cameras ADD COLUMN IF NOT EXISTS ip_address VARCHAR(50);
ALTER TABLE cameras ADD COLUMN IF NOT EXISTS resolution VARCHAR(20) DEFAULT '1080P';

-- 更新摄像头IP地址数据
UPDATE cameras SET ip_address = '192.168.1.101', resolution = '1080P' WHERE id = 1;
UPDATE cameras SET ip_address = '192.168.1.102', resolution = '1080P' WHERE id = 2;
UPDATE cameras SET ip_address = '192.168.1.103', resolution = '1080P' WHERE id = 3;
UPDATE cameras SET ip_address = '192.168.1.104', resolution = '720P' WHERE id = 4;
UPDATE cameras SET ip_address = '192.168.1.105', resolution = '1080P' WHERE id = 5;
UPDATE cameras SET ip_address = '192.168.1.106', resolution = '1080P' WHERE id = 6;
UPDATE cameras SET ip_address = '192.168.1.107', resolution = '720P' WHERE id = 7;
UPDATE cameras SET ip_address = '192.168.1.108', resolution = '1080P' WHERE id = 8;
UPDATE cameras SET ip_address = '192.168.1.109', resolution = '1080P' WHERE id = 9;
UPDATE cameras SET ip_address = '192.168.1.110', resolution = '1080P' WHERE id = 10;

-- 查看更新结果
SELECT id, name, ip_address, resolution FROM cameras;
