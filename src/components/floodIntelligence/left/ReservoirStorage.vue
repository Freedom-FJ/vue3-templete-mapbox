<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-09 14:59:25
 * @Description:
-->
<template lang="pug">
commonPanel(title="水库纳蓄"  panelBg='panel-big' :height='248' :bigBgTop="14")
    template(#mainContent)
        .main-box.flex-bw-c.pdt20
            .chart.mgt20(ref="chartDom")
            .right-box.w-60
                .right-title.text-16.mgb16 蓄水率Top3
                .body-box
                    .body-item-box.mgb16(v-for="item in dataList" :key="item.rank")
                        .top-line.flex-bw-c.mgb6
                            .top-left-title
                                span.mgr15.num-14 {{item.rank}}
                                span.text-14 {{item.label}}
                            .top-right-value.num-16.blue-0 {{item.value}}
                        .bar-box
                            .bar-value(:style="{ width: item.value + '%'}")
</template>

<script setup lang="ts">
import { globalKey } from '@/symbols'
import { getBallWaterOption } from '@/utils/echarts/echartsOptions'
const global = inject(globalKey)
const data = reactive({
    chartDom: ref(),
    dataList: [
        { label: '青山水库', rank: 1, value: 66 },
        { label: '四岭水库', rank: 2, value: 48 },
        { label: '水涛庄水库', rank: 3, value: 54 },
    ]
})

onMounted(() => {
    getChart()
})

const getChart = () => {
    const chartChance = global?.echarts.init(data.chartDom)
    chartChance.setOption(getBallWaterOption())
}

const { chartDom, dataList } = toRefs(data)
</script>

<style lang="scss" scoped>
.chart {
    width: 120px;
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

.bar-box {
    width: 100%;
    height: 8px;
    background-color: rgba(255, 255, 255, 0.2);

    .bar-value {
        height: 100%;
        background-color: #0df;
    }
}

.main-box {
    padding: 20px 10px 0;
}
</style>

