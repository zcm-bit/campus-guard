<template><div class="page-container"><div class="page-header"><span class="page-title">检测记录</span><el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon>新增记录</el-button></div><el-card><el-table :data="tableData" v-loading="loading" stripe><el-table-column prop="facilityName" label="设施名称" /><el-table-column prop="type" label="检测类型"><template #default="{row}"><el-tag size="small">{{row.type==='routine'?'日常检查':'定期检测'}}</el-tag></template></el-table-column><el-table-column prop="result" label="结果"><template #default="{row}"><el-tag :type="row.result==='normal'?'success':'danger'" size="small">{{row.result==='normal'?'正常':'异常'}}</el-tag></template></el-table-column><el-table-column prop="inspector" label="检测人" /><el-table-column prop="inspectDate" label="检测日期" /><el-table-column prop="nextDate" label="下次检测" /></el-table></el-card></div></template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'FireInspections',
  setup() {
    const loading = ref(false)
    const tableData = ref([
      {id:1, facilityName:'1号楼灭火器A区', type:'routine', result:'normal', inspector:'张检测员', inspectDate:'2024-01-10', nextDate:'2024-02-10'},
      {id:2, facilityName:'2号楼消火栓', type:'periodic', result:'normal', inspector:'李检测员', inspectDate:'2024-01-05', nextDate:'2024-07-05'}
    ])
    const handleAdd = () => ElMessage.info('新增记录')
    onMounted(() => {})
    return { loading, tableData, handleAdd }
  }
})
</script>
