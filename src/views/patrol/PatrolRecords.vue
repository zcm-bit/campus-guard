<template>
  <div class="page-container">
    <div class="page-header">
      <span class="page-title">巡检记录</span>
    </div>
    <el-card>
      <div class="search-box">
        <el-input v-model="searchForm.keyword" placeholder="搜索计划/执行人" style="width:200px" clearable />
        <el-date-picker v-model="searchForm.date" type="date" style="width:180px" />
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
      <el-table :data="filteredData" v-loading="loading" stripe style="width:100%;margin-top:20px">
        <el-table-column prop="planName" label="计划名称" />
        <el-table-column prop="executorName" label="执行人" />
        <el-table-column prop="routeName" label="巡检路线" />
        <el-table-column prop="checkinTime" label="签到时间" />
        <el-table-column prop="checkoutTime" label="签退时间" />
        <el-table-column prop="status" label="状态">
          <template #default="{row}">
            <el-tag :type="row.status==='completed'?'success':'warning'" size="small">{{row.status==='completed'?'已完成':'进行中'}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, computed } from 'vue'

const mockRecords = reactive([
  { id: 1, planName: '教学楼日常巡检', executorName: '保安小明', routeName: '教学楼巡检路线A', checkinTime: '2024-01-15 08:00:00', checkoutTime: '2024-01-15 08:30:00', status: 'completed' },
  { id: 2, planName: '宿舍楼夜间巡检', executorName: '保安小红', routeName: '宿舍楼巡检路线', checkinTime: '2024-01-15 22:00:00', checkoutTime: '2024-01-15 22:30:00', status: 'completed' },
  { id: 3, planName: '校园外围巡检', executorName: '保安老王', routeName: '校园外围巡检路线', checkinTime: '2024-01-15 09:00:00', checkoutTime: '', status: 'ongoing' }
])

export default defineComponent({
  name: 'PatrolRecords',
  setup() {
    const loading = ref(false)
    const searchForm = reactive({ keyword: '', date: '' })

    const filteredData = computed(() => {
      let result = [...mockRecords]
      if (searchForm.keyword) {
        const keyword = searchForm.keyword.toLowerCase()
        result = result.filter(item => item.planName.toLowerCase().includes(keyword) || item.executorName.toLowerCase().includes(keyword))
      }
      return result
    })

    const handleSearch = () => {}
    const handleReset = () => Object.assign(searchForm, { keyword: '', date: '' })

    return { loading, filteredData, searchForm, handleSearch, handleReset }
  }
})
</script>

<style lang="scss" scoped>
.search-box { display: flex; flex-wrap: wrap; gap: 10px; }
</style>
