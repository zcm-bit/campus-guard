<template>
  <div class="page-container">
    <div class="page-header">
      <span class="page-title">消防设施管理</span>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        添加设施
      </el-button>
    </div>

    <el-card>
      <div class="search-box">
        <el-input v-model="searchForm.keyword" placeholder="搜索名称/位置" style="width:200px" clearable />
        <el-select v-model="searchForm.status" placeholder="状态" style="width:120px" clearable>
          <el-option label="正常" value="normal" />
          <el-option label="过期" value="expired" />
        </el-select>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>

      <el-table :data="tableData" v-loading="loading" stripe style="width:100%;margin-top:20px">
        <el-table-column prop="name" label="设施名称" />
        <el-table-column prop="location" label="位置" />
        <el-table-column prop="type" label="类型">
          <template #default="{row}">
            <el-tag size="small">{{getTypeName(row.type)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{row}">
            <el-tag :type="getStatusTag(row.status)" size="small">{{getStatusName(row.status)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastInspectionDate" label="上次检查日期" />
        <el-table-column prop="nextInspectionDate" label="下次检查日期" />
        <el-table-column label="操作" width="150">
          <template #default="{row}">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form ref="formRef" :model="form" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="设施名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入设施名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="位置" prop="location">
              <el-input v-model="form.location" placeholder="请输入位置" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="类型" prop="type">
              <el-select v-model="form.type" placeholder="请选择类型">
                <el-option label="灭火器" value="fire_extinguisher" />
                <el-option label="消火栓" value="fire_hydrant" />
                <el-option label="消防栓" value="fireplug" />
                <el-option label="其他" value="other" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择状态">
                <el-option label="正常" value="normal" />
                <el-option label="过期" value="expired" />
                <el-option label="故障" value="fault" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="上次检查日期" prop="lastInspectionDate">
              <el-date-picker v-model="form.lastInspectionDate" type="date" placeholder="选择日期" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下次检查日期" prop="nextInspectionDate">
              <el-date-picker v-model="form.nextInspectionDate" type="date" placeholder="选择日期" />
            </el-form-item>
          </el-col>
        </el-row>
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
  name: 'FireFacilities',
  setup() {
    const loading = ref(false)
    const tableData = ref([])
    const dialogVisible = ref(false)
    const dialogTitle = ref('添加设施')
    const formRef = ref(null)
    const searchForm = reactive({ keyword: '', status: '' })
    const form = reactive({
      id: '',
      name: '',
      location: '',
      type: 'fire_extinguisher',
      status: 'normal',
      lastInspectionDate: '',
      nextInspectionDate: ''
    })

    const typeMap = {
      fire_extinguisher: '灭火器',
      fire_hydrant: '消火栓',
      fireplug: '消防栓',
      other: '其他'
    }
    const statusMap = {
      normal: { name: '正常', tag: 'success' },
      expired: { name: '过期', tag: 'danger' },
      fault: { name: '故障', tag: 'warning' }
    }
    const getTypeName = (t) => typeMap[t] || t
    const getStatusName = (s) => statusMap[s]?.name || s
    const getStatusTag = (s) => statusMap[s]?.tag || 'info'

    const fetchData = async () => {
      loading.value = true
      try {
        const params = {
          keyword: searchForm.keyword,
          status: searchForm.status
        }
        const response = await request.get('/fire/facilities', { params })
        if (response.success && response.data) {
          tableData.value = response.data.map(item => ({
            id: item.id,
            name: item.name,
            location: item.location,
            type: item.type,
            status: item.status,
            lastInspectionDate: item.last_inspection_date || item.lastInspectionDate,
            nextInspectionDate: item.next_inspection_date || item.nextInspectionDate
          }))
        }
      } catch (error) {
        console.error('获取消防设施列表失败:', error)
        ElMessage.error('获取数据失败')
      } finally {
        loading.value = false
      }
    }

    const handleSearch = () => fetchData()
    
    const handleReset = () => {
      Object.assign(searchForm, { keyword: '', status: '' })
      fetchData()
    }

    const handleAdd = () => {
      dialogTitle.value = '添加设施'
      Object.keys(form).forEach(key => form[key] = '')
      form.type = 'fire_extinguisher'
      form.status = 'normal'
      dialogVisible.value = true
    }

    const handleEdit = (row) => {
      dialogTitle.value = '编辑设施'
      Object.assign(form, row)
      dialogVisible.value = true
    }

    const handleSubmit = async () => {
      try {
        const data = {
          name: form.name,
          location: form.location,
          type: form.type,
          status: form.status,
          last_inspection_date: form.lastInspectionDate,
          next_inspection_date: form.nextInspectionDate
        }
        if (form.id) {
          await request.put(`/fire/facilities/${form.id}`, data)
          ElMessage.success('更新成功')
        } else {
          await request.post('/fire/facilities', data)
          ElMessage.success('添加成功')
        }
        dialogVisible.value = false
        fetchData()
      } catch (error) {
        console.error('保存消防设施失败:', error)
        ElMessage.error('保存失败')
      }
    }

    const handleDelete = async (row) => {
      await ElMessageBox.confirm(`确定要删除设施 "${row.name}" 吗？`, '提示', { type: 'warning' })
      try {
        await request.delete(`/fire/facilities/${row.id}`)
        ElMessage.success('删除成功')
        fetchData()
      } catch (error) {
        console.error('删除消防设施失败:', error)
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
      searchForm,
      form,
      getTypeName,
      getStatusName,
      getStatusTag,
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