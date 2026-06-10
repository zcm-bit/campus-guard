<template>
  <div class="page-container">
    <div class="page-header">
      <span class="page-title">隐患上报</span>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增隐患
      </el-button>
    </div>
    <el-card>
      <div class="search-box">
        <el-input v-model="searchForm.keyword" placeholder="搜索标题/位置" style="width:200px" clearable />
        <el-select v-model="searchForm.level" placeholder="等级" style="width:120px" clearable>
          <el-option label="一般" value="general" />
          <el-option label="较大" value="major" />
          <el-option label="重大" value="serious" />
        </el-select>
        <el-select v-model="searchForm.status" placeholder="状态" style="width:120px" clearable>
          <el-option label="待处理" value="pending" />
          <el-option label="处理中" value="handling" />
          <el-option label="已解决" value="resolved" />
        </el-select>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
      <el-table :data="tableData" v-loading="loading" stripe style="width:100%;margin-top:20px">
        <el-table-column prop="title" label="隐患标题" />
        <el-table-column prop="location" label="位置" />
        <el-table-column prop="level" label="等级">
          <template #default="{row}">
            <el-tag :type="getLevelTag(row.level)" size="small">{{getLevelName(row.level)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{row}">
            <el-tag :type="getStatusTag(row.status)" size="small">{{getStatusName(row.status)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reporter_name" label="上报人" />
        <el-table-column prop="created_at" label="上报时间" />
        <el-table-column label="操作" width="200">
          <template #default="{row}">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button v-if="row.status !== 'resolved'" type="success" size="small" @click="handleResolve(row)">标记已解决</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="form" label-width="80px">
        <el-form-item label="隐患标题" prop="title"><el-input v-model="form.title" /></el-form-item>
        <el-form-item label="位置" prop="location"><el-input v-model="form.location" /></el-form-item>
        <el-form-item label="等级" prop="level">
          <el-select v-model="form.level" style="width:100%">
            <el-option label="一般" value="general" />
            <el-option label="较大" value="major" />
            <el-option label="重大" value="serious" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" style="width:100%">
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="handling" />
            <el-option label="已解决" value="resolved" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible=false">取消</el-button>
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
  name: 'PatrolHazards',
  setup() {
    const loading = ref(false)
    const dialogVisible = ref(false)
    const dialogTitle = ref('')
    const formRef = ref(null)
    const tableData = ref([])

    const searchForm = reactive({ keyword: '', level: '', status: '' })
    const form = reactive({ id: '', title: '', location: '', level: 'general', status: 'pending' })

    const levelMap = { general: { name: '一般', tag: 'info' }, major: { name: '较大', tag: 'warning' }, serious: { name: '重大', tag: 'danger' } }
    const statusMap = { pending: { name: '待处理', tag: 'danger' }, handling: { name: '处理中', tag: 'warning' }, resolved: { name: '已解决', tag: 'success' } }

    const getLevelName = (l) => levelMap[l]?.name || l
    const getLevelTag = (l) => levelMap[l]?.tag || 'info'
    const getStatusName = (s) => statusMap[s]?.name || s
    const getStatusTag = (s) => statusMap[s]?.tag || 'info'

    const fetchData = async () => {
      loading.value = true
      try {
        const params = {
          keyword: searchForm.keyword,
          level: searchForm.level,
          status: searchForm.status
        }
        const response = await request.get('/patrol/hazards', { params })
        if (response.success && response.data) {
          tableData.value = response.data.map(item => ({
            id: item.id,
            title: item.title,
            location: item.location,
            level: item.level,
            status: item.status,
            reporter_name: item.reporter_name,
            created_at: item.created_at
          }))
        }
      } catch (error) {
        console.error('获取隐患列表失败:', error)
        ElMessage.error('获取数据失败')
      } finally {
        loading.value = false
      }
    }

    const handleSearch = () => {
      fetchData()
    }

    const handleReset = () => {
      Object.assign(searchForm, { keyword: '', level: '', status: '' })
      fetchData()
    }

    const handleAdd = () => {
      dialogTitle.value = '新增隐患'
      Object.assign(form, { id: '', title: '', location: '', level: 'general', status: 'pending' })
      dialogVisible.value = true
    }

    const handleEdit = (row) => {
      dialogTitle.value = '编辑隐患'
      Object.assign(form, row)
      dialogVisible.value = true
    }

    const handleSubmit = async () => {
      try {
        const data = {
          title: form.title,
          location: form.location,
          level: form.level,
          status: form.status
        }
        
        if (form.id) {
          await request.put(`/patrol/hazards/${form.id}`, data)
          ElMessage.success('更新成功')
        } else {
          await request.post('/patrol/hazards', data)
          ElMessage.success('创建成功')
        }
        dialogVisible.value = false
        fetchData()
      } catch (error) {
        console.error('保存失败:', error)
        ElMessage.error('操作失败')
      }
    }

    const handleResolve = async (row) => {
      await ElMessageBox.confirm(`确定要将隐患 "${row.title}" 标记为已解决吗？`, '提示', { type: 'info' })
      try {
        await request.put(`/patrol/hazards/${row.id}`, { status: 'resolved' })
        ElMessage.success('已标记为已解决')
        fetchData()
      } catch (error) {
        console.error('更新失败:', error)
        ElMessage.error('操作失败')
      }
    }

    const handleDelete = async (row) => {
      await ElMessageBox.confirm(`确定要删除隐患 "${row.title}" 吗？`, '提示', { type: 'warning' })
      try {
        await request.delete(`/patrol/hazards/${row.id}`)
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

    return { loading, tableData, dialogVisible, dialogTitle, form, formRef, searchForm, getLevelName, getLevelTag, getStatusName, getStatusTag, handleSearch, handleReset, handleAdd, handleEdit, handleSubmit, handleResolve, handleDelete }
  }
})
</script>

<style lang="scss" scoped>
.search-box { display: flex; flex-wrap: wrap; gap: 10px; }
</style>