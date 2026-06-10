<template>
  <div class="page-container">
    <div class="page-header"><span class="page-title">人员档案</span><el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon>新增人员</el-button></div>
    <el-card>
      <div class="search-box">
        <el-input v-model="searchForm.keyword" placeholder="姓名/学工号" style="width:150px" clearable />
        <el-select v-model="searchForm.type" placeholder="人员类型" style="width:120px" clearable><el-option label="学生" value="student" /><el-option label="教师" value="teacher" /><el-option label="职工" value="admin" /></el-select>
        <el-select v-model="searchForm.departmentId" placeholder="院系" style="width:150px" clearable><el-option v-for="dept in departments" :key="dept.id" :label="dept.name" :value="dept.id" /></el-select>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
      <el-table :data="tableData" v-loading="loading" stripe style="width:100%;margin-top:20px">
        <el-table-column prop="number" label="学/工号" /><el-table-column prop="name" label="姓名" />
        <el-table-column prop="type" label="类型"><template #default="{row}"><el-tag size="small">{{getTypeName(row.type)}}</el-tag></template></el-table-column>
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="department" label="院系/部门" />
        <el-table-column prop="class_name" label="班级" />
        <el-table-column prop="status" label="状态"><template #default="{row}"><el-tag :type="row.status==='active'?'success':'danger'" size="small">{{row.status==='active'?'正常':'离校'}}</el-tag></template></el-table-column>
        <el-table-column label="操作" width="150"><template #default="{row}"><el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button><el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button></template></el-table-column>
      </el-table>
    </el-card>
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form ref="formRef" :model="form" label-width="80px">
        <el-row :gutter="20"><el-col :span="12"><el-form-item label="学/工号" prop="number"><el-input v-model="form.number" /></el-form-item></el-col><el-col :span="12"><el-form-item label="姓名" prop="name"><el-input v-model="form.name" /></el-form-item></el-col></el-row>
        <el-row :gutter="20"><el-col :span="12"><el-form-item label="类型" prop="type"><el-select v-model="form.type" style="width:100%"><el-option label="学生" value="student" /><el-option label="教师" value="teacher" /><el-option label="职工" value="admin" /></el-select></el-form-item></el-col><el-col :span="12"><el-form-item label="手机号" prop="phone"><el-input v-model="form.phone" /></el-form-item></el-col></el-row>
        <el-row :gutter="20"><el-col :span="12"><el-form-item label="院系" prop="department"><el-input v-model="form.department" /></el-form-item></el-col><el-col :span="12"><el-form-item label="班级" prop="class_name"><el-input v-model="form.class_name" /></el-form-item></el-col></el-row>
        <el-form-item label="邮箱" prop="email"><el-input v-model="form.email" /></el-form-item>
        <el-form-item label="身份证号" prop="id_card"><el-input v-model="form.id_card" /></el-form-item>
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
  name: 'Personnel',
  setup() {
    const loading = ref(false), dialogVisible = ref(false), dialogTitle = ref(''), formRef = ref(null)
    const tableData = ref([])
    const departments = ref([])
    
    const searchForm = reactive({ keyword: '', type: '', departmentId: '' })
    const form = reactive({ id: '', number: '', name: '', type: 'student', phone: '', department: '', class_name: '', email: '', id_card: '' })
    
    const getTypeName = (t) => ({ student: '学生', teacher: '教师', admin: '职工' }[t] || t)

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
          type: searchForm.type
        }
        const response = await request.get('/personnel', { params })
        if (response.success && response.data) {
          tableData.value = response.data.map(item => ({
            id: item.id,
            number: item.number,
            name: item.name,
            type: item.type,
            phone: item.phone,
            department: item.department,
            class_name: item.class_name,
            email: item.email,
            id_card: item.id_card,
            status: item.status
          }))
        }
      } catch (error) {
        console.error('获取人员列表失败:', error)
        ElMessage.error('获取数据失败')
      } finally {
        loading.value = false
      }
    }

    const handleSearch = () => {
      fetchData()
    }

    const handleReset = () => {
      Object.assign(searchForm, { keyword: '', type: '', departmentId: '' })
      fetchData()
    }

    const handleAdd = () => {
      dialogTitle.value = '新增人员'
      Object.assign(form, { id: '', number: '', name: '', type: 'student', phone: '', department: '', class_name: '', email: '', id_card: '' })
      dialogVisible.value = true
    }

    const handleEdit = (row) => {
      dialogTitle.value = '编辑人员'
      Object.assign(form, row)
      dialogVisible.value = true
    }

    const handleSubmit = async () => {
      try {
        const data = {
          name: form.name,
          number: form.number,
          type: form.type,
          department: form.department,
          class_name: form.class_name,
          phone: form.phone,
          email: form.email,
          id_card: form.id_card
        }
        
        if (form.id) {
          await request.put(`/personnel/${form.id}`, data)
          ElMessage.success('更新成功')
        } else {
          await request.post('/personnel', data)
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
        await request.delete(`/personnel/${row.id}`)
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

    return { loading, tableData, dialogVisible, dialogTitle, form, formRef, searchForm, departments, getTypeName, handleSearch, handleReset, handleAdd, handleEdit, handleSubmit, handleDelete }
  }
})
</script>

<style lang="scss" scoped>
.search-box { display: flex; flex-wrap: wrap; gap: 10px; }
</style>
