<template>
  <div class="page-container">
    <div class="page-header">
      <span class="page-title">巡检计划</span>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增计划
      </el-button>
    </div>
    <el-card>
      <div class="search-box">
        <el-input v-model="searchForm.keyword" placeholder="搜索计划名称" style="width:200px" clearable />
        <el-select v-model="searchForm.shiftType" placeholder="班次" style="width:120px" clearable>
          <el-option label="白班" value="morning" />
          <el-option label="夜班" value="night" />
        </el-select>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
      <el-table :data="tableData" v-loading="loading" stripe style="width:100%;margin-top:20px">
        <el-table-column prop="name" label="计划名称" />
        <el-table-column prop="routeName" label="巡检路线" />
        <el-table-column prop="executorName" label="执行人" />
        <el-table-column prop="shiftType" label="班次">
          <template #default="{row}">
            <el-tag :type="row.shiftType==='morning'?'success':'warning'" size="small">{{row.shiftType==='morning'?'白班':'夜班'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="period" label="周期" />
        <el-table-column prop="status" label="状态">
          <template #default="{row}">
            <el-tag :type="row.status===1?'success':'danger'" size="small">{{row.status===1?'启用':'禁用'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{row}">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="form" label-width="80px">
        <el-form-item label="计划名称" prop="name"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="巡检路线" prop="routeId">
          <el-select v-model="form.routeId" style="width:100%">
            <el-option v-for="route in patrolRoutes" :key="route.id" :label="route.name" :value="route.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="执行人" prop="executorName"><el-input v-model="form.executorName" /></el-form-item>
        <el-form-item label="班次" prop="shiftType">
          <el-select v-model="form.shiftType" style="width:100%">
            <el-option label="白班" value="morning" />
            <el-option label="夜班" value="night" />
          </el-select>
        </el-form-item>
        <el-form-item label="周期" prop="period"><el-input v-model="form.period" /></el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible=false">取消</el-button>
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
  name: 'PatrolPlans',
  setup() {
    const loading = ref(false)
    const dialogVisible = ref(false)
    const dialogTitle = ref('')
    const formRef = ref(null)
    const tableData = ref([])
    const patrolRoutes = ref([])

    const searchForm = reactive({ keyword: '', shiftType: '' })
    const form = reactive({ id: '', name: '', routeId: '', executorName: '', shiftType: 'morning', period: 'daily', status: 1 })

    const fetchRoutes = async () => {
      try {
        const response = await request.get('/patrol/routes')
        if (response.success && response.data) {
          patrolRoutes.value = response.data
        }
      } catch (error) {
        console.error('获取巡检路线失败:', error)
      }
    }

    const fetchData = async () => {
      loading.value = true
      try {
        const response = await request.get('/patrol/plans')
        if (response.success && response.data) {
          tableData.value = response.data.map(item => ({
            id: item.id,
            name: item.name,
            routeId: item.route_id,
            routeName: item.route_name,
            executorName: item.executor_name,
            shiftType: item.shift_type,
            period: item.period === 'daily' ? '每天' : (item.period === 'weekly' ? '每周' : '每月'),
            status: item.status
          }))
        }
      } catch (error) {
        console.error('获取巡检计划失败:', error)
        ElMessage.error('获取数据失败')
      } finally {
        loading.value = false
      }
    }

    const handleSearch = () => {
      fetchData()
    }

    const handleReset = () => {
      Object.assign(searchForm, { keyword: '', shiftType: '' })
      fetchData()
    }

    const handleAdd = () => {
      dialogTitle.value = '新增计划'
      Object.assign(form, { id: '', name: '', routeId: '', executorName: '', shiftType: 'morning', period: 'daily', status: 1 })
      dialogVisible.value = true
    }

    const handleEdit = (row) => {
      dialogTitle.value = '编辑计划'
      Object.assign(form, {
        id: row.id,
        name: row.name,
        routeId: row.routeId,
        executorName: row.executorName,
        shiftType: row.shiftType,
        period: row.period === '每天' ? 'daily' : (row.period === '每周' ? 'weekly' : 'monthly'),
        status: row.status
      })
      dialogVisible.value = true
    }

    const handleSubmit = async () => {
      try {
        const data = {
          name: form.name,
          route_id: form.routeId,
          executor_name: form.executorName,
          shift_type: form.shiftType,
          period: form.period,
          status: form.status
        }
        
        if (form.id) {
          await request.put(`/patrol/plans/${form.id}`, data)
          ElMessage.success('更新成功')
        } else {
          await request.post('/patrol/plans', data)
          ElMessage.success('创建成功')
        }
        dialogVisible.value = false
        fetchData()
      } catch (error) {
        console.error('保存失败:', error)
        ElMessage.error('操作失败')
      }
    }

    const handleDelete = async (row) => {
      await ElMessageBox.confirm(`确定要删除计划 "${row.name}" 吗？`, '提示', { type: 'warning' })
      try {
        await request.delete(`/patrol/plans/${row.id}`)
        ElMessage.success('删除成功')
        fetchData()
      } catch (error) {
        console.error('删除失败:', error)
        ElMessage.error('删除失败')
      }
    }

    onMounted(() => {
      fetchRoutes()
      fetchData()
    })

    return { loading, tableData, dialogVisible, dialogTitle, form, formRef, searchForm, patrolRoutes, handleSearch, handleReset, handleAdd, handleEdit, handleSubmit, handleDelete }
  }
})
</script>

<style lang="scss" scoped>
.search-box { display: flex; flex-wrap: wrap; gap: 10px; }
</style>
