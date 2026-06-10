<template><div class="page-container"><div class="page-header"><span class="page-title">通行统计</span></div><el-card><div ref="chartRef" class="chart-container"></div></el-card></div></template>

<script>
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

export default defineComponent({
  name: 'AccessStats',
  setup() {
    const chartRef = ref(null)
    let chart = null

    const initChart = () => {
      if (!chartRef.value) return
      chart = echarts.init(chartRef.value)
      const option = {
        tooltip: { trigger: 'axis' },
        legend: { data: ['学生', '教师', '职工'] },
        xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
        yAxis: { type: 'value' },
        series: [
          { name: '学生', type: 'line', smooth: true, data: [1200, 1150, 1100, 1050, 980, 500, 300] },
          { name: '教师', type: 'line', smooth: true, data: [400, 380, 360, 340, 320, 100, 80] },
          { name: '职工', type: 'line', smooth: true, data: [200, 190, 180, 170, 160, 50, 40] }
        ]
      }
      chart.setOption(option)
    }

    onMounted(() => initChart())
    onUnmounted(() => chart?.dispose())

    return { chartRef }
  }
})
</script>

<style lang="scss" scoped>
.chart-container { width: 100%; height: 400px; }
</style>
