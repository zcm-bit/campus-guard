import {
  bcrypt,
  mockUsers,
  mockDepartments,
  mockAccessPoints,
  mockCameras,
  mockVisitors,
  mockAccessRecords,
  mockPatrolRoutes,
  mockHazards,
  mockFireFacilities,
  mockAlerts,
  mockOperationLogs,
  generateNewAccessRecord,
  generateNewLog,
  generateNewAlert
} from './mockData'

let currentUser = null
let realtimeInterval = null

function generateToken(user) {
  return btoa(JSON.stringify({ id: user.id, username: user.username, role: user.role }))
}

function verifyToken(token) {
  try {
    const payload = JSON.parse(atob(token))
    const user = mockUsers.find(u => u.id === payload.id)
    return user ? payload : null
  } catch {
    return null
  }
}

function paginate(data, page, pageSize) {
  const start = (page - 1) * pageSize
  const end = start + parseInt(pageSize)
  return {
    list: data.slice(start, end),
    total: data.length,
    page: parseInt(page),
    pageSize: parseInt(pageSize)
  }
}

export function setupMockApi() {
  const originalFetch = window.fetch
  
  window.fetch = async function(url, options = {}) {
    const path = url.replace(/^.*\/api\//, '')
    const method = options.method?.toUpperCase() || 'GET'
    const body = options.body ? JSON.parse(options.body) : null
    const token = options.headers?.Authorization?.replace('Bearer ', '')
    
    let response = { code: 500, message: '未知错误', data: null }
    
    if (path === 'auth/login' && method === 'POST') {
      const { username, password } = body
      const user = mockUsers.find(u => u.username === username)
      
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user)
        currentUser = user
        response = {
          code: 200,
          message: '登录成功',
          data: {
            token,
            user: { id: user.id, username: user.username, realname: user.realname, role: user.role }
          }
        }
      } else {
        response = { code: 401, message: '用户名或密码错误' }
      }
    } else if (token && verifyToken(token)) {
      const decoded = verifyToken(token)
      currentUser = mockUsers.find(u => u.id === decoded.id)
      
      if (path === 'users') {
        const page = parseInt(new URLSearchParams(url.split('?')[1]).get('page')) || 1
        const pageSize = parseInt(new URLSearchParams(url.split('?')[1]).get('pageSize')) || 10
        const result = paginate(mockUsers, page, pageSize)
        response = { code: 200, data: result.list, total: result.total }
      } else if (path === 'departments') {
        response = { code: 200, data: mockDepartments }
      } else if (path === 'access-points') {
        response = { code: 200, data: mockAccessPoints }
      } else if (path === 'access-records') {
        const page = parseInt(new URLSearchParams(url.split('?')[1]).get('page')) || 1
        const pageSize = parseInt(new URLSearchParams(url.split('?')[1]).get('pageSize')) || 10
        const result = paginate(mockAccessRecords, page, pageSize)
        response = { code: 200, data: result.list, total: result.total }
      } else if (path === 'cameras') {
        response = { code: 200, data: mockCameras }
      } else if (path === 'visitors') {
        response = { code: 200, data: mockVisitors }
      } else if (path === 'patrol-routes') {
        response = { code: 200, data: mockPatrolRoutes }
      } else if (path === 'hazards') {
        response = { code: 200, data: mockHazards }
      } else if (path === 'fire-facilities') {
        response = { code: 200, data: mockFireFacilities }
      } else if (path === 'alerts') {
        response = { code: 200, data: mockAlerts }
      } else if (path === 'logs') {
        const page = parseInt(new URLSearchParams(url.split('?')[1]).get('page')) || 1
        const pageSize = parseInt(new URLSearchParams(url.split('?')[1]).get('pageSize')) || 10
        const result = paginate(mockOperationLogs, page, pageSize)
        response = { code: 200, data: result.list, total: result.total }
      } else if (path === 'dashboard') {
        const todayAccess = mockAccessRecords.filter(r => r.access_time.startsWith(new Date().toISOString().split('T')[0])).length
        response = {
          code: 200,
          data: {
            todayAccess: todayAccess || 156,
            totalPersonnel: 3000,
            todayVisitors: mockVisitors.filter(v => v.status === 'visiting').length,
            pendingAlerts: mockAlerts.filter(a => a.status !== 'resolved').length,
            recentRecords: mockAccessRecords.slice(0, 5),
            recentAlerts: mockAlerts.slice(0, 5)
          }
        }
      } else if (path === 'stats/access') {
        const data = []
        for (let i = 6; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          data.push({
            date: date.toISOString().split('T')[0],
            student: Math.floor(Math.random() * 500) + 800,
            teacher: Math.floor(Math.random() * 100) + 200,
            staff: Math.floor(Math.random() * 50) + 100
          })
        }
        response = { code: 200, data }
      } else if (path === 'stats/visitors') {
        const data = []
        for (let i = 6; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          data.push({
            date: date.toISOString().split('T')[0],
            count: Math.floor(Math.random() * 50) + 20
          })
        }
        response = { code: 200, data }
      } else {
        response = { code: 404, message: '接口不存在' }
      }
    } else {
      response = { code: 401, message: '未授权' }
    }
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          ok: response.code === 200,
          json: () => Promise.resolve(response)
        })
      }, 200 + Math.random() * 300)
    })
  }
  
  return {
    startRealtimeUpdate(callback) {
      if (realtimeInterval) return
      
      realtimeInterval = setInterval(() => {
        if (Math.random() > 0.7) {
          generateNewAccessRecord()
        }
        if (Math.random() > 0.8) {
          generateNewLog()
        }
        if (Math.random() > 0.95) {
          generateNewAlert()
        }
        if (callback) callback()
      }, 5000)
    },
    
    stopRealtimeUpdate() {
      if (realtimeInterval) {
        clearInterval(realtimeInterval)
        realtimeInterval = null
      }
    },
    
    getCurrentUser() {
      return currentUser
    },
    
    mockUsers,
    mockAccessRecords,
    mockAlerts,
    mockOperationLogs
  }
}
