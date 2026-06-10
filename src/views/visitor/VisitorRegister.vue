<template>
  <div class="page-container">
    <div class="page-header">
      <span class="page-title">访客登记</span>
    </div>
    <el-card>
      <el-form ref="formRef" :model="form" :rules="formRules" label-width="100px" style="max-width: 600px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="name"><el-input v-model="form.name" placeholder="请输入访客姓名" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="idCard"><el-input v-model="form.idCard" placeholder="请输入身份证号" /></el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone"><el-input v-model="form.phone" placeholder="请输入手机号" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来访单位" prop="company"><el-input v-model="form.company" placeholder="请输入来访单位" /></el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="来访事由" prop="purpose">
          <el-input v-model="form.purpose" type="textarea" :rows="3" placeholder="请输入来访事由" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="被访人" prop="hostName"><el-input v-model="form.hostName" placeholder="请输入被访人姓名" /></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="被访部门" prop="hostDept"><el-input v-model="form.hostDept" placeholder="请输入被访部门" /></el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="访问区域" prop="accessArea"><el-input v-model="form.accessArea" placeholder="请输入允许访问的区域" /></el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="loading">登记</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

export default defineComponent({
  name: 'VisitorRegister',
  setup() {
    const formRef = ref(null)
    const loading = ref(false)
    const form = reactive({ name: '', idCard: '', phone: '', company: '', purpose: '', hostName: '', hostDept: '', accessArea: '' })
    const formRules = {
      name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
      idCard: [{ required: true, message: '请输入身份证号', trigger: 'blur' }],
      phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
      hostName: [{ required: true, message: '请输入被访人', trigger: 'blur' }]
    }

    const handleSubmit = async () => {
      if (!formRef.value) return
      await formRef.value.validate(async (valid) => {
        if (!valid) return
        loading.value = true
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
            ElMessage.success('访客登记成功')
            handleReset()
          }
        } catch (error) {
          console.error('登记失败:', error)
          ElMessage.error('登记失败')
        } finally {
          loading.value = false
        }
      })
    }

    const handleReset = () => {
      formRef.value?.resetFields()
      Object.assign(form, { name: '', idCard: '', phone: '', company: '', purpose: '', hostName: '', hostDept: '', accessArea: '' })
    }

    return { formRef, form, formRules, loading, handleSubmit, handleReset }
  }
})
</script>
