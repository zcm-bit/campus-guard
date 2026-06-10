<template>
  <div class="page-container">
    <div class="page-header">
      <span class="page-title">监控点管理</span>
      <el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon>新增监控点</el-button>
    </div>
    <el-card>
      <el-table :data="tableData" v-loading="loading" stripe style="width: 100%">
        <el-table-column prop="name" label="监控点名称" />
        <el-table-column prop="location" label="位置" />
        <el-table-column prop="ipAddress" label="IP地址" />
        <el-table-column prop="type" label="类型">
          <template #default="{ row }">
            <el-tag :type="getTypeTag(row.type)" size="small">{{ getTypeName(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '在线' : '离线' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="form" label-width="80px">
        <el-form-item label="名称" prop="name"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="位置" prop="location"><el-input v-model="form.location" /></el-form-item>
        <el-form-item label="IP地址" prop="ipAddress"><el-input v-model="form.ipAddress" /></el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" style="width: 100%">
            <el-option label="球机" value="dome" />
            <el-option label="枪机" value="bullet" />
            <el-option label="半球" value="hemisphere" />
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
  name: 'CameraList',
  setup() {
    const loading = ref(false)
    const tableData = ref([])
    const dialogVisible = ref(false)
    const dialogTitle = ref('')
    const formRef = ref(null)
    const form = reactive({ id: '', name: '', location: '', ipAddress: '', type: '' })
    const typeMap = { dome: { name: '球机', tag: 'primary' }, bullet: { name: '枪机', tag: 'success' }, hemisphere: { name: '半球', tag: 'warning' } }
    const getTypeName = (t) => typeMap[t]?.name || t
    const getTypeTag = (t) => typeMap[t]?.tag || 'info'

    const fetchData = async () => {
      loading.value = true
      try {
        const response = await request.get('/cameras')
        if (response.success && response.data) {
          tableData.value = response.data.map(item => ({
            id: item.id,
            name: item.name,
            location: item.location,
            ipAddress: item.ip_address || item.ipAddress,
            type: item.type || 'dome',
            status: item.status === 'online' ? 1 : 0
          }))
        } else {
          tableData.value = [
            { id: 1, name: '南门监控', location: '南门入口', ipAddress: '192.168.1.101', type: 'dome', status: 1 },
            { id: 2, name: '教学楼A大厅', location: '教学楼A栋大厅', ipAddress: '192.168.1.102', type: 'bullet', status: 1 },
            { id: 3, name: '图书馆阅览室', location: '图书馆2楼', ipAddress: '192.168.1.103', type: 'hemisphere', status: 0 },
            { id: 4, name: '操场全景', location: '操场看台', ipAddress: '192.168.1.104', type: 'dome', status: 1 }
          ]
        }
      } catch (error) {
        console.error('获取监控点列表失败:', error)
        tableData.value = [
          { id: 1, name: '南门监控', location: '南门入口', ipAddress: '192.168.1.101', type: 'dome', status: 1 },
          { id: 2, name: '教学楼A大厅', location: '教学楼A栋大厅', ipAddress: '192.168.1.102', type: 'bullet', status: 1 },
          { id: 3, name: '图书馆阅览室', location: '图书馆2楼', ipAddress: '192.168.1.103', type: 'hemisphere', status: 0 },
          { id: 4, name: '操场全景', location: '操场看台', ipAddress: '192.168.1.104', type: 'dome', status: 1 }
        ]
      } finally { loading.value = false }
    }

    const handleAdd = () => { dialogTitle.value = '新增监控点'; Object.assign(form, { id: '', name: '', location: '', ipAddress: '', type: 'dome' }); dialogVisible.value = true }
    const handleEdit = (row) => { dialogTitle.value = '编辑监控点'; Object.assign(form, row); dialogVisible.value = true }
    
    const handleSubmit = async () => {
      try {
        const data = {
          name: form.name,
          location: form.location,
          ip_address: form.ipAddress,
          type: form.type,
          status: 'online'
        }
        if (form.id) {
          await request.put(`/cameras/${form.id}`, data)
          ElMessage.success('更新成功')
        } else {
          await request.post('/cameras', data)
          ElMessage.success('创建成功')
        }
        dialogVisible.value = false
        fetchData()
      } catch (error) {
        console.error('保存监控点失败:', error)
        ElMessage.error('保存失败')
      }
    }
    
    const handleDelete = async (row) => {
      await ElMessageBox.confirm(`确定要删除 ${row.name} 吗？`, '提示', { type: 'warning' })
      try {
        await request.delete(`/cameras/${row.id}`)
        ElMessage.success('删除成功')
        fetchData()
      } catch (error) {
        console.error('删除监控点失败:', error)
        ElMessage.error('删除失败')
      }
    }

    onMounted(() => fetchData())
    return { loading, tableData, dialogVisible, dialogTitle, form, formRef, getTypeName, getTypeTag, handleAdd, handleEdit, handleSubmit, handleDelete }
  }
})
</script>
