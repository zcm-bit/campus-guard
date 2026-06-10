<template><div class="page-container"><div class="page-header"><span class="page-title">访客统计</span></div><el-card><div ref="chartRef" class="chart-container"></div></el-card></div></template>

<script>
import { defineComponent, ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

export default defineComponent({
  name: 'VisitorStats',
  setup() {
    const chartRef = ref(null)
    let chart = null

    const initChart = () => {
      if (!chartRef.value) return
      chart = echarts.init(chartRef.value)
      const option = {
        tooltip: { trigger: 'item' },
        legend: { bottom: '5%', left: 'center' },
        series: [{
          type: 'pie',
          radius: ['40%', '70%'],
          data: [
            { value: 45, name: '商务洽谈', itemStyle: { color: '#409EFF' } },
            { value: 25, name: '参加活动', itemStyle: { color: '#67C23A' } },
            { value: 15, name: '招聘宣讲', itemStyle: { color: '#E6A23C' } },
            { value: 10, name: '探访亲友', itemStyle: { color: '#F56C6C' } },
            { value: 5, name: '其他', itemStyle: { color: '#909399' } }
          ]
        }]
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
