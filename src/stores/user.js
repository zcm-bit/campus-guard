import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: null,
    loginType: localStorage.getItem('loginType') || ''
  }),

  getters: {
    isLoggedIn: state => !!state.token,
    username: state => state.userInfo?.username || '',
    realname: state => state.userInfo?.realname || '',
    role: state => state.userInfo?.role || state.loginType || '',
    avatar: state => state.userInfo?.avatar || ''
  },

  actions: {
    async login(loginForm) {
      try {
        const { username, password, loginType } = loginForm
        
        this.token = ''
        this.userInfo = null
        localStorage.removeItem('token')
        localStorage.removeItem('loginType')
        
        const response = await request.post('/auth/login', {
          username,
          password,
          loginType
        })
        
        if (response.success) {
          const { token, ...user } = response.data
          
          this.token = token
          this.loginType = loginType
          this.userInfo = user
          
          localStorage.setItem('token', token)
          localStorage.setItem('loginType', loginType)
          
          ElMessage.success('登录成功')
          return true
        } else {
          ElMessage.error(response.message || '登录失败')
          return false
        }
      } catch (error) {
        console.error('登录异常:', error)
        ElMessage.error('登录失败，请检查后端服务是否启动')
        return false
      }
    },

    async getCurrentUser() {
      if (!this.token) return
      
      try {
        const response = await request.get('/auth/current')
        if (response.success) {
          this.userInfo = response.data
        }
      } catch (error) {
        console.error('获取用户信息失败', error)
        // 不调用 logout()，保留 localStorage 中的登录状态
        // 这样即使后端暂时不可用，用户仍然可以看到侧边栏菜单
      } finally {
        // 确保 loginType 始终从 localStorage 获取
        this.loginType = localStorage.getItem('loginType') || ''
      }
    },

    async logout() {
      this.token = ''
      this.userInfo = null
      this.loginType = ''
      localStorage.removeItem('token')
      localStorage.removeItem('loginType')
      ElMessage.success('退出成功')
    }
  }
})
