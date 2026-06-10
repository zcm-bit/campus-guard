<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2>校园安全管理系统</h2>
        <p>Campus Guard Management System</p>
      </div>

      <div class="login-tabs">
        <el-tabs v-model="loginType" class="login-tabs-inner">
          <el-tab-pane label="管理员登录" name="admin">
            <span class="tab-icon"><User /></span>
          </el-tab-pane>
          <el-tab-pane label="学生登录" name="student">
            <span class="tab-icon"><UserFilled /></span>
          </el-tab-pane>
          <el-tab-pane label="教师登录" name="teacher">
            <span class="tab-icon"><Briefcase /></span>
          </el-tab-pane>
        </el-tabs>
      </div>

      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            :placeholder="placeholder.username"
            prefix-icon="User"
            size="large"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            :placeholder="placeholder.password"
            prefix-icon="Lock"
            size="large"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item v-if="loginType === 'student'">
          <el-input
            v-model="loginForm.studentId"
            placeholder="请输入学号"
            prefix-icon="Key"
            size="large"
          />
        </el-form-item>
        <el-form-item v-if="loginType === 'teacher'">
          <el-input
            v-model="loginForm.teacherId"
            placeholder="请输入工号"
            prefix-icon="Key"
            size="large"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            size="large"
            style="width: 100%"
            @click="handleLogin"
          >
            {{ loginType === 'admin' ? '管理员登录' : loginType === 'student' ? '学生登录' : '教师登录' }}
          </el-button>
        </el-form-item>
      </el-form>
      <div class="login-footer">
        <p v-if="loginType === 'admin'">默认账号：admin / admin123</p>
        <p v-else-if="loginType === 'student'">示例账号：张三 / 123456</p>
        <p v-else>示例账号：张教授 / 123456</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { User, UserFilled, Briefcase } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'Login',
  setup() {
    const router = useRouter()
    const userStore = useUserStore()

    const loginFormRef = ref(null)
    const loading = ref(false)
    const loginType = ref('admin')

    const loginForm = ref({
      username: '',
      password: '',
      studentId: '',
      teacherId: ''
    })

    const placeholder = computed(() => {
      if (loginType.value === 'admin') {
        return { username: '请输入用户名', password: '请输入密码' }
      } else if (loginType.value === 'student') {
        return { username: '请输入姓名', password: '请输入密码' }
      } else {
        return { username: '请输入姓名', password: '请输入密码' }
      }
    })

    const loginRules = {
      username: [
        { required: true, message: loginType.value === 'admin' ? '请输入用户名' : '请输入姓名', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
      ]
    }

    const handleLogin = async () => {
      if (!loginFormRef.value) return

      await loginFormRef.value.validate(async (valid) => {
        if (!valid) return

        loading.value = true
        try {
          const success = await userStore.login({
            ...loginForm.value,
            loginType: loginType.value
          })
          if (success) {
            router.push('/')
          } else {
            ElMessage.error('登录失败')
          }
        } catch (error) {
          console.error('登录异常:', error)
          ElMessage.error('登录失败: ' + error.message)
        } finally {
          loading.value = false
        }
      })
    }

    return {
      loginFormRef,
      loginForm,
      loginRules,
      loading,
      loginType,
      placeholder,
      handleLogin,
      User,
      UserFilled,
      Briefcase
    }
  }
})
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  width: 450px;
  padding: 40px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.login-header {
  text-align: center;
  margin-bottom: 20px;

  h2 {
    font-size: 24px;
    color: #303133;
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
    color: #909399;
  }
}

.login-tabs {
  margin-bottom: 20px;

  .login-tabs-inner {
    .el-tabs__nav {
      justify-content: center;
    }

    .el-tab-pane {
      padding: 0;
    }
  }

  .tab-icon {
    margin-right: 8px;
  }
}

.login-form {
  .el-input {
    height: 44px;
  }
}

.login-footer {
  text-align: center;
  margin-top: 20px;

  p {
    font-size: 12px;
    color: #909399;
  }
}

@media (max-width: 768px) {
  .login-box {
    width: 90%;
    padding: 30px 20px;
  }
}
</style>
