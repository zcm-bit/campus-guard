<template>
  <div class="page-container">
    <div class="page-header">
      <span class="page-title">角色管理</span>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        添加角色
      </el-button>
    </div>

    <el-card>
      <el-table :data="tableData" v-loading="loading" stripe style="width: 100%">
        <el-table-column prop="name" label="角色名称" />
        <el-table-column prop="code" label="角色编码" />
        <el-table-column prop="description" label="角色描述" />
        <el-table-column prop="createdAt" label="创建时间" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="form" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入角色编码" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="2" placeholder="请输入角色描述" />
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
  name: 'Roles',
  setup() {
    const loading = ref(false)
    const tableData = ref([])
    const dialogVisible = ref(false)
    const dialogTitle = ref('添加角色')
    const formRef = ref(null)
    const form = reactive({
      id: '',
      name: '',
      code: '',
      description: ''
    })

    const fetchData = async () => {
      loading.value = true
      try {
        const response = await request.get('/roles')
        if (response.success && response.data) {
          tableData.value = response.data.map(item => ({
            id: item.id,
            name: item.name,
            code: item.code,
            description: item.description,
            createdAt: item.created_at || item.createdAt
          }))
        }
      } catch (error) {
        console.error('获取角色列表失败:', error)
        ElMessage.error('获取数据失败')
      } finally {
        loading.value = false
      }
    }

    const handleAdd = () => {
      dialogTitle.value = '添加角色'
      Object.keys(form).forEach(key => form[key] = '')
      dialogVisible.value = true
    }

    const handleEdit = (row) => {
      dialogTitle.value = '编辑角色'
      Object.assign(form, row)
      dialogVisible.value = true
    }

    const handleSubmit = async () => {
      try {
        if (form.id) {
          await request.put(`/roles/${form.id}`, {
            name: form.name,
            code: form.code,
            description: form.description
          })
          ElMessage.success('更新成功')
        } else {
          await request.post('/roles', {
            name: form.name,
            code: form.code,
            description: form.description
          })
          ElMessage.success('添加成功')
        }
        dialogVisible.value = false
        fetchData()
      } catch (error) {
        console.error('保存角色失败:', error)
        ElMessage.error('保存失败')
      }
    }

    const handleDelete = async (row) => {
      await ElMessageBox.confirm(`确定要删除角色 "${row.name}" 吗？`, '提示', { type: 'warning' })
      try {
        await request.delete(`/roles/${row.id}`)
        ElMessage.success('删除成功')
        fetchData()
      } catch (error) {
        console.error('删除角色失败:', error)
        ElMessage.error('删除失败')
      }
    }

    onMounted(() => {
      fetchData()
    })

    return {
      loading,
      tableData,
      dialogVisible,
      dialogTitle,
      formRef,
      form,
      handleAdd,
      handleEdit,
      handleSubmit,
      handleDelete
    }
  }
})
</script>

<style lang="scss" scoped>
.page-container {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    .page-title { font-size: 20px; font-weight: 600; }
  }
}
</style>