<template>
  <div class="page-container">
    <div class="page-header">
      <span class="page-title">宿舍管理</span>
      <el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon>新增宿舍</el-button>
    </div>
    <el-card>
      <div class="search-box">
        <el-input v-model="searchForm.keyword" placeholder="搜索楼栋/房间" style="width:200px" clearable />
        <el-select v-model="searchForm.type" placeholder="类型" style="width:120px" clearable>
          <el-option label="学生宿舍" value="student" />
          <el-option label="教师宿舍" value="teacher" />
        </el-select>
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
      <el-table :data="filteredData" v-loading="loading" stripe style="width:100%;margin-top:20px">
        <el-table-column prop="building" label="楼栋号" />
        <el-table-column prop="floor" label="楼层" />
        <el-table-column prop="room" label="房间号" />
        <el-table-column prop="type" label="类型"><template #default="{row}"><el-tag size="small">{{row.type==='student'?'学生宿舍':'教师宿舍'}}</el-tag></template></el-table-column>
        <el-table-column prop="beds" label="床位数" />
        <el-table-column prop="createdAt" label="创建时间" />
        <el-table-column label="操作" width="150">
          <template #default="{row}"><el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button><el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button></template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="form" label-width="80px">
        <el-form-item label="楼栋号" prop="building"><el-input v-model="form.building" /></el-form-item>
        <el-form-item label="楼层" prop="floor"><el-input-number v-model="form.floor" :min="1" /></el-form-item>
        <el-form-item label="房间号" prop="room"><el-input v-model="form.room" /></el-form-item>
        <el-form-item label="类型" prop="type"><el-select v-model="form.type" style="width:100%"><el-option label="学生宿舍" value="student" /><el-option label="教师宿舍" value="teacher" /></el-select></el-form-item>
        <el-form-item label="床位数" prop="beds"><el-input-number v-model="form.beds" :min="1" :max="8" /></el-form-item>
      </el-form>
      <template #footer><el-button @click="dialogVisible=false">取消</el-button><el-button type="primary" @click="handleSubmit">确定</el-button></template>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const mockDormitories = reactive([
  { id: 1, building: '1号楼', floor: 1, room: '101', type: 'student', beds: 4, createdAt: '2024-01-01' },
  { id: 2, building: '1号楼', floor: 1, room: '102', type: 'student', beds: 4, createdAt: '2024-01-01' },
  { id: 3, building: '2号楼', floor: 2, room: '201', type: 'teacher', beds: 2, createdAt: '2024-01-01' },
  { id: 4, building: '3号楼', floor: 3, room: '301', type: 'student', beds: 6, createdAt: '2024-01-01' }
])

export default defineComponent({
  name: 'Dormitories',
  setup() {
    const loading = ref(false), dialogVisible = ref(false), dialogTitle = ref(''), formRef = ref(null)
    const searchForm = reactive({ keyword: '', type: '' })
    const form = reactive({ id: '', building: '', floor: 1, room: '', type: 'student', beds: 4 })

    const filteredData = computed(() => {
      let result = [...mockDormitories]
      if (searchForm.keyword) {
        const keyword = searchForm.keyword.toLowerCase()
        result = result.filter(item => item.building.toLowerCase().includes(keyword) || item.room.toLowerCase().includes(keyword))
      }
      if (searchForm.type) result = result.filter(item => item.type === searchForm.type)
      return result
    })

    const handleSearch = () => {}
    const handleReset = () => Object.assign(searchForm, { keyword: '', type: '' })

    const handleAdd = () => { dialogTitle.value='新增宿舍'; Object.assign(form,{id:'',building:'',floor:1,room:'',type:'student',beds:4}); dialogVisible.value=true }
    const handleEdit = (row) => { dialogTitle.value='编辑宿舍'; Object.assign(form,row); dialogVisible.value=true }

    const handleSubmit = async () => {
      if (form.id) {
        const index = mockDormitories.findIndex(item => item.id === form.id)
        if (index !== -1) {
          Object.assign(mockDormitories[index], { building: form.building, floor: form.floor, room: form.room, type: form.type, beds: form.beds })
          ElMessage.success('更新成功')
        }
      } else {
        mockDormitories.push({ id: Date.now(), building: form.building, floor: form.floor, room: form.room, type: form.type, beds: form.beds, createdAt: new Date().toLocaleDateString() })
        ElMessage.success('创建成功')
      }
      dialogVisible.value = false
    }

    const handleDelete = async (row) => {
      await ElMessageBox.confirm(`确定要删除 ${row.building}-${row.room} 吗？`, '提示', { type: 'warning' })
      const index = mockDormitories.findIndex(item => item.id === row.id)
      if (index !== -1) { mockDormitories.splice(index, 1); ElMessage.success('删除成功') }
    }

    return { loading, filteredData, dialogVisible, dialogTitle, form, formRef, searchForm, handleSearch, handleReset, handleAdd, handleEdit, handleSubmit, handleDelete }
  }
})
</script>

<style lang="scss" scoped>
.search-box { display: flex; flex-wrap: wrap; gap: 10px; }
</style>
