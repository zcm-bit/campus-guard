<template>
  <div class="page-container">
    <div class="page-header">
      <span class="page-title">班级管理</span>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增班级
      </el-button>
    </div>

    <el-card>
      <div class="search-box">
        <el-input v-model="searchForm.keyword" placeholder="搜索班级名称" style="width:200px" clearable />
        <el-select v-model="searchForm.departmentId" placeholder="所属院系" style="width:150px" clearable><el-option v-for="dept in departments" :key="dept.id" :label="dept.name" :value="dept.id" /></el-select>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>

      <el-table :data="tableData" v-loading="loading" stripe style="width:100%;margin-top:20px">
        <el-table-column prop="name" label="班级名称" />
        <el-table-column prop="department" label="所属院系" />
        <el-table-column prop="teacher" label="班主任" />
        <el-table-column prop="student_count" label="学生人数" />
        <el-table-column prop="created_at" label="创建时间" />
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="form" label-width="80px">
        <el-form-item label="班级名称" prop="name"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="所属院系" prop="department">
          <el-select v-model="form.department" style="width:100%">
            <el-option v-for="dept in departments" :key="dept.id" :label="dept.name" :value="dept.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="班主任" prop="teacher"><el-input v-model="form.teacher" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary" @click="handleSubmit">确定</el-button></template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'

export default defineComponent({
  name: 'Classes',
  setup() {
    const loading = ref(false), dialogVisible = ref(false), dialogTitle = ref(''), formRef = ref(null)
    const tableData = ref([])
    const departments = ref([])
    
    const searchForm = reactive({ keyword: '', departmentId: '' })
    const form = reactive({ id: '', name: '', department: '', teacher: '' })

    const fetchDepartments = async () => {
      try {
        const response = await request.get('/departments')
        if (response.success && response.data) {
          departments.value = response.data
        }
      } catch (error) {
        console.error('获取院系失败:', error)
      }
    }

    const fetchData = async () => {
      loading.value = true
      try {
        const params = {
          keyword: searchForm.keyword,
          departmentId: searchForm.departmentId
        }
        const response = await request.get('/classes', { params })
        if (response.success && response.data) {
          tableData.value = response.data.map(item => ({
            id: item.id,
            name: item.name,
            department: item.department,
            teacher: item.teacher,
            student_count: item.student_count || 0,
            created_at: item.created_at
          }))
        }
      } catch (error) {
        console.error('获取班级列表失败:', error)
        ElMessage.error('获取数据失败')
      } finally {
        loading.value = false
      }
    }

    const handleSearch = () => {
      fetchData()
    }

    const handleReset = () => {
      Object.assign(searchForm, { keyword: '', departmentId: '' })
      fetchData()
    }

    const handleAdd = () => {
      dialogTitle.value = '新增班级'
      Object.assign(form, { id: '', name: '', department: '', teacher: '' })
      dialogVisible.value = true
    }

    const handleEdit = (row) => {
      dialogTitle.value = '编辑班级'
      Object.assign(form, row)
      dialogVisible.value = true
    }

    const handleSubmit = async () => {
      try {
        const data = {
          name: form.name,
          department: form.department,
          teacher: form.teacher
        }
        
        if (form.id) {
          await request.put(`/classes/${form.id}`, data)
          ElMessage.success('更新成功')
        } else {
          await request.post('/classes', data)
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
      await ElMessageBox.confirm(`确定要删除 ${row.name} 吗？`, '提示', { type: 'warning' })
      try {
        await request.delete(`/classes/${row.id}`)
        ElMessage.success('删除成功')
        fetchData()
      } catch (error) {
        console.error('删除失败:', error)
        ElMessage.error('删除失败')
      }
    }

    onMounted(() => {
      fetchDepartments()
      fetchData()
    })

    return { loading, tableData, dialogVisible, dialogTitle, form, formRef, searchForm, departments, handleSearch, handleReset, handleAdd, handleEdit, handleSubmit, handleDelete }
  }
})
</script>

<style lang="scss" scoped>
.search-box { display: flex; flex-wrap: wrap; gap: 10px; }
</style>