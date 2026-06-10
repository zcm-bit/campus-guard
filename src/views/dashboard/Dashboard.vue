<template>
  <div class="dashboard">
    <el-row :gutter="20" class="stat-row">
      <el-col :xs="12" :sm="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: #409EFF;">
            <el-icon><User /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.todayAccess }}</div>
            <div class="stat-label">今日通行</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: #67C23A;">
            <el-icon><UserFilled /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalPersonnel }}</div>
            <div class="stat-label">人员总数</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: #E6A23C;">
            <el-icon><Bell /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.todayVisitors }}</div>
            <div class="stat-label">今日访客</div>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: #F56C6C;">
            <el-icon><Warning /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.pendingAlertsCount }}</div>
            <div class="stat-label">待处理告警</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :sm="12">
        <el-card class="chart-card">
          <template #header>
            <span>通行趋势</span>
          </template>
          <div ref="accessChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-card class="chart-card">
          <template #header>
            <span>告警分布</span>
          </template>
          <div ref="alertChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="table-row">
      <el-col :xs="24" :sm="12">
        <el-card>
          <template #header>
            <span>最新通行记录</span>
          </template>
          <el-table :data="recentRecords" style="width: 100%;">
            <el-table-column prop="personName" label="姓名"></el-table-column>
            <el-table-column prop="personNumber" label="学/工号"></el-table-column>
            <el-table-column prop="accessPointName" label="门禁点"></el-table-column>
            <el-table-column prop="accessTime" label="时间"></el-table-column>
            <el-table-column prop="result" label="状态">
              <template #default="{ row }">
                <el-tag :type="row.result === '成功' || row.result === 'success' ? 'success' : 'danger'" size="small">
                  {{ row.result }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-card>
          <template #header>
            <span>待处理告警</span>
          </template>
          <el-table :data="pendingAlerts" style="width: 100%;">
            <el-table-column prop="title" label="告警标题"></el-table-column>
            <el-table-column label="类型">
              <template #default="{ row }">
                <el-tag size="small">{{ row.type }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="level" label="等级">
              <template #default="{ row }">
                <el-tag :type="getLevelType(row.level)" size="small">
                  {{ row.level }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="时间"></el-table-column>
            <el-table-column label="操作" width="80">
              <template #default="{ row }">
                <el-button type="primary" size="small" @click="handleProcessAlert(row)">处理</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

export default defineComponent({
  name: 'Dashboard',
  setup() {
    const accessChartRef = ref(null)
    const alertChartRef = ref(null)
    let accessChart = null
    let alertChart = null

    const stats = reactive({
      todayAccess: 0,
      totalPersonnel: 0,
      todayVisitors: 0,
      pendingAlertsCount: 0
    })

    const recentRecords = ref([])
    const pendingAlerts = ref([])

    const getLevelType = (level) => {
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

    const formatTime = (datetime) => {
      if (!datetime) return '未知'
      try {
        const dateStr = String(datetime)
        if (dateStr.includes('T')) {
          return dayjs(dateStr).format('HH:mm:ss')
        } else if (dateStr.includes(' ')) {
          const timePart = dateStr.split(' ')[1]
          if (timePart) {
            return timePart.substring(0, 8)
          }
        } else if (dateStr.length >= 8) {
          return dateStr.substring(0, 8)
        }
        return dateStr
      } catch (e) {
        console.error('时间格式化错误:', e)
        return '未知'
      }
    }

    const formatAccessTime = (datetime) => {
      if (!datetime) return ''
      try {
        const dateStr = String(datetime)
        if (dateStr.includes('T')) {
          return dayjs(dateStr).format('HH:mm:ss')
        } else if (dateStr.includes(' ')) {
          const timePart = dateStr.split(' ')[1]
          if (timePart) {
            return timePart.substring(0, 8)
          }
          return dateStr
        }
        return dateStr
      } catch (e) {
        return datetime
      }
    }

    const fetchStats = async () => {
      try {
        const response = await request.get('/stats/dashboard')
        if (response.success && response.data) {
          Object.assign(stats, response.data)
        }
      } catch (error) {
        console.error('获取统计数据失败:', error)
      }
    }

    const fetchRecentRecords = async () => {
      try {
        const response = await request.get('/stats/recent-records')
        if (response.success && response.data) {
          recentRecords.value = response.data.slice(0, 5).map(item => ({
            id: item.id,
            personName: item.person_name || item.personName || '',
            personNumber: item.person_number || item.personNumber || '',
            accessPointName: item.access_point_name || item.accessPointName || '',
            accessTime: formatAccessTime(item.access_time || item.accessTime),
            result: item.result || '成功'
          }))
        } else {
          recentRecords.value = [
            { id: 1, personName: '张三', personNumber: '2021001', accessPointName: '南门', accessTime: '09:30:25', result: '成功' },
            { id: 2, personName: '李四', personNumber: '2021002', accessPointName: '宿舍楼1', accessTime: '09:28:10', result: '成功' },
            { id: 3, personName: '王五', personNumber: 'T2021001', accessPointName: '教学楼A', accessTime: '09:25:00', result: '成功' },
            { id: 4, personName: '赵六', personNumber: '2021004', accessPointName: '南门', accessTime: '09:20:15', result: '拒绝' },
            { id: 5, personName: '孙七', personNumber: '2021005', accessPointName: '图书馆', accessTime: '09:15:30', result: '成功' }
          ]
        }
      } catch (error) {
        console.error('获取通行记录失败:', error)
        recentRecords.value = [
          { id: 1, personName: '张三', personNumber: '2021001', accessPointName: '南门', accessTime: '09:30:25', result: '成功' },
          { id: 2, personName: '李四', personNumber: '2021002', accessPointName: '宿舍楼1', accessTime: '09:28:10', result: '成功' },
          { id: 3, personName: '王五', personNumber: 'T2021001', accessPointName: '教学楼A', accessTime: '09:25:00', result: '成功' },
          { id: 4, personName: '赵六', personNumber: '2021004', accessPointName: '南门', accessTime: '09:20:15', result: '拒绝' },
          { id: 5, personName: '孙七', personNumber: '2021005', accessPointName: '图书馆', accessTime: '09:15:30', result: '成功' }
        ]
      }
    }

    const fetchPendingAlerts = async () => {
      try {
        const response = await request.get('/alerts', { params: { status: 'pending,handling' } })
        if (response.success && response.data) {
          pendingAlerts.value = response.data.slice(0, 4).map(item => {
            const typeName = getTypeName(item.type)
            const levelName = getLevelName(item.level)
            const timeStr = formatTime(item.created_at || item.createdAt)
            return {
              id: item.id,
              title: item.title || '',
              type: typeName,
              level: levelName,
              createdAt: timeStr
            }
          })
          stats.pendingAlertsCount = response.total || pendingAlerts.value.length
        } else {
          pendingAlerts.value = [
            { id: 1, title: '南门-尾随告警', type: '门禁', level: '警告', createdAt: '09:35:20' },
            { id: 2, title: '宿舍楼1-门长时间未关闭', type: '门禁', level: '严重', createdAt: '09:30:00' },
            { id: 3, title: '教学楼A-设备离线', type: '设备', level: '提示', createdAt: '09:25:15' },
            { id: 4, title: '图书馆-非法闯入', type: '门禁', level: '严重', createdAt: '09:20:00' }
          ]
          stats.pendingAlertsCount = pendingAlerts.value.length
        }
      } catch (error) {
        console.error('获取告警失败:', error)
        pendingAlerts.value = [
          { id: 1, title: '南门-尾随告警', type: '门禁', level: '警告', createdAt: '09:35:20' },
          { id: 2, title: '宿舍楼1-门长时间未关闭', type: '门禁', level: '严重', createdAt: '09:30:00' },
          { id: 3, title: '教学楼A-设备离线', type: '设备', level: '提示', createdAt: '09:25:15' },
          { id: 4, title: '图书馆-非法闯入', type: '门禁', level: '严重', createdAt: '09:20:00' }
        ]
        stats.pendingAlertsCount = pendingAlerts.value.length
      }
    }

    const handleProcessAlert = async (row) => {
      try {
        const response = await request.put(`/alerts/${row.id}/process`)
        if (response.success) {
          ElMessage.success(`告警 "${row.title}" 已处理`)
          await Promise.all([
            fetchPendingAlerts(),
            fetchStats()
          ])
        } else {
          ElMessage.error('处理失败')
        }
      } catch (error) {
        console.error('处理告警错误:', error)
        ElMessage.error('处理失败')
      }
    }

    const initAccessChart = () => {
      if (!accessChartRef.value) return
      accessChart = echarts.init(accessChartRef.value)

      const days = []
      const data = []
      for (let i = 6; i >= 0; i--) {
        days.push(dayjs().subtract(i, 'day').format('MM-DD'))
        data.push(Math.floor(Math.random() * 500) + 200)
      }

      const option = {
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: days },
        yAxis: { type: 'value' },
        series: [{
          name: '通行人数',
          type: 'line',
          smooth: true,
          data: data,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
              { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
            ])
          },
          lineStyle: { color: '#409EFF' },
          itemStyle: { color: '#409EFF' }
        }]
      }

      accessChart.setOption(option)
    }

    const initAlertChart = () => {
      if (!alertChartRef.value) return
      alertChart = echarts.init(alertChartRef.value)

      const option = {
        tooltip: { trigger: 'item' },
        legend: { bottom: '5%', left: 'center' },
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
          label: { show: false },
          emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold' } },
          data: [
            { value: 35, name: '门禁告警', itemStyle: { color: '#F56C6C' } },
            { value: 25, name: '设备告警', itemStyle: { color: '#E6A23C' } },
            { value: 20, name: '消防告警', itemStyle: { color: '#67C23A' } },
            { value: 20, name: '其他告警', itemStyle: { color: '#409EFF' } }
          ]
        }]
      }

      alertChart.setOption(option)
    }

    const handleResize = () => {
      accessChart?.resize()
      alertChart?.resize()
    }

    const fetchData = async () => {
      await Promise.all([
        fetchStats(),
        fetchRecentRecords(),
        fetchPendingAlerts()
      ])
    }

    onMounted(() => {
      fetchData()
      initAccessChart()
      initAlertChart()
      window.addEventListener('resize', handleResize)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize)
      accessChart?.dispose()
      alertChart?.dispose()
    })

    return {
      accessChartRef,
      alertChartRef,
      stats,
      recentRecords,
      pendingAlerts,
      getLevelType,
      getTypeName,
      getLevelName,
      handleProcessAlert
    }
  }
})
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 20px;
  
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
  
  .chart-row {
    margin-bottom: 20px;
  }
  
  .chart-card {
    .chart-container {
      height: 300px;
    }
  }
  
  .table-row {
    // No additional styles needed
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: 10px;
    
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
    
    .chart-card {
      .chart-container {
        height: 250px;
      }
    }
  }
}
</style>

