<template>
  <el-container class="layout-container">
    <el-aside :width="isCollapsed ? '64px' : '220px'" class="sidebar">
      <div class="logo">
        <el-icon v-if="!isCollapsed" class="logo-icon"><Shield /></el-icon>
        <span v-if="!isCollapsed">CampusGuard</span>
        <el-icon v-else><Shield /></el-icon>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapsed"
        :router="true"
        class="sidebar-menu"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/dashboard">
          <el-icon><Odometer /></el-icon>
          <span>数据看板</span>
        </el-menu-item>

        <template v-if="isTeacher || isAdmin">
          <el-sub-menu index="access">
            <template #title>
              <el-icon><Key /></el-icon>
              <span>门禁管理</span>
            </template>
            <el-menu-item index="/access/records">通行记录</el-menu-item>
            <template v-if="isAdmin">
              <el-menu-item index="/access/points">门禁点管理</el-menu-item>
              <el-menu-item index="/access/alerts">门禁告警</el-menu-item>
            </template>
          </el-sub-menu>

          <el-sub-menu index="visitor">
            <template #title>
              <el-icon><User /></el-icon>
              <span>访客管理</span>
            </template>
            <el-menu-item index="/visitor/list">访客列表</el-menu-item>
            <template v-if="isAdmin">
              <el-menu-item index="/visitor/register">访客登记</el-menu-item>
            </template>
          </el-sub-menu>

          <el-sub-menu index="camera">
            <template #title>
              <el-icon><VideoCamera /></el-icon>
              <span>视频监控</span>
            </template>
            <el-menu-item index="/camera/preview">实时预览</el-menu-item>
            <template v-if="isAdmin">
              <el-menu-item index="/camera/list">监控点管理</el-menu-item>
            </template>
          </el-sub-menu>
        </template>

        <template v-if="isAdmin">
          <el-sub-menu index="system">
            <template #title>
              <el-icon><Setting /></el-icon>
              <span>系统管理</span>
            </template>
            <el-menu-item index="/system/users">用户管理</el-menu-item>
            <el-menu-item index="/system/roles">角色权限</el-menu-item>
            <el-menu-item index="/system/logs">操作日志</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="base">
            <template #title>
              <el-icon><OfficeBuilding /></el-icon>
              <span>基础信息</span>
            </template>
            <el-menu-item index="/base/departments">院系管理</el-menu-item>
            <el-menu-item index="/base/classes">班级管理</el-menu-item>
            <el-menu-item index="/base/dormitories">宿舍管理</el-menu-item>
            <el-menu-item index="/base/personnel">人员档案</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="patrol">
            <template #title>
              <el-icon><Guide /></el-icon>
              <span>巡检管理</span>
            </template>
            <el-menu-item index="/patrol/routes">巡检路线</el-menu-item>
            <el-menu-item index="/patrol/plans">巡检计划</el-menu-item>
            <el-menu-item index="/patrol/records">巡检记录</el-menu-item>
            <el-menu-item index="/patrol/hazards">隐患上报</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="fire">
            <template #title>
              <el-icon><AlarmClock /></el-icon>
              <span>消防管理</span>
            </template>
            <el-menu-item index="/fire/facilities">消防设施</el-menu-item>
            <el-menu-item index="/fire/inspections">检测记录</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="alerts">
            <template #title>
              <el-icon><Bell /></el-icon>
              <span>预警中心</span>
            </template>
            <el-menu-item index="/alerts/list">告警列表</el-menu-item>
            <el-menu-item index="/alerts/rules">告警规则</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="stats">
            <template #title>
              <el-icon><DataAnalysis /></el-icon>
              <span>统计分析</span>
            </template>
            <el-menu-item index="/stats/access">通行统计</el-menu-item>
            <el-menu-item index="/stats/visitor">访客统计</el-menu-item>
          </el-sub-menu>
        </template>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="toggleSidebar">
            <Fold v-if="!isCollapsed" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="$route.meta.title !== '数据看板'">
              {{ $route.meta.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <span class="user-role">{{ roleText }}</span>
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32" :src="userStore.avatar">
                {{ userStore.realname?.charAt(0) }}
              </el-avatar>
              <span class="username">{{ userStore.realname }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="password">修改密码</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { defineComponent, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import { ElMessageBox } from 'element-plus'

export default defineComponent({
  name: 'Layout',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const userStore = useUserStore()
    const appStore = useAppStore()

    const isCollapsed = computed(() => appStore.sidebarCollapsed)
    const activeMenu = computed(() => route.path)
    const isAdmin = computed(() => userStore.role === 'admin')
    const isTeacher = computed(() => userStore.role === 'teacher')
    const isStudent = computed(() => userStore.role === 'student')
    
    onMounted(() => {
      userStore.getCurrentUser()
    })
    
    const roleText = computed(() => {
      if (userStore.role === 'admin') return '管理员'
      if (userStore.role === 'student') return '学生'
      if (userStore.role === 'teacher') return '教师'
      return ''
    })

    const toggleSidebar = () => {
      appStore.toggleSidebar()
    }

    const handleCommand = async (command) => {
      if (command === 'logout') {
        await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        await userStore.logout()
        router.push('/login')
      } else if (command === 'profile') {
        ElMessageBox.info('个人中心功能开发中')
      } else if (command === 'password') {
        ElMessageBox.info('修改密码功能开发中')
      }
    }

    return {
      isCollapsed,
      activeMenu,
      isAdmin,
      isTeacher,
      isStudent,
      roleText,
      toggleSidebar,
      handleCommand,
      userStore
    }
  }
})
</script>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
}

.sidebar {
  background-color: #304156;
  transition: width 0.3s;
  overflow: hidden;

  .logo {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    border-bottom: 1px solid #3d4a5c;

    .logo-icon {
      font-size: 24px;
      margin-right: 8px;
    }
  }

  .sidebar-menu {
    border-right: none;
    height: calc(100vh - 60px);
    overflow-y: auto;
  }
}

.header {
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .header-left {
    display: flex;
    align-items: center;

    .collapse-btn {
      font-size: 20px;
      cursor: pointer;
      margin-right: 15px;
      color: #606266;

      &:hover {
        color: #409EFF;
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;

    .user-role {
      margin-right: 15px;
      padding: 4px 12px;
      background: #E8F4FD;
      color: #409EFF;
      border-radius: 4px;
      font-size: 12px;
    }

    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;

      .username {
        margin-left: 8px;
        color: #606266;
      }
    }
  }
}

.main-content {
  background-color: #F5F7FA;
  padding: 20px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: -220px;
    z-index: 1000;
    transition: left 0.3s;

    &.is-active {
      left: 0;
    }
  }
}
</style>
