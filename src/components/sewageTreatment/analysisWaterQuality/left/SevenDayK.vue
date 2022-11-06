<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-21 11:33:53
 * @Description:
-->
<template lang="pug">
commonPanel(:title="data.title" panelBg='panel-1' :height='232')
    template(#mainContent)
        .chart(ref='elementChart')
        .bottom-line
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { maxBy, minBy } from 'lodash-es'
import type { kLineApiTs } from '../types'
import { getYearWeek } from '@/utils/tools'
import { dayKLine } from '@/utils/echarts/echartsOptions'
import { globalKey } from '@/symbols'
import { useAnalysisStore } from '@/store/analysis'
import service from '@/service/api'
import { timeStrList } from '@/utils/waterUtils'
const analysisStore = useAnalysisStore()
const global = inject(globalKey)
const elementChart = ref('')
const data = reactive({
    title: '',
    toggleList: [
        { name: '最近7天', value: '' },
        { name: '最近30天', value: '' }
    ],
    activeIndex: 0,
    alarmTimeValue: 0,
    unit: '',
    factorName: '',
    siteName: '',
    params: {
        startTime: 0,
        endTime: 0,
        factorCode: '',
        siteCode: '',
        timeType: ''
    }
})

onMounted(() => {
    const analysisData = analysisStore.analysis.data
    data.params.siteCode = analysisData.siteCode || ''
    data.params.factorCode = analysisData.factorCode || ''
    data.params.timeType = analysisData.timeType || ''
    data.alarmTimeValue = Number(analysisData.alarmTimeValue)
    data.unit = analysisData.factorUnit || ''
    data.factorName = analysisData.factorName || ''
    data.siteName = analysisData.siteName || ''
    detailTime()
})

/**
 * @name: 处理时间
 */
const detailTime = () => {
    data.params.startTime = dayjs(data.alarmTimeValue).add(-6, 'day').valueOf()
    data.params.endTime = data.alarmTimeValue
    data.title = `最近7天${data.siteName}${data.factorName}K线与日变化趋势图`
    getData()
}
/**
 * @name: 获取数据
 */
const getData = async () => {
    const res = await service<kLineApiTs[]>('waterQuality/getKLine', data.params)
    const resData = res.data || []
    const klineData = {
        xAxis: [] as strNum[], kData: [] as strNum[][], values: [] as strNum[], quality: [] as number[]
    }
    resData.forEach((item) => {
        item.maxValue = Number(item.maxValue)
        item.minValue = Number(item.minValue)
        if (data.params.timeType === 'week')
            klineData.xAxis.push(`${getYearWeek(+item.time)}周`)
        else
            klineData.xAxis.push(dayjs.unix(Number(item.time) / 1000).format('MM-DD'))

        klineData.kData.push([item.minValue, item.firstValue, item.value, item.lastValue, item.maxValue])
        klineData.values.push(item.value)
        klineData.quality.push(item.quality)
    })
    const maxObj = maxBy(resData, 'maxValue')
    const minObj = minBy(resData, 'minValue')
    nextTick()
    const chart = global?.echarts.init(elementChart.value)
    const lineOptions = await dayKLine(klineData, maxObj.maxValue, minObj.minValue, data.factorName, data.unit, timeStrList[data.params.timeType as keyof typeof timeStrList])
    chart.setOption(lineOptions)
}
</script>

<style lang="scss" scoped>
.chart {
    width: 100%;
    height: 175px;
}

.bottom-line {
    width: 100%;
    height: 1px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
</style>

