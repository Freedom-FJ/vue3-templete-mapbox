<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-09 14:59:17
 * @Description:
-->
<template lang="pug">
commonPanel(title="洪水预报"  panelBg='panel-big' :height='208' :bigBgTop="14")
    template(#rightTitle)
        .btn-box.flex
            .btn-item-box.text-12.cur(v-for="(item, index) in timeList" :key="item" :class="[index === activeIndex ? 'btn-active' : '']" @click="checkRainType(index)") {{item}}
    template(#mainContent)
        .chart.mgt20(ref="chartDom")
</template>

<script setup lang="ts">
import { globalKey } from '@/symbols'
import { getFloodForecastOption } from '@/utils/echarts/echartsOptions'
const global = inject(globalKey)
const data = reactive({
    timeList: ['余杭', '瓶窑'],
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
    const yData = [7.66, 6, 2.44, 8, 5, 8.66, 7]
    const chartChance = global?.echarts.init(data.chartDom)
    chartChance.setOption(getFloodForecastOption(xData, yData))
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

