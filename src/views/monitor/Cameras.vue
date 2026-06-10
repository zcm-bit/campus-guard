<template>
  <div class="page-container">
    <div class="page-header">
      <span class="page-title">监控设备管理</span>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        添加设备
      </el-button>
    </div>

    <el-card>
      <div class="search-box">
        <el-input v-model="searchForm.keyword" placeholder="搜索名称/位置" style="width:200px" clearable />
        <el-select v-model="searchForm.status" placeholder="状态" style="width:120px" clearable>
          <el-option label="在线" value="online" />
          <el-option label="离线" value="offline" />
        </el-select>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>

      <el-table :data="tableData" v-loading="loading" stripe style="width:100%;margin-top:20px">
        <el-table-column prop="name" label="设备名称" />
        <el-table-column prop="location" label="安装位置" />
        <el-table-column prop="status" label="状态">
          <template #default="{row}">
            <el-tag :type="row.status === 'online' ? 'success' : 'danger'">{{row.status === 'online' ? '在线' : '离线'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ipAddress" label="IP地址" />
        <el-table-column prop="createdAt" label="创建时间" />
        <el-table-column label="操作" width="200">
          <template #default="{row}">
            <el-button type="primary" size="small" @click="handlePreview(row)">预览</el-button>
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="form" label-width="100px">
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="安装位置" prop="location">
          <el-input v-model="form.location" placeholder="请输入安装位置" />
        </el-form-item>
        <el-form-item label="IP地址" prop="ipAddress">
          <el-input v-model="form.ipAddress" placeholder="请输入IP地址" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status">
            <el-option label="在线" value="online" />
            <el-option label="离线" value="offline" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="previewVisible" title="摄像头预览" width="800px">
      <div class="camera-preview">
        <img :src="previewUrl" alt="摄像头画面" />
        <div class="preview-info">设备: {{ previewCamera?.name }} - {{ previewCamera?.location }}</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'

export default defineComponent({
  name: 'Cameras',
  setup() {
    const loading = ref(false)
    const tableData = ref([])
    const dialogVisible = ref(false)
    const previewVisible = ref(false)
    const dialogTitle = ref('添加设备')
    const formRef = ref(null)
    const searchForm = reactive({ keyword: '', status: '' })
    const form = reactive({
      id: '',
      name: '',
      location: '',
      ipAddress: '',
      status: 'online'
    })
    const previewCamera = ref(null)
    const previewUrl = ref('https://neeko-copilot.bytedance.net/api/text_to_image?prompt=security%20camera%20monitoring%20campus%20area%20at%20daytime&image_size=landscape_16_9')

    const fetchData = async () => {
      loading.value = true
      try {
        const params = {
          keyword: searchForm.keyword,
          status: searchForm.status
        }
        const response = await request.get('/cameras', { params })
        if (response.success && response.data) {
          tableData.value = response.data.map(item => ({
            id: item.id,
            name: item.name,
            location: item.location,
            status: item.status,
            ipAddress: item.ip_address || item.ipAddress,
            createdAt: item.created_at || item.createdAt
          }))
        }
      } catch (error) {
        console.error('获取摄像头列表失败:', error)
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
      dialogTitle.value = '添加设备'
      Object.keys(form).forEach(key => form[key] = '')
      form.status = 'online'
      dialogVisible.value = true
    }

    const handleEdit = (row) => {
      dialogTitle.value = '编辑设备'
      Object.assign(form, row)
      dialogVisible.value = true
    }

    const handlePreview = (row) => {
      previewCamera.value = row
      previewVisible.value = true
    }

    const handleSubmit = async () => {
      try {
        const data = {
          name: form.name,
          location: form.location,
          ip_address: form.ipAddress,
          status: form.status
        }
        if (form.id) {
          await request.put(`/cameras/${form.id}`, data)
          ElMessage.success('更新成功')
        } else {
          await request.post('/cameras', data)
          ElMessage.success('添加成功')
        }
        dialogVisible.value = false
        fetchData()
      } catch (error) {
        console.error('保存摄像头失败:', error)
        ElMessage.error('保存失败')
      }
    }

    const handleDelete = async (row) => {
      await ElMessageBox.confirm(`确定要删除摄像头 "${row.name}" 吗？`, '提示', { type: 'warning' })
      try {
        await request.delete(`/cameras/${row.id}`)
        ElMessage.success('删除成功')
        fetchData()
      } catch (error) {
        console.error('删除摄像头失败:', error)
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
      previewVisible,
      dialogTitle,
      formRef,
      searchForm,
      form,
      previewCamera,
      previewUrl,
      handleSearch,
      handleReset,
      handleAdd,
      handleEdit,
      handlePreview,
      handleSubmit,
      handleDelete
    }
  }
})
</script>

<style lang="scss" scoped>
.search-box { display: flex; flex-wrap: wrap; gap: 10px; }
.camera-preview {
  img { width: 100%; height: 400px; object-fit: cover; border-radius: 8px; }
  .preview-info { text-align: center; margin-top: 10px; color: #666; }
}
</style>