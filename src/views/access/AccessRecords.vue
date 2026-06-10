<template>
  <div class="page-container">
    <div class="page-header">
      <span class="page-title">通行记录</span>
      <el-button v-if="canEdit" type="success" @click="handleExport">
        <el-icon><Download /></el-icon>
        导出Excel
      </el-button>
    </div>

    <el-card>
      <div class="search-box">
        <el-date-picker
          v-model="searchForm.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 260px"
        />
        <el-select v-model="searchForm.personType" placeholder="人员类型" style="width: 130px" clearable>
          <el-option label="学生" value="student" />
          <el-option label="教师" value="teacher" />
          <el-option label="职工" value="staff" />
        </el-select>
        <el-input v-model="searchForm.keyword" placeholder="姓名/学工号" style="width: 150px" clearable />
        <el-select v-model="searchForm.result" placeholder="通行结果" style="width: 120px" clearable>
          <el-option label="成功" value="success" />
          <el-option label="拒绝" value="fail" />
        </el-select>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>

      <el-table :data="tableData" v-loading="loading" stripe style="width: 100%; margin-top: 20px">
        <el-table-column prop="personName" label="姓名" />
        <el-table-column prop="personNumber" label="学/工号" />
        <el-table-column prop="personType" label="人员类型">
          <template #default="{ row }">
            <el-tag size="small">{{ getPersonTypeName(row.personType) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="accessPointName" label="门禁点" />
        <el-table-column prop="accessTime" label="通行时间" />
        <el-table-column prop="accessType" label="通行方向">
          <template #default="{ row }">
            {{ row.accessType === 'in' ? '进门' : '出门' }}
          </template>
        </el-table-column>
        <el-table-column prop="result" label="结果">
          <template #default="{ row }">
            <el-tag :type="row.result === 'success' ? 'success' : 'danger'" size="small">
              {{ row.result === 'success' ? '成功' : '拒绝' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="备注" />
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px"
        @current-change="fetchData"
        @size-change="fetchData"
      />
    </el-card>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { canEdit } from '@/utils/permission'
import request from '@/utils/request'

export default defineComponent({
  name: 'AccessRecords',
  setup() {
    const loading = ref(false)
    const tableData = ref([])

    const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
    const searchForm = reactive({ dateRange: [], personType: '', keyword: '', result: '' })

    const getPersonTypeName = (type) => ({ student: '学生', teacher: '教师', staff: '职工' }[type] || type)

    const fetchData = async () => {
      loading.value = true
      try {
        const [startDate, endDate] = searchForm.dateRange || []
        const params = {
          page: pagination.page,
          pageSize: pagination.pageSize,
          keyword: searchForm.keyword,
          personType: searchForm.personType,
          result: searchForm.result,
          startDate: startDate ? new Date(startDate).toISOString().slice(0, 19).replace('T', ' ') : null,
          endDate: endDate ? new Date(endDate).toISOString().slice(0, 19).replace('T', ' ') : null
        }
        
        const response = await request.get('/access/records', { params })
        if (response.success && response.data) {
          tableData.value = response.data.map(item => ({
            id: item.id,
            personName: item.person_name || item.personName,
            personNumber: item.person_number || item.personNumber,
            personType: item.person_type || item.personType,
            accessPointName: item.access_point_name || item.accessPointName,
            accessTime: item.access_time || item.accessTime,
            accessType: item.access_type || item.accessType,
            result: item.result,
            reason: item.reason || ''
          }))
          pagination.total = response.total || response.data.length
        }
      } catch (error) {
        console.error('获取通行记录失败:', error)
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
      searchForm.dateRange = []
      searchForm.personType = ''
      searchForm.keyword = ''
      searchForm.result = ''
      pagination.page = 1
      fetchData()
    }

    const handleExport = () => {
      ElMessage.success('导出功能开发中')
    }

    onMounted(() => {
      fetchData()
    })

    return {
      loading,
      tableData,
      pagination,
      searchForm,
      canEdit,
      getPersonTypeName,
      fetchData,
      handleSearch,
      handleReset,
      handleExport
    }
  }
})
</script>

<style lang="scss" scoped>
.page-container {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .page-title {
      font-size: 20px;
      font-weight: 600;
    }
  }

  .search-box {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
  }
}
</style>