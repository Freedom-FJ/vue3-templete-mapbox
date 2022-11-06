<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-09 14:59:20
 * @Description:
-->
<template lang="pug">
commonPanel(title="雨量监测"  panelBg='panel-big' :height='208' :bigBgTop="14")
    template(#rightTitle)
        .btn-box.flex
            .btn-item-box.text-12.cur(v-for="(item, index) in timeList" :key="item" :class="[index === activeIndex ? 'btn-active' : '']" @click="checkRainType(index)") {{item}}h
    template(#mainContent)
        .chart.mgt20(ref="chartDom")
</template>

<script setup lang="ts">
import { globalKey } from '@/symbols'
import { getChartRainOption } from '@/utils/echarts/echartsOptions'
const global = inject(globalKey)
const data = reactive({
    timeList: [1, 3, 8, 24],
    chartDom: ref(),
    activeIndex: 0
})

onMounted(() => {
    getChart()
})
const checkRainType = (index: number) => {
    data.activeIndex = index
}
const getChart = () => {
    const xData = ['五常', '仁和', '良渚', '闲林', '仓前', '余杭', '百丈']
    const yData = [12, 6, 10, 14, 5, 20, 17]
    const chartChance = global?.echarts.init(data.chartDom)
    chartChance.setOption(getChartRainOption(xData, yData))
}

const { timeList, chartDom, activeIndex } = toRefs(data)
</script>

<style lang="scss" scoped>
.chart {
    width: 100%;
    height: 120px;
}

.btn-item-box {
    box-sizing: border-box;
    height: 22px;
    padding: 5px 10px;
    margin-right: 4px;
    text-align: center;
    background: #023057;
    border: 1px solid #286c9d;
    border-radius: 4px;
}

.btn-active {
    background: #008dce;
    border: 1px solid #00e5ff;
}
</style>

