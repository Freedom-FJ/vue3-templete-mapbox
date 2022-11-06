<!--
 * @Author: Tian
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: Tian
 * @LastEditTime: 2022-09-06 09:51:34
 * @Description:
-->
<template lang="pug">
commonPanel(:title="title" panelBg='panel-1' :height='260')
    template(#mainContent)
        .chart(ref='elementChart')
</template>

<script setup lang="ts">
import type { ProcessWarningList } from '../type'
import service from '@/service/api'
import { upstreamSectionOptions } from '@/utils/echarts/echartsOptions'
import { globalKey } from '@/symbols'
import { useAnalysisStore } from '@/store/analysis'
const global = inject(globalKey)
const elementChart = ref('')
const analysisStore = useAnalysisStore()
const title = `叶绿素a沿程变化${global?.dayjs(analysisStore.getAnalysisData.data.time).format('YYYY-MM-DD HH')}`
onMounted(() => {
    nextTick()
    getProcessData()
})
/**
 * 获取接口数据
 */
const getProcessData = async () => {
    const res = await service<ProcessWarningList, true>('drinkingWaterSource/pathAnalysisNew', {
        time: global?.dayjs(analysisStore.getAnalysisData.data.time).valueOf(),
        factorCode: analysisStore.getAnalysisData.data.factorCode,
        siteCode: analysisStore.getAnalysisData.data.siteCode,
        timeType: analysisStore.getAnalysisData.data.isHandle ? 'day' : ''
    })
    const xData = res.data.map((item) => {
        return item.siteName
    })
    const valueDate = res.data.map((item) => {
        return item.value
    })
    const chart = global?.echarts.init(elementChart.value)
    const limit = analysisStore.getAnalysisData.data.isHandle ? 50 : 15
    const lineOptions = upstreamSectionOptions(xData, valueDate, limit)
    chart.setOption(lineOptions)
}
</script>

<style lang="scss" scoped>
 .chart {
    width: 100%;
    height: 220px;
 }
</style>
