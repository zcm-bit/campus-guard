<template>
  <div class="page-container">
    <div class="page-header">
      <span class="page-title">访客列表</span>
      <el-button v-if="canAdd" type="primary" @click="handleRegister">
        <el-icon><Plus /></el-icon>
        访客登记
      </el-button>
    </div>

    <el-card>
      <div class="search-box">
        <el-input v-model="searchForm.keyword" placeholder="姓名/身份证/手机号" style="width: 180px" clearable />
        <el-select v-model="searchForm.status" placeholder="状态" style="width: 120px" clearable>
          <el-option label="访问中" value="visiting" />
          <el-option label="已离开" value="left" />
          <el-option label="已预约" value="reserved" />
        </el-select>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>

      <el-table :data="tableData" v-loading="loading" stripe style="width: 100%; margin-top: 20px">
        <el-table-column prop="name" label="访客姓名" />
        <el-table-column prop="idCard" label="身份证号" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="company" label="来访单位" />
        <el-table-column prop="purpose" label="来访事由" />
        <el-table-column prop="hostName" label="被访人" />
        <el-table-column prop="hostDept" label="被访部门" />
        <el-table-column prop="visitTime" label="来访时间" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)">{{ getStatusName(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="canEdit" label="操作" width="150">
          <template #default="{ row }">
            <el-button v-if="row.status === 'visiting'" type="success" size="small" @click="handleCheckout(row)">签离</el-button>
            <el-button type="primary" size="small" @click="handleDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 20px"
        @current-change="fetchData"
        @size-change="fetchData"
      />
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form ref="formRef" :model="form" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入访客姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idCard">
              <el-input v-model="form.idCard" placeholder="请输入身份证号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来访单位" prop="company">
              <el-input v-model="form.company" placeholder="请输入来访单位" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="来访事由" prop="purpose">
          <el-input v-model="form.purpose" type="textarea" :rows="2" placeholder="请输入来访事由" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="被访人" prop="hostName">
              <el-input v-model="form.hostName" placeholder="请输入被访人姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="被访部门" prop="hostDept">
              <el-input v-model="form.hostDept" placeholder="请输入被访部门" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="访问区域" prop="accessArea">
          <el-input v-model="form.accessArea" placeholder="请输入访问区域" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定登记</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { canAdd, canEdit } from '@/utils/permission'
import request from '@/utils/request'

export default defineComponent({
  name: 'VisitorList',
  setup() {
    const loading = ref(false)
    const tableData = ref([])
    const dialogVisible = ref(false)
    const dialogTitle = ref('访客登记')
    const formRef = ref(null)
    const pagination = reactive({ page: 1, pageSize: 10, total: 0 })
    const searchForm = reactive({ keyword: '', status: '' })
    const form = reactive({
      name: '',
      idCard: '',
      phone: '',
      company: '',
      purpose: '',
      hostName: '',
      hostDept: '',
      accessArea: ''
    })

    const statusMap = {
      reserved: { name: '已预约', tag: 'info' },
      visiting: { name: '访问中', tag: 'warning' },
      left: { name: '已离开', tag: 'success' },
      completed: { name: '已完成', tag: 'success' }
    }
    const getStatusName = (s) => statusMap[s]?.name || s
    const getStatusTag = (s) => statusMap[s]?.tag || 'info'

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
            idCard: item.id_card || item.idCard,
            phone: item.phone,
            company: item.company,
            purpose: item.purpose,
            hostName: item.host_name || item.hostName,
            hostDept: item.host_dept || item.hostDept,
            visitTime: item.visit_time || item.visitTime,
            leaveTime: item.leave_time || item.leaveTime,
            accessArea: item.access_area || item.accessArea,
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
      searchForm.keyword = ''
      searchForm.status = ''
      pagination.page = 1
      fetchData()
    }

    const handleRegister = () => {
      dialogTitle.value = '访客登记'
      Object.keys(form).forEach(key => form[key] = '')
      dialogVisible.value = true
    }

    const handleDetail = (row) => {
      dialogTitle.value = '访客详情'
      Object.assign(form, {
        name: row.name,
        idCard: row.idCard,
        phone: row.phone,
        company: row.company,
        purpose: row.purpose,
        hostName: row.hostName,
        hostDept: row.hostDept,
        accessArea: row.accessArea
      })
      dialogVisible.value = true
    }

    const handleCheckout = async (row) => {
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

    const handleSubmit = async () => {
      try {
        const response = await request.post('/visitors', {
          name: form.name,
          idCard: form.idCard,
          phone: form.phone,
          company: form.company,
          purpose: form.purpose,
          hostName: form.hostName,
          hostDept: form.hostDept,
          accessArea: form.accessArea,
          visitTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
        })
        if (response.success) {
          ElMessage.success('登记成功')
          dialogVisible.value = false
          fetchData()
        }
      } catch (error) {
        console.error('登记失败:', error)
        ElMessage.error('登记失败')
      }
    }

    onMounted(() => {
      fetchData()
    })

    return {
      loading,
      tableData,
      dialogVisible,
      dialogTitle,
      formRef,
      pagination,
      searchForm,
      form,
      canAdd,
      canEdit,
      getStatusName,
      getStatusTag,
      fetchData,
      handleSearch,
      handleReset,
      handleRegister,
      handleDetail,
      handleCheckout,
      handleSubmit
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