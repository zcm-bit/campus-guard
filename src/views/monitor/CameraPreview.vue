<template><div class="page-container"><div class="page-header"><span class="page-title">实时预览</span><el-select v-model="layout" style="width:100px"><el-option label="1画面" :value="1" /><el-option label="4画面" :value="4" /><el-option label="9画面" :value="9" /></el-select></div><el-card><div class="video-grid" :class="`layout-${layout}`"><div v-for="i in layout" :key="i" class="video-item"><div class="video-placeholder"><el-icon><VideoCamera /></el-icon><span>监控点 {{i}}</span></div></div></div></el-card></div></template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'CameraPreview',
  setup() {
    const layout = ref(4)
    return { layout }
  }
})
</script>

<style lang="scss" scoped>
.video-grid { display: grid; gap: 10px; &.layout-1 { grid-template-columns: 1fr; } &.layout-4 { grid-template-columns: repeat(2, 1fr); } &.layout-9 { grid-template-columns: repeat(3, 1fr); } }
.video-item { aspect-ratio: 16/9; background: #1a1a1a; border-radius: 8px; display: flex; align-items: center; justify-content: center; .video-placeholder { text-align: center; color: #666; .el-icon { font-size: 48px; display: block; margin-bottom: 10px; } } }
</style>
