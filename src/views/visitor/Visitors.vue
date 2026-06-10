<template>
  <div class="page-container">
    <div class="page-header">
      <span class="page-title">访客管理</span>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增访客
      </el-button>
    </div>

    <el-card>
      <div class="search-box">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索姓名/手机号/证件号"
          style="width: 250px"
          clearable
        />
        <el-select v-model="searchForm.status" placeholder="状态" style="width: 120px" clearable>
          <el-option label="预约中" value="reserved" />
          <el-option label="访问中" value="visiting" />
          <el-option label="已离开" value="left" />
        </el-select>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>

      <el-table :data="tableData" v-loading="loading" stripe style="width: 100%; margin-top: 20px">
        <el-table-column prop="name" label="访客姓名" />
        <el-table-column prop="id_card" label="证件号码" />
        <el-table-column prop="phone" label="联系电话" />
        <el-table-column prop="company" label="单位" />
        <el-table-column prop="purpose" label="来访目的" />
        <el-table-column prop="host_name" label="接待人" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)" size="small">{{ getStatusName(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="visit_time" label="来访时间" />
        <el-table-column prop="leave_time" label="离开时间" />
        <el-table-column label="操作" width="180">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button v-if="row.status === 'visiting'" type="success" size="small" @click="handleSignOut(row)">签离</el-button>
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
        @current-change="fetchData"
        @size-change="fetchData"
      />
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="证件号码" prop="id_card">
          <el-input v-model="form.id_card" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="单位" prop="company">
          <el-input v-model="form.company" />
        </el-form-item>
        <el-form-item label="来访目的" prop="purpose">
          <el-select v-model="form.purpose" style="width: 100%">
            <el-option label="技术交流" value="技术交流" />
            <el-option label="合作洽谈" value="合作洽谈" />
            <el-option label="招聘宣讲" value="招聘宣讲" />
            <el-option label="探亲访友" value="探亲访友" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="接待人" prop="host_name">
          <el-input v-model="form.host_name" />
        </el-form-item>
        <el-form-item label="来访时间" prop="visit_time">
          <el-date-picker v-model="form.visit_time" type="datetime" style="width: 100%" />
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
  name: 'Visitors',
  setup() {
    const loading = ref(false)
    const tableData = ref([])
    const dialogVisible = ref(false)
    const dialogTitle = ref('')
    const formRef = ref(null)

    const pagination = reactive({
      page: 1,
      pageSize: 10,
      total: 0
    })

    const searchForm = reactive({
      keyword: '',
      status: ''
    })

    const form = reactive({
      id: '',
      name: '',
      id_card: '',
      phone: '',
      company: '',
      purpose: '技术交流',
      host_name: '',
      visit_time: new Date().toISOString()
    })

    const formRules = {
      name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
      id_card: [{ required: true, message: '请输入证件号码', trigger: 'blur' }],
      phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
      host_name: [{ required: true, message: '请输入接待人', trigger: 'blur' }],
      visit_time: [{ required: true, message: '请选择来访时间', trigger: 'change' }]
    }

    const statusMap = {
      reserved: { name: '预约中', type: 'info' },
      visiting: { name: '访问中', type: 'primary' },
      left: { name: '已离开', type: 'success' },
      completed: { name: '已完成', type: 'success' }
    }

    const getStatusName = (status) => statusMap[status]?.name || status
    const getStatusTag = (status) => statusMap[status]?.type || 'info'

    const fetchData = async () => {
      loading.value = true
      try {
        const params = {
          page: pagination.page,
          pageSize: pagination.pageSize,
          keyword: searchForm.keyword,
          status: searchForm.status
        }
        const response = await request.get('/visitors', { params })
        if (response.success && response.data) {
          tableData.value = response.data.map(item => ({
            id: item.id,
            name: item.name,
            id_card: item.id_card,
            phone: item.phone,
            company: item.company,
            purpose: item.purpose,
            host_name: item.host_name,
            visit_time: item.visit_time,
            leave_time: item.leave_time,
            status: item.status
          }))
          pagination.total = response.total || response.data.length
        }
      } catch (error) {
        console.error('获取访客列表失败:', error)
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
      Object.assign(searchForm, { keyword: '', status: '' })
      pagination.page = 1
      fetchData()
    }

    const handleAdd = () => {
      dialogTitle.value = '新增访客'
      Object.assign(form, { id: '', name: '', id_card: '', phone: '', company: '', purpose: '技术交流', host_name: '', visit_time: new Date().toISOString() })
      dialogVisible.value = true
    }

    const handleEdit = (row) => {
      dialogTitle.value = '编辑访客'
      Object.assign(form, {
        id: row.id,
        name: row.name,
        id_card: row.id_card,
        phone: row.phone,
        company: row.company,
        purpose: row.purpose,
        host_name: row.host_name,
        visit_time: row.visit_time
      })
      dialogVisible.value = true
    }

    const handleSubmit = async () => {
      if (!formRef.value) return
      await formRef.value.validate(async (valid) => {
        if (!valid) return
        
        try {
          if (form.id) {
            const response = await request.put(`/visitors/${form.id}`, {
              name: form.name,
              idCard: form.id_card,
              phone: form.phone,
              company: form.company,
              purpose: form.purpose,
              hostName: form.host_name,
              visitTime: form.visit_time
            })
            if (response.success) {
              ElMessage.success('更新成功')
            }
          } else {
            const response = await request.post('/visitors', {
              name: form.name,
              idCard: form.id_card,
              phone: form.phone,
              company: form.company,
              purpose: form.purpose,
              hostName: form.host_name,
              visitTime: form.visit_time
            })
            if (response.success) {
              ElMessage.success('创建成功')
            }
          }
          
          dialogVisible.value = false
          fetchData()
        } catch (error) {
          console.error('提交失败:', error)
          ElMessage.error('操作失败')
        }
      })
    }

    const handleDialogClose = () => {
      formRef.value?.resetFields()
    }

    const handleSignOut = async (row) => {
      await ElMessageBox.confirm(`确定要为访客 ${row.name} 办理签离吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      })
      
      try {
        const response = await request.put(`/visitors/${row.id}/checkout`)
        if (response.success) {
          ElMessage.success('签离成功')
          fetchData()
        }
      } catch (error) {
        console.error('签离失败:', error)
        ElMessage.error('签离失败')
      }
    }

    const handleDelete = async (row) => {
      await ElMessageBox.confirm(`确定要删除访客 ${row.name} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      
      try {
        const response = await request.delete(`/visitors/${row.id}`)
        if (response.success) {
          ElMessage.success('删除成功')
          fetchData()
        }
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
      tableData,
      pagination,
      searchForm,
      dialogVisible,
      dialogTitle,
      form,
      formRules,
      formRef,
      getStatusName,
      getStatusTag,
      handleSearch,
      handleReset,
      handleAdd,
      handleEdit,
      handleSubmit,
      handleDialogClose,
      handleSignOut,
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