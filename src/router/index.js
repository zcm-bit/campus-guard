import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: () => import('@/components/layout/Layout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/Dashboard.vue'),
        meta: { title: '数据看板', icon: 'Odometer', roles: ['admin', 'teacher', 'student'] }
      },
      {
        path: 'system',
        name: 'System',
        meta: { title: '系统管理', icon: 'Setting', roles: ['admin'] },
        children: [
          {
            path: 'users',
            name: 'Users',
            component: () => import('@/views/system/Users.vue'),
            meta: { title: '用户管理', roles: ['admin'] }
          },
          {
            path: 'roles',
            name: 'Roles',
            component: () => import('@/views/system/Roles.vue'),
            meta: { title: '角色权限', roles: ['admin'] }
          },
          {
            path: 'logs',
            name: 'Logs',
            component: () => import('@/views/system/Logs.vue'),
            meta: { title: '操作日志', roles: ['admin'] }
          }
        ]
      },
      {
        path: 'base',
        name: 'Base',
        meta: { title: '基础信息', icon: 'OfficeBuilding', roles: ['admin'] },
        children: [
          {
            path: 'departments',
            name: 'Departments',
            component: () => import('@/views/base/Departments.vue'),
            meta: { title: '院系管理', roles: ['admin'] }
          },
          {
            path: 'classes',
            name: 'Classes',
            component: () => import('@/views/base/Classes.vue'),
            meta: { title: '班级管理', roles: ['admin'] }
          },
          {
            path: 'dormitories',
            name: 'Dormitories',
            component: () => import('@/views/base/Dormitories.vue'),
            meta: { title: '宿舍管理', roles: ['admin'] }
          },
          {
            path: 'personnel',
            name: 'Personnel',
            component: () => import('@/views/base/Personnel.vue'),
            meta: { title: '人员档案', roles: ['admin'] }
          }
        ]
      },
      {
        path: 'access',
        name: 'Access',
        meta: { title: '门禁管理', icon: 'Key', roles: ['admin', 'teacher'] },
        children: [
          {
            path: 'points',
            name: 'AccessPoints',
            component: () => import('@/views/access/AccessPoints.vue'),
            meta: { title: '门禁点管理', roles: ['admin'] }
          },
          {
            path: 'records',
            name: 'AccessRecords',
            component: () => import('@/views/access/AccessRecords.vue'),
            meta: { title: '通行记录', roles: ['admin', 'teacher'] }
          },
          {
            path: 'alerts',
            name: 'AccessAlerts',
            component: () => import('@/views/access/AccessAlerts.vue'),
            meta: { title: '门禁告警', roles: ['admin'] }
          }
        ]
      },
      {
        path: 'visitor',
        name: 'Visitor',
        meta: { title: '访客管理', icon: 'User', roles: ['admin', 'teacher'] },
        children: [
          {
            path: 'list',
            name: 'VisitorList',
            component: () => import('@/views/visitor/VisitorList.vue'),
            meta: { title: '访客列表', roles: ['admin', 'teacher'] }
          },
          {
            path: 'register',
            name: 'VisitorRegister',
            component: () => import('@/views/visitor/VisitorRegister.vue'),
            meta: { title: '访客登记', roles: ['admin'] }
          }
        ]
      },
      {
        path: 'camera',
        name: 'Camera',
        meta: { title: '视频监控', icon: 'VideoCamera', roles: ['admin', 'teacher'] },
        children: [
          {
            path: 'list',
            name: 'CameraList',
            component: () => import('@/views/monitor/CameraList.vue'),
            meta: { title: '监控点管理', roles: ['admin'] }
          },
          {
            path: 'preview',
            name: 'CameraPreview',
            component: () => import('@/views/monitor/CameraPreview.vue'),
            meta: { title: '实时预览', roles: ['admin', 'teacher'] }
          }
        ]
      },
      {
        path: 'patrol',
        name: 'Patrol',
        meta: { title: '巡检管理', icon: 'Guide', roles: ['admin'] },
        children: [
          {
            path: 'routes',
            name: 'PatrolRoutes',
            component: () => import('@/views/patrol/PatrolRoutes.vue'),
            meta: { title: '巡检路线', roles: ['admin'] }
          },
          {
            path: 'plans',
            name: 'PatrolPlans',
            component: () => import('@/views/patrol/PatrolPlans.vue'),
            meta: { title: '巡检计划', roles: ['admin'] }
          },
          {
            path: 'records',
            name: 'PatrolRecords',
            component: () => import('@/views/patrol/PatrolRecords.vue'),
            meta: { title: '巡检记录', roles: ['admin'] }
          },
          {
            path: 'hazards',
            name: 'PatrolHazards',
            component: () => import('@/views/patrol/PatrolHazards.vue'),
            meta: { title: '隐患上报', roles: ['admin'] }
          }
        ]
      },
      {
        path: 'fire',
        name: 'Fire',
        meta: { title: '消防管理', icon: 'AlarmClock', roles: ['admin'] },
        children: [
          {
            path: 'facilities',
            name: 'FireFacilities',
            component: () => import('@/views/fire/FireFacilities.vue'),
            meta: { title: '消防设施', roles: ['admin'] }
          },
          {
            path: 'inspections',
            name: 'FireInspections',
            component: () => import('@/views/fire/FireInspections.vue'),
            meta: { title: '检测记录', roles: ['admin'] }
          }
        ]
      },
      {
        path: 'alerts',
        name: 'Alerts',
        meta: { title: '预警中心', icon: 'Bell', roles: ['admin'] },
        children: [
          {
            path: 'list',
            name: 'AlertList',
            component: () => import('@/views/alert/AlertList.vue'),
            meta: { title: '告警列表', roles: ['admin'] }
          },
          {
            path: 'rules',
            name: 'AlertRules',
            component: () => import('@/views/alert/AlertRules.vue'),
            meta: { title: '告警规则', roles: ['admin'] }
          }
        ]
      },
      {
        path: 'stats',
        name: 'Stats',
        meta: { title: '统计分析', icon: 'DataAnalysis', roles: ['admin'] },
        children: [
          {
            path: 'access',
            name: 'AccessStats',
            component: () => import('@/views/stats/AccessStats.vue'),
            meta: { title: '通行统计', roles: ['admin'] }
          },
          {
            path: 'visitor',
            name: 'VisitorStats',
            component: () => import('@/views/stats/VisitorStats.vue'),
            meta: { title: '访客统计', roles: ['admin'] }
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 校园安全管理系统` : '校园安全管理系统'

  const token = localStorage.getItem('token')
  const loginType = localStorage.getItem('loginType')
  
  if (to.path !== '/login' && !token) {
    next('/login')
    return
  }
  
  if (to.path === '/login' && token) {
    next('/')
    return
  }
  
  if (to.meta.roles && to.meta.roles.length > 0) {
    const userRole = loginType
    if (!to.meta.roles.includes(userRole)) {
      next('/dashboard')
      return
    }
  }
  
  next()
})

export default router
