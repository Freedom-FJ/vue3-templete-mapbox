<!--
 * @Author: Tian
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: Tian
 * @LastEditTime: 2022-09-06 09:49:39
 * @Description:
-->
<template lang="pug">
commonPanel(title="氮磷比趋势变化" panelBg='panel-1' :height='224')
    template(#rightTitle)
        .right-title
            .btn(v-for='item, index in toggleList' :class='index === activeIndex ? "active" : ""' @click='changeNav(index)' :key="item.name") {{item.name}}
    template(#mainContent)
        .chart(ref='nitrogenChart')
</template>

<script setup lang="ts">
import type { AlgaeWarningList } from '../type'
import { trendChangeLineOptions } from '@/utils/echarts/echartsOptions'
import { useAnalysisStore } from '@/store/analysis'
import { globalKey } from '@/symbols'
import service from '@/service/api'
const global = inject(globalKey)
const nitrogenChart = ref('')
const analysisStore = useAnalysisStore()
const data = reactive({
    toggleList: [
        { name: '最近7天', value: global?.dayjs(analysisStore.getAnalysisData.data.time).subtract(6, 'days').startOf('day').valueOf() },
        { name: '最近30天', value: global?.dayjs(analysisStore.getAnalysisData.data.time).subtract(29, 'days').startOf('day').valueOf() }
    ],
    activeIndex: 0,
})
/**
 * 时间切换
 * @param index 索引
 */
const changeNav = (index: number) => {
    data.activeIndex = index
    getNPTrentChange()
}
onMounted(() => {
    nextTick()

    getNPTrentChange()
})
/**
 * 获取接口数据
 */
const getNPTrentChange = async () => {
    const res = await service<AlgaeWarningList, true>(analysisStore.getAnalysisData.data.isHandle ? 'drinkingWaterSource/algaeAnalyseNPCHandleompare' : 'drinkingWaterSource/algaeAnalyseNPCompare', {
        startTime: data.toggleList[data.activeIndex].value,
        endTime: global?.dayjs(analysisStore.getAnalysisData.data.time).add(1, 'days').startOf('day').valueOf(),
        siteCode: analysisStore.getAnalysisData.data.siteCode,
        timeType: analysisStore.getAnalysisData.data.isHandle ? 'day' : ''
    })
    const timeList = res?.data?.timeList ?? []
    const preList = res?.data?.preList ?? []
    const xData = timeList.map((item: string) => {
        return item && item.substr(5)
    })
    const NPList = preList.map((item: number) => {
        return item && item * 100
    })
    const chart = global?.echarts.init(nitrogenChart.value)
    const options = trendChangeLineOptions(xData, NPList, global?.echarts)
    chart.setOption(options)
}
const { toggleList, activeIndex } = toRefs(data)
</script>

<style lang="scss" scoped>
.right-title {
    display: flex;
    font-family: TRENDS;
    font-size: 12px;
    .btn {
        padding: 0 10px;
        height: 22px;
        text-align: center;
        line-height: 22px;
        background: #023057;
        box-sizing: border-box;
        border: 1px solid #286C9D;
        border-radius: 4px;
        margin-left: 4px;
        cursor: pointer;
    }
    .active {
        background: #008DCE;
        border: 1px solid #00E5FF;

    }
}
.chart {
    width: 100%;
    height: 180px;
}
</style>
