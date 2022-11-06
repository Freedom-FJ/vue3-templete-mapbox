<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-21 11:33:31
 * @Description:
-->
<template lang="pug">
commonPanel(title="水质-雨量-水位趋势对比图" panelBg='panel-1' :height='248')
    template(#mainContent)
        .chart(ref='elementChart')
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type { QualityRainfallWaterTs } from '../types'
import { initWaterQuality } from '@/utils/echarts/echartsOptions'
import { globalKey } from '@/symbols'
import service from '@/service/api'
import { useAnalysisStore } from '@/store/analysis'
const analysisStore = useAnalysisStore()
const global = inject(globalKey)
const elementChart = ref('')
const data = reactive({
    toggleList: [
        { name: '最近7天', value: '' },
        { name: '最近30天', value: '' }
    ],
    activeIndex: 0,
    unit: '',
    factorName: '',
    params: {
        startTime: 0,
        endTime: 0,
        factorCode: '',
        siteCode: '',
        timeType: ''
    }
})
/**
 * @name: 获取数据
 */
const getData = async () => {
    const res = await service<QualityRainfallWaterTs[]>('waterQuality/rainHydrologyAnalyse', data.params)
    const resData = res.data || []
    const xData = [] as string[]
    const seriesData = {
        hydrology: [] as string[],
        factorValue: [] as string[],
        rain: [] as string[],
        quality: [] as (string | null)[]
    }
    resData.forEach((item) => {
        if (data.params.timeType === 'hour' || data.params.timeType === 'day')
            xData.push(dayjs.unix(Number(item.time) / 1000).format('MM-DD HH'))
        else
            xData.push(dayjs.unix(Number(item.time) / 1000).format('MM-DD'))
        seriesData.rain.push(item.rain) // 雨量
        seriesData.hydrology.push(item.hydrology) // 水位
        seriesData.factorValue.push(item.factorValue) // 监测值
        seriesData.quality.push(item.quality) // 水质等级
    })
    nextTick()
    const chart = global?.echarts.init(elementChart.value)
    const lineOptions = await initWaterQuality(xData, seriesData, data.unit, data.factorName)
    chart.setOption(lineOptions)
}
watch(() => analysisStore.analysis.dateTime, (val) => {
    if (!val.length) return
    const analysisData = analysisStore.analysis.data
    data.params.siteCode = analysisData.siteCode || ''
    data.params.startTime = val[0]
    data.params.endTime = val[1]
    data.params.factorCode = analysisData.factorCode || ''
    data.params.timeType = analysisData.timeType || ''
    data.unit = analysisData.factorUnit || ''
    data.factorName = analysisData.factorName || ''
    getData()
}, { immediate: true })
</script>

<style lang="scss" scoped>
.chart {
    width: 100%;
    height: 200px;
}
</style>

