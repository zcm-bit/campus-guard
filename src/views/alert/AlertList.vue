<template>
  <div class="page-container">
    <div class="page-header">
      <span class="page-title">告警列表</span>
    </div>

    <el-row :gutter="20" class="stat-row">
      <el-col :xs="12" :sm="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: #F56C6C;">
            <el-icon><Warning /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.critical }}</div>
            <div class="stat-label">严重告警</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: #E6A23C;">
            <el-icon><Bell /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.warning }}</div>
            <div class="stat-label">警告告警</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: #409EFF;">
            <el-icon><InfoFilled /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.info }}</div>
            <div class="stat-label">提示告警</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: #67C23A;">
            <el-icon><CircleCheck /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.resolved }}</div>
            <div class="stat-label">已处理</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-card>
      <div class="search-box">
        <el-select v-model="searchForm.type" placeholder="告警类型" style="width: 130px" clearable>
          <el-option label="门禁告警" value="access"></el-option>
          <el-option label="设备告警" value="device"></el-option>
          <el-option label="消防告警" value="fire"></el-option>
        </el-select>
        <el-select v-model="searchForm.level" placeholder="告警等级" style="width: 120px" clearable>
          <el-option label="严重" value="critical"></el-option>
          <el-option label="警告" value="warning"></el-option>
          <el-option label="提示" value="info"></el-option>
        </el-select>
        <el-select v-model="searchForm.status" placeholder="处理状态" style="width: 120px" clearable>
          <el-option label="待处理" value="pending"></el-option>
          <el-option label="处理中" value="handling"></el-option>
          <el-option label="已处理" value="resolved"></el-option>
        </el-select>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </div>

      <el-table :data="tableData" v-loading="loading" stripe style="width: 100%; margin-top: 20px;">
        <el-table-column prop="title" label="告警标题"></el-table-column>
        <el-table-column label="类型">
          <template #default="{ row }">
            <el-tag size="small">{{ getTypeName(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="等级">
          <template #default="{ row }">
            <el-tag :type="getLevelTag(row.level)" size="small">{{ getLevelName(row.level) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="location" label="位置"></el-table-column>
        <el-table-column label="时间">
          <template #default="{ row }">
            {{ formatTime(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)" size="small">{{ getStatusName(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button v-if="row.status !== 'resolved' && row.status !== 'handled'" type="primary" size="small" @click="handleHandle(row)">处理</el-button>
            <el-button size="small" @click="handleDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        layout="total, prev, pager, next"
        style="margin-top: 20px;"
        @size-change="fetchData"
        @current-change="fetchData"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

export default defineComponent({
  name: 'AlertList',
  setup() {
    const loading = ref(false)
    const tableData = ref([])
    const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
    const searchForm = reactive({ type: '', level: '', status: '' })
    const stats = ref({ critical: 0, warning: 0, info: 0, resolved: 0 })

    const getTypeName = (type) => {
      const typeLower = (type || '').toLowerCase()
      if (typeLower === 'access' || typeLower === '门禁') {
        return '门禁'
      } else if (typeLower === 'device' || typeLower === '设备') {
        return '设备'
      } else if (typeLower === 'fire' || typeLower === '消防') {
        return '消防'
      }
      return type || '其他'
    }

    const getLevelName = (level) => {
      const levelLower = (level || '').toLowerCase()
      if (levelLower === '严重' || levelLower === 'serious' || levelLower === 'critical') {
        return '严重'
      } else if (levelLower === '警告' || levelLower === 'warning') {
        return '警告'
      } else if (levelLower === '提示' || levelLower === 'info') {
        return '提示'
      }
      return level || '提示'
    }

    const getLevelTag = (level) => {
      const levelLower = (level || '').toLowerCase()
      if (levelLower === '严重' || levelLower === 'serious' || levelLower === 'critical') {
        return 'danger'
      } else if (levelLower === '警告' || levelLower === 'warning') {
        return 'warning'
      } else if (levelLower === '提示' || levelLower === 'info') {
        return 'info'
      }
      return 'info'
    }

    const getStatusName = (status) => {
      const statusLower = (status || '').toLowerCase()
      if (statusLower === 'pending') {
        return '待处理'
      } else if (statusLower === 'handling') {
        return '处理中'
      } else if (statusLower === 'resolved' || statusLower === 'handled') {
        return '已处理'
      }
      return status || '待处理'
    }

    const getStatusTag = (status) => {
      const statusLower = (status || '').toLowerCase()
      if (statusLower === 'pending') {
        return 'danger'
      } else if (statusLower === 'handling') {
        return 'warning'
      } else if (statusLower === 'resolved' || statusLower === 'handled') {
        return 'success'
      }
      return 'info'
    }

    const formatTime = (datetime) => {
      if (!datetime) return ''
      try {
        const dateStr = String(datetime)
        if (dateStr.includes('T')) {
          return new Date(dateStr).toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
        } else if (dateStr.includes(' ')) {
          return dateStr
        }
        return dateStr
      } catch (e) {
        console.error('时间格式化错误:', e)
        return datetime
      }
    }

    const fetchStats = async () => {
      try {
        const response = await request.get('/alerts/stats')
        if (response.success && response.data) {
          stats.value = {
            critical: response.data.critical || 0,
            warning: response.data.warning || 0,
            info: response.data.info || 0,
            resolved: response.data.resolved || 0
          }
        }
      } catch (error) {
        console.error('获取统计数据失败:', error)
      }
    }

    const fetchData = async () => {
      loading.value = true
      try {
        const params = {
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
            location: item.location,
            status: item.status,
            created_at: item.created_at
          }))
          pagination.total = response.total || tableData.value.length
        }
        await fetchStats()
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

    const handleHandle = async (row) => {
      try {
        await request.put(`/alerts/${row.id}`, { status: 'handling' })
        ElMessage.success('已标记为处理中')
        await Promise.all([
          fetchData(),
          fetchStats()
        ])
      } catch (error) {
        console.error('处理失败:', error)
        ElMessage.error('操作失败')
      }
    }

    const handleDetail = (row) => {
      ElMessage.info('详情功能开发中')
    }

    onMounted(() => {
      fetchData()
    })

    return {
      loading,
      tableData,
      pagination,
      searchForm,
      stats,
      getTypeName,
      getLevelName,
      getLevelTag,
      getStatusName,
      getStatusTag,
      formatTime,
      handleSearch,
      handleHandle,
      handleDetail
    }
  }
})
</script>

<style lang="scss" scoped>
.page-container {
  padding: 20px;
  
  .page-header {
    margin-bottom: 20px;
    
    .page-title {
      font-size: 24px;
      font-weight: 600;
      color: #303133;
    }
  }
  
  .stat-row {
    margin-bottom: 20px;
  }
  
  .stat-card {
    display: flex;
    align-items: center;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    
    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 15px;
      
      .el-icon {
        font-size: 30px;
        color: #fff;
      }
    }
    
    .stat-info {
      .stat-value {
        font-size: 28px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 5px;
      }
      
      .stat-label {
        font-size: 14px;
        color: #909399;
      }
    }
  }
  
  .search-box {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
}

@media (max-width: 768px) {
  .page-container {
    padding: 10px;
    
    .page-header {
      .page-title {
        font-size: 20px;
      }
    }
    
    .stat-card {
      padding: 15px;
      margin-bottom: 15px;
      
      .stat-icon {
        width: 50px;
        height: 50px;
        
        .el-icon {
          font-size: 24px;
        }
      }
      
      .stat-info {
        .stat-value {
          font-size: 22px;
        }
      }
    }
    
    .search-box {
      .el-select,
      .el-button {
        width: 100%;
      }
    }
  }
}
</style>

