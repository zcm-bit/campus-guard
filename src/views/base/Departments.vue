<template>
  <div class="page-container">
    <div class="page-header">
      <span class="page-title">院系管理</span>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增院系
      </el-button>
    </div>

    <el-card>
      <div class="search-box">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索院系名称/院长"
          style="width: 250px"
          clearable
        />
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>

      <el-table :data="tableData" v-loading="loading" stripe style="width: 100%; margin-top: 20px">
        <el-table-column prop="name" label="院系名称" />
        <el-table-column prop="dean" label="院长" />
        <el-table-column prop="phone" label="联系电话" />
        <el-table-column prop="student_count" label="学生人数" />
        <el-table-column prop="teacher_count" label="教师人数" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px"
        @size-change="fetchData"
        @current-change="fetchData"
      />
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="80px">
        <el-form-item label="院系名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="院长" prop="dean">
          <el-input v-model="form.dean" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="学生人数" prop="student_count">
          <el-input v-model.number="form.student_count" type="number" />
        </el-form-item>
        <el-form-item label="教师人数" prop="teacher_count">
          <el-input v-model.number="form.teacher_count" type="number" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
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
  name: 'Departments',
  setup() {
    const loading = ref(false)
    const dialogVisible = ref(false)
    const dialogTitle = ref('')
    const formRef = ref(null)
    const tableData = ref([])

    const pagination = reactive({
      page: 1,
      pageSize: 10,
      total: 0
    })

    const searchForm = reactive({
      keyword: ''
    })

    const form = reactive({
      id: '',
      name: '',
      dean: '',
      phone: '',
      student_count: 0,
      teacher_count: 0
    })

    const formRules = {
      name: [{ required: true, message: '请输入院系名称', trigger: 'blur' }],
      dean: [{ required: true, message: '请输入院长姓名', trigger: 'blur' }],
      phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
      student_count: [{ required: true, message: '请输入学生人数', trigger: 'blur' }],
      teacher_count: [{ required: true, message: '请输入教师人数', trigger: 'blur' }]
    }

    const fetchData = async () => {
      loading.value = true
      try {
        const params = {
          keyword: searchForm.keyword,
          page: pagination.page,
          pageSize: pagination.pageSize
        }
        const response = await request.get('/departments', { params })
        if (response.success && response.data) {
          tableData.value = response.data
          pagination.total = response.total || tableData.value.length
        }
      } catch (error) {
        console.error('获取院系列表失败:', error)
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
      Object.assign(searchForm, { keyword: '' })
      pagination.page = 1
      fetchData()
    }

    const handleAdd = () => {
      dialogTitle.value = '新增院系'
      Object.assign(form, { id: '', name: '', dean: '', phone: '', student_count: 0, teacher_count: 0 })
      dialogVisible.value = true
    }

    const handleEdit = (row) => {
      dialogTitle.value = '编辑院系'
      Object.assign(form, { ...row })
      dialogVisible.value = true
    }

    const handleSubmit = async () => {
      if (!formRef.value) return
      await formRef.value.validate(async (valid) => {
        if (!valid) return
        
        try {
          const data = {
            name: form.name,
            dean: form.dean,
            phone: form.phone,
            student_count: form.student_count,
            teacher_count: form.teacher_count
          }
          
          if (form.id) {
            await request.put(`/departments/${form.id}`, data)
            ElMessage.success('更新成功')
          } else {
            await request.post('/departments', data)
            ElMessage.success('创建成功')
          }
          
          dialogVisible.value = false
          fetchData()
        } catch (error) {
          console.error('保存失败:', error)
          ElMessage.error('操作失败')
        }
      })
    }

    const handleDialogClose = () => {
      formRef.value?.resetFields()
    }

    const handleDelete = async (row) => {
      await ElMessageBox.confirm(`确定要删除院系 ${row.name} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      
      try {
        await request.delete(`/departments/${row.id}`)
        ElMessage.success('删除成功')
        fetchData()
      } catch (error) {
        console.error('删除失败:', error)
        ElMessage.error('删除失败')
      }
    }

    onMounted(() => {
      fetchData()
    })

    return {
      loading,
      pagination,
      searchForm,
      dialogVisible,
      dialogTitle,
      form,
      formRules,
      formRef,
      tableData,
      handleSearch,
      handleReset,
      handleAdd,
      handleEdit,
      handleSubmit,
      handleDialogClose,
      handleDelete
    }
  }
})
</script>

<style lang="scss" scoped>
.search-box {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>