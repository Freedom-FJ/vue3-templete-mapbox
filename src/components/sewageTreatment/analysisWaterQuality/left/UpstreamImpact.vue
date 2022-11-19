<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-09 20:12:10
 * @Description:
-->
<template lang="pug">
commonPanel(title="上游影响" panelBg='panel-1' :height='406')
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
const watchData = computed(() => {
    const dateTime = analysisStore.getAnalysisData.dateTime
    const pointData = analysisStore.getAnalysisData.data.pointData
    return { dateTime, pointData }
})
watch(watchData, (val) => {
    if (!val.pointData) {
        //
    }
}, { deep: true })

const { toggleList } = toRefs(data)
</script>

<style lang="scss" scoped>
.chart {
    width: 100%;
    height: 147px;
}
</style>

