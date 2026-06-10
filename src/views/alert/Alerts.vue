<template>
  <div class="page-container">
    <div class="page-header">
      <span class="page-title">预警管理</span>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增预警
      </el-button>
    </div>

    <el-card>
      <div class="search-box">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索标题/位置"
          style="width: 250px"
          clearable
        />
        <el-select v-model="searchForm.type" placeholder="类型" style="width: 120px" clearable>
          <el-option label="门禁异常" value="access" />
          <el-option label="设备离线" value="device" />
          <el-option label="消防告警" value="fire" />
        </el-select>
        <el-select v-model="searchForm.level" placeholder="级别" style="width: 120px" clearable>
          <el-option label="一般" value="info" />
          <el-option label="警告" value="warning" />
          <el-option label="严重" value="critical" />
        </el-select>
        <el-select v-model="searchForm.status" placeholder="状态" style="width: 120px" clearable>
          <el-option label="待处理" value="pending" />
          <el-option label="处理中" value="handling" />
          <el-option label="已解决" value="resolved" />
        </el-select>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>

      <el-table :data="tableData" v-loading="loading" stripe style="width: 100%; margin-top: 20px">
        <el-table-column prop="title" label="告警标题" />
        <el-table-column prop="type" label="类型">
          <template #default="{ row }">
            <el-tag :type="getTypeTag(row.type)" size="small">{{ getTypeName(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="级别">
          <template #default="{ row }">
            <el-tag :type="getLevelTag(row.level)" size="small">{{ getLevelName(row.level) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="内容" />
        <el-table-column prop="location" label="位置" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)" size="small">{{ getStatusName(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button v-if="row.status !== 'resolved'" type="success" size="small" @click="handleResolve(row)">标记已解决</el-button>
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
        @size-change="fetchData"
        @current-change="fetchData"
      />
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="80px">
        <el-form-item label="告警标题" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" style="width: 100%">
            <el-option label="门禁异常" value="access" />
            <el-option label="设备离线" value="device" />
            <el-option label="消防告警" value="fire" />
          </el-select>
        </el-form-item>
        <el-form-item label="级别" prop="level">
          <el-select v-model="form.level" style="width: 100%">
            <el-option label="一般" value="info" />
            <el-option label="警告" value="warning" />
            <el-option label="严重" value="critical" />
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-textarea v-model="form.content" rows="3" />
        </el-form-item>
        <el-form-item label="位置" prop="location">
          <el-input v-model="form.location" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" style="width: 100%">
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="handling" />
            <el-option label="已解决" value="resolved" />
          </el-select>
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
  name: 'Alerts',
  setup() {
    const loading = ref(false)
    const dialogVisible = ref(false)
    const dialogTitle = ref('')
    const formRef = ref(null)
    const tableData = ref([])

    const pagination = reactive({
      page: 1,
      pageSize: 10,
      total: 0
    })

    const searchForm = reactive({
      keyword: '',
      type: '',
      level: '',
      status: ''
    })

    const form = reactive({
      id: '',
      title: '',
      type: 'access',
      level: 'warning',
      content: '',
      location: '',
      status: 'pending'
    })

    const formRules = {
      title: [{ required: true, message: '请输入告警标题', trigger: 'blur' }],
      type: [{ required: true, message: '请选择类型', trigger: 'change' }],
      level: [{ required: true, message: '请选择级别', trigger: 'change' }],
      content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
      location: [{ required: true, message: '请输入位置', trigger: 'blur' }]
    }

    const typeMap = {
      access: { name: '门禁异常', type: 'primary' },
      device: { name: '设备离线', type: 'warning' },
      fire: { name: '消防告警', type: 'danger' }
    }

    const levelMap = {
      info: { name: '一般', type: 'info' },
      warning: { name: '警告', type: 'warning' },
      critical: { name: '严重', type: 'danger' }
    }

    const statusMap = {
      pending: { name: '待处理', type: 'warning' },
      handling: { name: '处理中', type: 'primary' },
      resolved: { name: '已解决', type: 'success' }
    }

    const getTypeName = (type) => typeMap[type]?.name || type
    const getTypeTag = (type) => typeMap[type]?.type || 'info'
    const getLevelName = (level) => levelMap[level]?.name || level
    const getLevelTag = (level) => levelMap[level]?.type || 'info'
    const getStatusName = (status) => statusMap[status]?.name || status
    const getStatusTag = (status) => statusMap[status]?.type || 'info'

    const fetchData = async () => {
      loading.value = true
      try {
        const params = {
          keyword: searchForm.keyword,
          type: searchForm.type,
          level: searchForm.level,
          status: searchForm.status,
          page: pagination.page,
          pageSize: pagination.pageSize
        }
        const response = await request.get('/alerts', { params })
        if (response.success && response.data) {
          tableData.value = response.data.map(item => ({
            id: item.id,
            title: item.title,
            type: item.type,
            level: item.level,
            content: item.content,
            location: item.location,
            status: item.status,
            created_at: item.created_at
          }))
          pagination.total = response.total || tableData.value.length
        }
      } catch (error) {
        console.error('获取告警列表失败:', error)
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
      Object.assign(searchForm, { keyword: '', type: '', level: '', status: '' })
      pagination.page = 1
      fetchData()
    }

    const handleAdd = () => {
      dialogTitle.value = '新增预警'
      Object.assign(form, { id: '', title: '', type: 'access', level: 'warning', content: '', location: '', status: 'pending' })
      dialogVisible.value = true
    }

    const handleEdit = (row) => {
      dialogTitle.value = '编辑预警'
      Object.assign(form, { ...row })
      dialogVisible.value = true
    }

    const handleSubmit = async () => {
      if (!formRef.value) return
      await formRef.value.validate(async (valid) => {
        if (!valid) return
        
        try {
          const data = {
            title: form.title,
            type: form.type,
            level: form.level,
            content: form.content,
            location: form.location,
            status: form.status
          }
          
          if (form.id) {
            await request.put(`/alerts/${form.id}`, data)
            ElMessage.success('更新成功')
          } else {
            await request.post('/alerts', data)
            ElMessage.success('创建成功')
          }
          
          dialogVisible.value = false
          fetchData()
        } catch (error) {
          console.error('保存失败:', error)
          ElMessage.error('操作失败')
        }
      })
    }

    const handleDialogClose = () => {
      formRef.value?.resetFields()
    }

    const handleResolve = async (row) => {
      await ElMessageBox.confirm(`确定要将告警 "${row.title}" 标记为已解决吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      })
      
      try {
        await request.put(`/alerts/${row.id}`, { status: 'resolved' })
        ElMessage.success('已标记为已解决')
        fetchData()
      } catch (error) {
        console.error('更新失败:', error)
        ElMessage.error('操作失败')
      }
    }

    const handleDelete = async (row) => {
      await ElMessageBox.confirm(`确定要删除告警 "${row.title}" 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      
      try {
        await request.delete(`/alerts/${row.id}`)
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
      pagination,
      searchForm,
      dialogVisible,
      dialogTitle,
      form,
      formRules,
      formRef,
      tableData,
      getTypeName,
      getTypeTag,
      getLevelName,
      getLevelTag,
      getStatusName,
      getStatusTag,
      handleSearch,
      handleReset,
      handleAdd,
      handleEdit,
      handleSubmit,
      handleDialogClose,
      handleResolve,
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