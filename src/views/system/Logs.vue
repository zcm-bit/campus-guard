<template>
  <div class="page-container">
    <div class="page-header">
      <span class="page-title">操作日志</span>
    </div>
    <el-card>
      <div class="search-box">
        <el-input v-model="searchForm.keyword" placeholder="搜索操作内容" style="width:180px" clearable />
        <el-select v-model="searchForm.module" placeholder="模块" style="width:130px" clearable>
          <el-option label="用户管理" value="用户管理" />
          <el-option label="门禁管理" value="门禁管理" />
          <el-option label="访客管理" value="访客管理" />
          <el-option label="监控管理" value="监控管理" />
        </el-select>
        <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="至" start-placeholder="开始" end-placeholder="结束" style="width:260px" />
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
      <el-table :data="tableData" v-loading="loading" stripe style="width:100%;margin-top:20px">
        <el-table-column prop="username" label="操作人" />
        <el-table-column prop="module" label="模块" />
        <el-table-column prop="action" label="操作类型" />
        <el-table-column prop="content" label="操作内容" />
        <el-table-column prop="ip" label="IP地址" />
        <el-table-column prop="created_at" label="操作时间" />
      </el-table>
      <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize" :total="pagination.total" layout="total, sizes, prev, pager, next" style="margin-top:20px" @size-change="fetchData" @current-change="fetchData" />
    </el-card>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

export default defineComponent({
  name: 'Logs',
  setup() {
    const loading = ref(false)
    const tableData = ref([])
    const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
    const searchForm = reactive({ keyword: '', module: '', dateRange: [] })

    const fetchData = async () => {
      loading.value = true
      try {
        const params = {
          keyword: searchForm.keyword,
          module: searchForm.module,
          page: pagination.page,
          pageSize: pagination.pageSize
        }
        if (searchForm.dateRange && searchForm.dateRange.length === 2) {
          params.startDate = searchForm.dateRange[0]
          params.endDate = searchForm.dateRange[1]
        }
        const response = await request.get('/logs', { params })
        if (response.success && response.data) {
          tableData.value = response.data.map(item => ({
            id: item.id,
            username: item.username,
            module: item.module,
            action: item.action,
            content: item.content,
            ip: item.ip,
            created_at: item.created_at
          }))
          pagination.total = response.total || tableData.value.length
        }
      } catch (error) {
        console.error('获取操作日志失败:', error)
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
      Object.assign(searchForm, { keyword: '', module: '', dateRange: [] })
      pagination.page = 1
      fetchData()
    }

    onMounted(() => {
      fetchData()
    })

    return { loading, tableData, pagination, searchForm, handleSearch, handleReset }
  }
})
</script>

<style lang="scss" scoped>
.search-box { display: flex; flex-wrap: wrap; gap: 10px; }
</style>