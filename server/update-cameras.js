const mysql = require('mysql')

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '1314520xh',
  database: 'campus_guard',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000
})

async function updateCamerasTable() {
  try {
    console.log('正在添加缺失的字段...')
    
    // 添加ip_address字段
    await pool.query('ALTER TABLE cameras ADD COLUMN IF NOT EXISTS ip_address VARCHAR(50)')
    console.log('已添加 ip_address 字段')
    
    // 添加resolution字段
    await pool.query('ALTER TABLE cameras ADD COLUMN IF NOT EXISTS resolution VARCHAR(20) DEFAULT "1080P"')
    console.log('已添加 resolution 字段')
    
    console.log('\n正在更新摄像头IP地址...')
    
    // 更新摄像头数据
    const ipAddresses = [
      { id: 1, ip: '192.168.1.101', resolution: '1080P' },
      { id: 2, ip: '192.168.1.102', resolution: '1080P' },
      { id: 3, ip: '192.168.1.103', resolution: '1080P' },
      { id: 4, ip: '192.168.1.104', resolution: '720P' },
      { id: 5, ip: '192.168.1.105', resolution: '1080P' },
      { id: 6, ip: '192.168.1.106', resolution: '1080P' },
      { id: 7, ip: '192.168.1.107', resolution: '720P' },
      { id: 8, ip: '192.168.1.108', resolution: '1080P' },
      { id: 9, ip: '192.168.1.109', resolution: '1080P' },
      { id: 10, ip: '192.168.1.110', resolution: '1080P' }
    ]
    
    for (const item of ipAddresses) {
      await pool.query(
        'UPDATE cameras SET ip_address = ?, resolution = ? WHERE id = ?',
        [item.ip, item.resolution, item.id]
      )
      console.log(`已更新摄像头 ${item.id}: ${item.ip}`)
    }
    
    console.log('\n操作完成！')
    process.exit(0)
  } catch (error) {
    console.error('操作失败:', error)
    process.exit(1)
  }
}

updateCamerasTable()