<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-09 20:15:42
 * @Description:
-->
<template lang="pug">
commonPanel(:title="data.title" panelBg='panel-1' :height='232')
    template(#mainContent)
        .chart(ref='elementChart')
        .bottom-line
</template>

<script setup lang="ts">
import { useAnalysisStore } from '@/store/analysis'
const analysisStore = useAnalysisStore()
const data = reactive({
    title: '',
    toggleList: [
        { name: '最近7天', value: '' },
        { name: '最近30天', value: '' }
    ],

})

onMounted(() => {
    const analysisData = analysisStore.analysis.data
})
</script>

<style lang="scss" scoped>

</style>

