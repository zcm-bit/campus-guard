import request from '@/utils/request'

export const authApi = {
  login: (data) => request.post('/api/auth/login', data),
  logout: () => request.post('/api/auth/logout'),
  getCurrentUser: () => request.get('/api/auth/current')
}

export const userApi = {
  getList: (params) => request.get('/api/users/admins', { params }),
  getById: (id) => request.get(`/api/users/admins/${id}`),
  create: (data) => request.post('/api/users/admins', data),
  update: (id, data) => request.put(`/api/users/admins/${id}`, data),
  delete: (id) => request.delete(`/api/users/admins/${id}`),
  resetPassword: (id, data) => request.put(`/api/users/admins/${id}/password`, data)
}

export const departmentApi = {
  getList: (params) => request.get('/api/departments', { params }),
  getById: (id) => request.get(`/api/departments/${id}`),
  create: (data) => request.post('/api/departments', data),
  update: (id, data) => request.put(`/api/departments/${id}`, data),
  delete: (id) => request.delete(`/api/departments/${id}`)
}

export const classApi = {
  getList: (params) => request.get('/api/classes', { params }),
  getById: (id) => request.get(`/api/classes/${id}`),
  create: (data) => request.post('/api/classes', data),
  update: (id, data) => request.put(`/api/classes/${id}`, data),
  delete: (id) => request.delete(`/api/classes/${id}`)
}

export const dormitoryApi = {
  getList: (params) => request.get('/api/dormitories', { params }),
  getById: (id) => request.get(`/api/dormitories/${id}`),
  create: (data) => request.post('/api/dormitories', data),
  update: (id, data) => request.put(`/api/dormitories/${id}`, data),
  delete: (id) => request.delete(`/api/dormitories/${id}`)
}

export const personnelApi = {
  getList: (params) => request.get('/api/personnel', { params }),
  getById: (id) => request.get(`/api/personnel/${id}`),
  create: (data) => request.post('/api/personnel', data),
  update: (id, data) => request.put(`/api/personnel/${id}`, data),
  delete: (id) => request.delete(`/api/personnel/${id}`)
}

export const accessPointApi = {
  getList: (params) => request.get('/api/access/points', { params }),
  getById: (id) => request.get(`/api/access/points/${id}`),
  create: (data) => request.post('/api/access/points', data),
  update: (id, data) => request.put(`/api/access/points/${id}`, data),
  delete: (id) => request.delete(`/api/access/points/${id}`)
}

export const accessRecordApi = {
  getList: (params) => request.get('/api/access/records', { params }),
  create: (data) => request.post('/api/access/records', data),
  delete: (id) => request.delete(`/api/access/records/${id}`)
}

export const visitorApi = {
  getList: (params) => request.get('/api/visitors', { params }),
  getById: (id) => request.get(`/api/visitors/${id}`),
  create: (data) => request.post('/api/visitors', data),
  update: (id, data) => request.put(`/api/visitors/${id}`, data),
  checkout: (id) => request.put(`/api/visitors/${id}/checkout`),
  delete: (id) => request.delete(`/api/visitors/${id}`)
}

export const cameraApi = {
  getList: (params) => request.get('/api/cameras', { params }),
  getById: (id) => request.get(`/api/cameras/${id}`),
  create: (data) => request.post('/api/cameras', data),
  update: (id, data) => request.put(`/api/cameras/${id}`, data),
  delete: (id) => request.delete(`/api/cameras/${id}`)
}

export const patrolRouteApi = {
  getList: (params) => request.get('/api/patrol/routes', { params }),
  getById: (id) => request.get(`/api/patrol/routes/${id}`),
  create: (data) => request.post('/api/patrol/routes', data),
  update: (id, data) => request.put(`/api/patrol/routes/${id}`, data),
  delete: (id) => request.delete(`/api/patrol/routes/${id}`)
}

export const patrolPlanApi = {
  getList: (params) => request.get('/api/patrol/plans', { params }),
  getById: (id) => request.get(`/api/patrol/plans/${id}`),
  create: (data) => request.post('/api/patrol/plans', data),
  update: (id, data) => request.put(`/api/patrol/plans/${id}`, data),
  delete: (id) => request.delete(`/api/patrol/plans/${id}`)
}

export const patrolRecordApi = {
  getList: (params) => request.get('/api/patrol/records', { params }),
  create: (data) => request.post('/api/patrol/records', data),
  delete: (id) => request.delete(`/api/patrol/records/${id}`)
}

export const hazardApi = {
  getList: (params) => request.get('/api/patrol/hazards', { params }),
  getById: (id) => request.get(`/api/patrol/hazards/${id}`),
  create: (data) => request.post('/api/patrol/hazards', data),
  update: (id, data) => request.put(`/api/patrol/hazards/${id}`, data)
}

export const fireFacilityApi = {
  getList: (params) => request.get('/api/fire/facilities', { params }),
  getById: (id) => request.get(`/api/fire/facilities/${id}`),
  create: (data) => request.post('/api/fire/facilities', data),
  update: (id, data) => request.put(`/api/fire/facilities/${id}`, data),
  delete: (id) => request.delete(`/api/fire/facilities/${id}`)
}

export const fireInspectionApi = {
  getList: (params) => request.get('/api/fire/inspections', { params }),
  create: (data) => request.post('/api/fire/inspections', data),
  delete: (id) => request.delete(`/api/fire/inspections/${id}`)
}

export const alertApi = {
  getList: (params) => request.get('/api/alerts', { params }),
  getById: (id) => request.get(`/api/alerts/${id}`),
  handle: (id, data) => request.put(`/api/alerts/${id}/process`, data),
  getStats: () => request.get('/api/alerts/pending-count')
}

export const alertRuleApi = {
  getList: (params) => request.get('/api/alert-rules', { params }),
  getById: (id) => request.get(`/api/alert-rules/${id}`),
  create: (data) => request.post('/api/alert-rules', data),
  update: (id, data) => request.put(`/api/alert-rules/${id}`, data),
  delete: (id) => request.delete(`/api/alert-rules/${id}`)
}

export const logApi = {
  getList: (params) => request.get('/api/logs', { params })
}

export const dashboardApi = {
  getData: () => request.get('/api/stats/dashboard'),
  getRecentRecords: () => request.get('/api/stats/recent-records'),
  getAccessTrend: () => request.get('/api/stats/access-trend')
}

export const statsApi = {
  getAccessStats: (params) => request.get('/api/stats/access', { params }),
  getVisitorStats: (params) => request.get('/api/stats/visitor', { params }),
  getAlertStats: (params) => request.get('/api/stats/alert', { params })
}

export const roleApi = {
  getList: (params) => request.get('/api/roles', { params }),
  getById: (id) => request.get(`/api/roles/${id}`),
  create: (data) => request.post('/api/roles', data),
  update: (id, data) => request.put(`/api/roles/${id}`, data),
  delete: (id) => request.delete(`/api/roles/${id}`)
}
