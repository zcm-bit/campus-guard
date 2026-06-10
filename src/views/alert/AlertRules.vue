<template><div class="page-container"><div class="page-header"><span class="page-title">告警规则</span><el-button type="primary" @click="handleAdd"><el-icon><Plus /></el-icon>新增规则</el-button></div><el-card><el-table :data="tableData" v-loading="loading" stripe><el-table-column prop="name" label="规则名称" /><el-table-column prop="type" label="告警类型" /><el-table-column prop="condition" label="触发条件" /><el-table-column prop="level" label="告警等级"><template #default="{row}"><el-tag :type="getLevelTag(row.level)" size="small">{{row.level}}</el-tag></template></el-table-column><el-table-column prop="status" label="状态"><template #default="{row}"><el-switch v-model="row.status" :active-value="1" :inactive-value="0" /></template></el-table-column><el-table-column label="操作" width="150"><template #default="{row}"><el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button></template></el-table-column></el-table></el-card></div></template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'AlertRules',
  setup() {
    const loading = ref(false)
    const tableData = ref([
      {id:1, name:'门长时间未关闭告警', type:'门禁', condition:'门打开超过3分钟', level:'严重', status:1},
      {id:2, name:'尾随通行告警', type:'门禁', condition:'两人通行间隔小于2秒', level:'警告', status:1}
    ])
    const getLevelTag = (l) => ({'严重':'danger', '警告':'warning', '提示':'info'}[l]||'info')
    const handleAdd = () => ElMessage.info('新增规则')
    const handleEdit = (row) => ElMessage.info('编辑规则')
    onMounted(() => {})
    return { loading, tableData, getLevelTag, handleAdd, handleEdit }
  }
})
</script>
