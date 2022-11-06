<!--
 * @Author: Tian
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-29 11:28:26
 * @Description:
-->
<template lang="pug">
commonPanel(title="排名前三关联因子" panelBg='panel-1' :height='208')
    template(#mainContent)
        .chart#linkFactorChart(ref='chartRef')
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import service from '@/service/api'
import type { AlgaeWarningList } from '@/components/map/sewageTreatment/mapPop/types'
import { useAnalysisStore } from '@/store/analysis'
import { getAlgaeBarOptions } from '@/utils/echarts/echartsOptions'
import { globalKey } from '@/symbols'
const analysisStore = useAnalysisStore()
const global = inject(globalKey)
const chartRef = ref('')

onMounted(() => {
    nextTick()
    getCorrData()
})

/**
 * 获取接口数据
 */
const getCorrData = async () => {
    const res = await service<AlgaeWarningList, true>(analysisStore.getAnalysisData.data.isHandle ? 'drinkingWaterSource/algaeAnalyseHandleFactor' : 'drinkingWaterSource/algaeAnalyseFactor', {
        startTime: analysisStore.getAnalysisData.dateTime[0],
        endTime: analysisStore.getAnalysisData.dateTime[1],
        siteCode: analysisStore.getAnalysisData.data.siteCode,
        factorCode: analysisStore.getAnalysisData.data.factorCode,
        timeType: analysisStore.getAnalysisData.data.isHandle ? 'day' : ''
    })
    const resData = res?.data ?? []
    const upData = resData.map((item: Record<string, any>) => {
        if (item.value >= 0)
            return item.value === 0 ? 0 : item.value.toFixed(4)

        else
            return ''
    })
    const downData = resData.map((item: Record<string, any>) => {
        if (item.value < 0)
            return item.value.toFixed(4)

        else
            return ''
    })
    const xData = resData.map((item: Record<string, any>) => {
        return item.name
    })
    const chart = global?.echarts.init(chartRef.value)
    const barOptions = getAlgaeBarOptions(xData, upData, downData)
    chart.setOption(barOptions)
}

/**
 * 监听研判分析面板时间改变
 */
watch(() => analysisStore.analysis.dateTime, () => {
    getCorrData()
}, { immediate: true })
</script>

<style lang="scss" scoped>
.chart {
    width: 100%;
    height: 160px;
}
</style>
