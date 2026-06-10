<template>
  <div class="page-container">
    <div class="page-header">
      <span class="page-title">门禁点管理</span>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增门禁点
      </el-button>
    </div>

    <el-card>
      <div class="search-box">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索名称/位置"
          style="width: 250px"
          clearable
        />
        <el-select v-model="searchForm.type" placeholder="类型" style="width: 150px" clearable>
          <el-option label="人行通道" value="pedestrian" />
          <el-option label="车行通道" value="vehicle" />
          <el-option label="宿舍门禁" value="dormitory" />
        </el-select>
        <el-select v-model="searchForm.status" placeholder="状态" style="width: 120px" clearable>
          <el-option label="正常" :value="1" />
          <el-option label="故障" :value="0" />
        </el-select>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>

      <el-table :data="filteredData" v-loading="loading" stripe style="width: 100%; margin-top: 20px">
        <el-table-column prop="name" label="门禁点名称" />
        <el-table-column prop="location" label="位置" />
        <el-table-column prop="device_no" label="设备编号" />
        <el-table-column prop="type" label="类型">
          <template #default="{ row }">
            <el-tag :type="getTypeTag(row.type)" size="small">{{ getTypeName(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)" size="small">{{ getStatusName(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
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
        @change="fetchData"
      />
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="80px">
        <el-form-item label="门禁点名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="位置" prop="location">
          <el-input v-model="form.location" />
        </el-form-item>
        <el-form-item label="设备编号" prop="device_no">
          <el-input v-model="form.device_no" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" style="width: 100%">
            <el-option label="人行通道" value="pedestrian" />
            <el-option label="车行通道" value="vehicle" />
            <el-option label="宿舍门禁" value="dormitory" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
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
import { defineComponent, ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'

export default defineComponent({
  name: 'AccessPoints',
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
      status: ''
    })

    const form = reactive({
      id: '',
      name: '',
      location: '',
      device_no: '',
      type: 'pedestrian',
      status: 1
    })

    const formRules = {
      name: [{ required: true, message: '请输入门禁点名称', trigger: 'blur' }],
      location: [{ required: true, message: '请输入位置', trigger: 'blur' }],
      device_no: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
      type: [{ required: true, message: '请选择类型', trigger: 'change' }]
    }

    const typeMap = {
      pedestrian: { name: '人行通道', type: 'primary' },
      vehicle: { name: '车行通道', type: 'warning' },
      dormitory: { name: '宿舍门禁', type: 'success' },
      gate: { name: '大门', type: 'primary' },
      building: { name: '楼栋', type: 'info' },
      library: { name: '图书馆', type: 'info' }
    }

    const statusMap = {
      1: { name: '正常', type: 'success' },
      0: { name: '故障', type: 'danger' },
      'online': { name: '正常', type: 'success' },
      'normal': { name: '正常', type: 'success' },
      'offline': { name: '故障', type: 'danger' }
    }

    const getTypeName = (type) => typeMap[type]?.name || type
    const getTypeTag = (type) => typeMap[type]?.type || 'info'
    const getStatusName = (status) => {
      const key = String(status).toLowerCase()
      return statusMap[key]?.name || statusMap[status]?.name || '未知'
    }
    const getStatusTag = (status) => {
      const key = String(status).toLowerCase()
      return statusMap[key]?.type || statusMap[status]?.type || 'info'
    }

    const fetchData = async () => {
      loading.value = true
      try {
        const response = await request.get('/access/points')
        if (response.success) {
          tableData.value = response.data.map(item => ({
            id: item.id,
            name: item.name,
            location: item.location,
            device_no: item.device_no || item.device_code,
            type: item.type,
            status: item.status
          }))
          pagination.total = tableData.value.length
        }
      } catch (error) {
        console.error('获取门禁点列表失败:', error)
        ElMessage.error('获取数据失败')
      } finally {
        loading.value = false
      }
    }

    const filteredData = computed(() => {
      return tableData.value
    })

    const handleSearch = () => {
      pagination.page = 1
      fetchData()
    }

    const handleReset = () => {
      Object.assign(searchForm, { keyword: '', type: '', status: '' })
      pagination.page = 1
      fetchData()
    }

    const handleAdd = () => {
      dialogTitle.value = '新增门禁点'
      Object.assign(form, { id: '', name: '', location: '', device_no: '', type: 'pedestrian', status: 1 })
      dialogVisible.value = true
    }

    const handleEdit = (row) => {
      dialogTitle.value = '编辑门禁点'
      Object.assign(form, { ...row })
      // 将状态值统一转换为数字类型，确保switch组件正确显示
      form.status = row.status === 1 || row.status === '1' || row.status === 'online' || row.status === 'normal' ? 1 : 0
      dialogVisible.value = true
    }

    const handleSubmit = async () => {
      if (!formRef.value) return
      await formRef.value.validate(async (valid) => {
        if (!valid) return
        
        try {
          const data = {
            name: form.name,
            location: form.location,
            device_no: form.device_no,
            type: form.type,
            status: form.status
          }
          
          if (form.id) {
            await request.put(`/access/points/${form.id}`, data)
            ElMessage.success('更新成功')
          } else {
            await request.post('/access/points', data)
            ElMessage.success('创建成功')
          }
          
          dialogVisible.value = false
          fetchData()
        } catch (error) {
          console.error('保存门禁点失败:', error)
          ElMessage.error('保存失败')
        }
      })
    }

    const handleDialogClose = () => {
      formRef.value?.resetFields()
    }

    const handleDelete = async (row) => {
      await ElMessageBox.confirm(`确定要删除门禁点 ${row.name} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      
      try {
        await request.delete(`/access/points/${row.id}`)
        ElMessage.success('删除成功')
        fetchData()
      } catch (error) {
        console.error('删除门禁点失败:', error)
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
      filteredData,
      getTypeName,
      getTypeTag,
      getStatusName,
      getStatusTag,
      handleSearch,
      handleReset,
      handleAdd,
      handleEdit,
      handleSubmit,
      handleDialogClose,
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
