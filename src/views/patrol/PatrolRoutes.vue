<template>
  <div class="page-container">
    <div class="page-header">
      <span class="page-title">巡检路线</span>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增路线
      </el-button>
    </div>

    <el-card>
      <div class="search-box">
        <el-input v-model="searchForm.keyword" placeholder="搜索路线名称" style="width:200px" clearable />
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>

      <el-table :data="tableData" v-loading="loading" stripe style="width: 100%; margin-top:20px">
        <el-table-column prop="name" label="路线名称" />
        <el-table-column prop="description" label="路线描述" />
        <el-table-column prop="type" label="类型">
          <template #default="{ row }">
            <el-tag :type="getTypeTag(row.type)" size="small">{{ getTypeName(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'" size="small">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form ref="formRef" :model="form" label-width="100px">
        <el-form-item label="路线名称" prop="name"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="路线描述" prop="description"><el-input v-model="form.description" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" style="width:100%">
            <el-option label="日常巡检" value="daily" />
            <el-option label="夜间巡检" value="night" />
            <el-option label="消防巡检" value="fire" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" active-value="active" inactive-value="inactive" />
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
  name: 'PatrolRoutes',
  setup() {
    const loading = ref(false)
    const dialogVisible = ref(false)
    const dialogTitle = ref('')
    const formRef = ref(null)
    const tableData = ref([])

    const searchForm = reactive({ keyword: '' })
    const form = reactive({ id: '', name: '', description: '', type: 'daily', status: 'active' })

    const typeMap = {
      daily: { name: '日常巡检', type: 'primary' },
      night: { name: '夜间巡检', type: 'warning' },
      fire: { name: '消防巡检', type: 'danger' }
    }
    const getTypeName = (type) => typeMap[type]?.name || type
    const getTypeTag = (type) => typeMap[type]?.type || 'info'

    const fetchData = async () => {
      loading.value = true
      try {
        const response = await request.get('/patrol/routes')
        if (response.success && response.data) {
          tableData.value = response.data.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            type: item.type,
            status: item.status
          }))
        }
      } catch (error) {
        console.error('获取巡检路线失败:', error)
        ElMessage.error('获取数据失败')
      } finally {
        loading.value = false
      }
    }

    const handleSearch = () => {
      fetchData()
    }

    const handleReset = () => {
      searchForm.keyword = ''
      fetchData()
    }

    const handleAdd = () => {
      dialogTitle.value = '新增路线'
      Object.assign(form, { id: '', name: '', description: '', type: 'daily', status: 'active' })
      dialogVisible.value = true
    }

    const handleEdit = (row) => {
      dialogTitle.value = '编辑路线'
      Object.assign(form, row)
      dialogVisible.value = true
    }

    const handleSubmit = async () => {
      try {
        const data = {
          name: form.name,
          description: form.description,
          type: form.type,
          status: form.status
        }
        
        if (form.id) {
          await request.put(`/patrol/routes/${form.id}`, data)
          ElMessage.success('更新成功')
        } else {
          await request.post('/patrol/routes', data)
          ElMessage.success('创建成功')
        }
        dialogVisible.value = false
        fetchData()
      } catch (error) {
        console.error('保存失败:', error)
        ElMessage.error('操作失败')
      }
    }

    const handleDelete = async (row) => {
      await ElMessageBox.confirm(`确定要删除路线 "${row.name}" 吗？`, '提示', { type: 'warning' })
      try {
        await request.delete(`/patrol/routes/${row.id}`)
        ElMessage.success('删除成功')
        fetchData()
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
      dialogVisible, 
      dialogTitle, 
      form, 
      formRef, 
      searchForm,
      getTypeName,
      getTypeTag,
      handleSearch, 
      handleReset, 
      handleAdd, 
      handleEdit, 
      handleSubmit, 
      handleDelete 
    }
  }
})
</script>

<style lang="scss" scoped>
.search-box { display: flex; flex-wrap: wrap; gap: 10px; }
</style>
