<template>
  <router-view />
</template>

<script>
import { onMounted, onUnmounted } from 'vue'
import { mockApi } from './main'

export default {
  name: 'App',
  setup() {
    onMounted(() => {
      mockApi.startRealtimeUpdate(() => {
        console.log('数据已更新')
      })
    })
    
    onUnmounted(() => {
      mockApi.stopRealtimeUpdate()
    })
  }
}
</script>
