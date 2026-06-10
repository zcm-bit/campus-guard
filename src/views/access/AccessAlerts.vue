<template>
  <div class="page-container">
    <div class="page-header">
      <span class="page-title">门禁告警</span>
    </div>
    <el-card>
      <div class="search-box">
        <el-input v-model="searchForm.keyword" placeholder="搜索标题/位置" style="width:200px" clearable />
        <el-select v-model="searchForm.level" placeholder="等级" style="width:120px" clearable>
          <el-option label="严重" value="严重" />
          <el-option label="警告" value="警告" />
          <el-option label="提示" value="提示" />
        </el-select>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
      <el-table :data="tableData" v-loading="loading" stripe style="width:100%;margin-top:20px">
        <el-table-column prop="title" label="告警标题" />
        <el-table-column prop="type" label="类型">
          <template #default="{row}">
            <el-tag size="small">{{getTypeName(row.type)}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="level" label="等级">
          <template #default="{row}">
            <el-tag :type="getLevelTag(row.level)" size="small">{{row.level}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="location" label="位置" />
        <el-table-column prop="createdAt" label="时间" />
        <el-table-column label="操作" width="150">
          <template #default="{row}">
            <el-button type="primary" size="small" @click="handleProcess(row)">处理</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'

export default defineComponent({
  name: 'AccessAlerts',
  setup() {
    const loading = ref(false)
    const tableData = ref([])
    const searchForm = reactive({ keyword: '', level: '' })
    
    const getTypeName = (t) => ({ access: '门禁告警', device: '设备告警', fire: '消防告警' }[t] || t)
    const getLevelTag = (l) => ({ '严重': 'danger', '警告': 'warning', '提示': 'info' }[l] || 'info')

    const fetchData = async () => {
      loading.value = true
      try {
        const params = {
          keyword: searchForm.keyword,
          level: searchForm.level,
          status: 'pending,handling'
        }
        const response = await request.get('/alerts', { params })
        if (response.success && response.data) {
          tableData.value = response.data.map(item => ({
            id: item.id,
            title: item.title,
            type: item.type,
            level: item.level,
            location: item.location,
            status: item.status,
            createdAt: item.created_at || item.createdAt
          }))
        }
      } catch (error) {
        console.error('获取告警列表失败:', error)
        ElMessage.error('获取数据失败')
      } finally {
        loading.value = false
      }
    }

    const handleSearch = () => fetchData()
    
    const handleReset = () => {
      Object.assign(searchForm, { keyword: '', level: '' })
      fetchData()
    }

    const handleProcess = async (row) => {
      try {
        const response = await request.put(`/alerts/${row.id}/process`)
        if (response.success) {
          ElMessage.success(`告警 "${row.title}" 已处理`)
          fetchData()
        }
      } catch (error) {
        console.error('处理告警失败:', error)
        ElMessage.error('处理失败')
      }
    }

    const handleDelete = async (row) => {
      await ElMessageBox.confirm(`确定要删除告警 "${row.title}" 吗？`, '提示', { type: 'warning' })
      try {
        const response = await request.delete(`/alerts/${row.id}`)
        if (response.success) {
          ElMessage.success('删除成功')
          fetchData()
        }
      } catch (error) {
        console.error('删除告警失败:', error)
        ElMessage.error('删除失败')
      }
    }

    onMounted(() => {
      fetchData()
    })

    return { loading, tableData, searchForm, getTypeName, getLevelTag, handleSearch, handleReset, handleProcess, handleDelete }
  }
})
</script>

<style lang="scss" scoped>
.search-box { display: flex; flex-wrap: wrap; gap: 10px; }
</style>