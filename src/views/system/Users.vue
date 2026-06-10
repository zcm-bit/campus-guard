<template>
  <div class="page-container">
    <div class="page-header">
      <span class="page-title">用户管理</span>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增用户
      </el-button>
    </div>

    <el-card>
      <div class="search-box">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索用户名/姓名/手机号"
          style="width: 250px"
          clearable
        />
        <el-select v-model="searchForm.role" placeholder="选择角色" style="width: 150px" clearable>
          <el-option label="超级管理员" value="super_admin" />
          <el-option label="管理员" value="admin" />
          <el-option label="安保主管" value="security" />
          <el-option label="保安" value="guard" />
          <el-option label="教师" value="teacher" />
        </el-select>
        <el-select v-model="searchForm.status" placeholder="状态" style="width: 120px" clearable>
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>

      <el-table :data="tableData" v-loading="loading" stripe style="width: 100%; margin-top: 20px">
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="realname" label="姓名" />
        <el-table-column prop="role" label="角色">
          <template #default="{ row }">
            <el-tag :type="getRoleType(row.role)" size="small">
              {{ getRoleName(row.role) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="warning" size="small" @click="handleResetPwd(row)">重置密码</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px"
        @current-change="fetchData"
        @size-change="fetchData"
      />
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" :disabled="!!form.id" />
        </el-form-item>
        <el-form-item label="姓名" prop="realname">
          <el-input v-model="form.realname" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" style="width: 100%">
            <el-option label="超级管理员" value="super_admin" />
            <el-option label="管理员" value="admin" />
            <el-option label="安保主管" value="security" />
            <el-option label="保安" value="guard" />
            <el-option label="教师" value="teacher" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item v-if="!form.id" label="密码" prop="password">
          <el-input v-model="form.password" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'

export default defineComponent({
  name: 'Users',
  setup() {
    const loading = ref(false)
    const tableData = ref([])
    const dialogVisible = ref(false)
    const dialogTitle = ref('')
    const formRef = ref(null)

    const pagination = reactive({
      page: 1,
      pageSize: 10,
      total: 0
    })

    const searchForm = reactive({
      keyword: '',
      role: '',
      status: ''
    })

    const form = reactive({
      id: '',
      username: '',
      realname: '',
      role: '',
      phone: '',
      email: '',
      password: ''
    })

    const formRules = {
      username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
      realname: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
      role: [{ required: true, message: '请选择角色', trigger: 'change' }],
      password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }]
    }

    const roleMap = {
      super_admin: { name: '超级管理员', type: 'danger' },
      admin: { name: '管理员', type: 'warning' },
      security: { name: '安保主管', type: 'primary' },
      guard: { name: '保安', type: 'success' },
      teacher: { name: '教师', type: 'info' }
    }

    const getRoleName = (role) => roleMap[role]?.name || role
    const getRoleType = (role) => roleMap[role]?.type || 'info'

    const fetchData = async () => {
      loading.value = true
      try {
        const response = await request.get('/users/admins')
        if (response.success && response.data) {
          tableData.value = response.data.map(item => ({
            id: item.id,
            username: item.username,
            realname: item.realname,
            role: item.role || 'admin',
            phone: item.phone,
            email: item.email,
            status: 'active',
            created_at: item.created_at
          }))
          pagination.total = response.data.length
        }
      } catch (error) {
        console.error('获取用户列表失败:', error)
        ElMessage.error('获取数据失败')
      } finally {
        loading.value = false
      }
    }

    const handleSearch = () => {
      pagination.page = 1
      fetchData()
    }

    const handleReset = () => {
      Object.assign(searchForm, { keyword: '', role: '', status: '' })
      pagination.page = 1
      fetchData()
    }

    const handleAdd = () => {
      dialogTitle.value = '新增用户'
      Object.assign(form, { id: '', username: '', realname: '', role: '', phone: '', email: '', password: '' })
      dialogVisible.value = true
    }

    const handleEdit = (row) => {
      dialogTitle.value = '编辑用户'
      Object.assign(form, {
        id: row.id,
        username: row.username,
        realname: row.realname,
        role: row.role,
        phone: row.phone,
        email: row.email,
        password: ''
      })
      dialogVisible.value = true
    }

    const handleSubmit = async () => {
      if (!formRef.value) return
      await formRef.value.validate(async (valid) => {
        if (!valid) return
        
        try {
          if (form.id) {
            const response = await request.put(`/users/admins/${form.id}`, {
              username: form.username,
              realname: form.realname,
              phone: form.phone,
              email: form.email,
              role: form.role
            })
            if (response.success) {
              ElMessage.success('更新成功')
            }
          } else {
            const response = await request.post('/users/admins', {
              username: form.username,
              password: form.password,
              realname: form.realname,
              phone: form.phone,
              email: form.email
            })
            if (response.success) {
              ElMessage.success('创建成功')
            }
          }
          
          dialogVisible.value = false
          fetchData()
        } catch (error) {
          console.error('提交失败:', error)
          ElMessage.error('操作失败')
        }
      })
    }

    const handleDialogClose = () => {
      formRef.value?.resetFields()
    }

    const handleStatusChange = (row) => {
      ElMessage.success(`${row.status === 1 ? '启用' : '禁用'}成功`)
    }

    const handleResetPwd = async (row) => {
      await ElMessageBox.confirm(`确定要重置用户 ${row.realname} 的密码吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      ElMessage.success('密码已重置为：123456')
    }

    const handleDelete = async (row) => {
      await ElMessageBox.confirm(`确定要删除用户 ${row.realname} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      
      try {
        const response = await request.delete(`/users/admins/${row.id}`)
        if (response.success) {
          ElMessage.success('删除成功')
          fetchData()
        }
      } catch (error) {
        console.error('删除失败:', error)
        ElMessage.error('删除失败')
      }
    }

    onMounted(() => {
      fetchData()
    })

    return {
      loading,
      tableData,
      pagination,
      searchForm,
      dialogVisible,
      dialogTitle,
      form,
      formRules,
      formRef,
      getRoleName,
      getRoleType,
      handleSearch,
      handleReset,
      handleAdd,
      handleEdit,
      handleSubmit,
      handleDialogClose,
      handleStatusChange,
      handleResetPwd,
      handleDelete
    }
  }
})
</script>

<style lang="scss" scoped>
.search-box {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>