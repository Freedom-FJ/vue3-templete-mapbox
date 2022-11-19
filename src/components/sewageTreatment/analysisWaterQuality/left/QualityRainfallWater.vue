<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-09 20:15:46
 * @Description:
-->
<template lang="pug">
commonPanel(title="水质-雨量-水位趋势对比图" panelBg='panel-1' :height='248')
    template(#mainContent)
        .chart(ref='elementChart')
</template>

<script setup lang="ts">
import { useAnalysisStore } from '@/store/analysis'
const analysisStore = useAnalysisStore()
const elementChart = ref('')
const data = reactive({
    toggleList: [
        { name: '最近7天', value: '' },
        { name: '最近30天', value: '' }
    ],
})

watch(() => analysisStore.analysis.dateTime, (val) => {
    console.log(val, 'val')
}, { immediate: true })
</script>

<style lang="scss" scoped>

</style>

