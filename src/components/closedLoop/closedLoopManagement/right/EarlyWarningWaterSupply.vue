<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-14 08:49:20
 * @Description:
-->
<template>
    <commonPanel title="供水预警" :height="176">
        <template #mainContent>
            <div class="flex-bw-c main-box">
                <div class="left-count flex-c-c">
                    <div class="top-label mgb20 text-14">
                        预警总数
                    </div>
                    <div class=" bottom-value num-24 blue">
                        25
                    </div>
                </div>
                <div ref="barDom" class="bottom-bar" />
            </div>
        </template>
    </commonPanel>
</template>

<script setup lang="ts">
import { globalKey } from '@/symbols'
import { getEarlyWarningWaterSupplyOption } from '@/utils/echarts/echartsOptions'
const global = inject(globalKey)
const data = reactive({
    barDom: ref(),
    chartPieData: [
        { name: '未处理', value: 4, rate: '1.4%' },
        { name: '已处理', value: 180, rate: '98.6%' },
    ]
})

onMounted(() => {
    getBarChart()
})

const getBarChart = () => {
    const xData = ['已处置', '处置中', '未处置']
    const yData = [
        { value: 120, done: 120, unDone: 0 },
        { value: 110, done: 70, unDone: 40 },
        { value: 75, done: 50, unDone: 25 },
    ]
    const chartChance = global?.echarts.init(data.barDom)
    chartChance.setOption(getEarlyWarningWaterSupplyOption(xData, yData))
}

const { barDom, chartPieData } = toRefs(data)
</script>

<style lang="scss" scoped>
.main-box {
    height: 125px;
    padding: 0 12px;
}

.bottom-bar {
    width: 244px;
    height: 115px;
}

.left-count {
    flex-direction: column;
    width: 76px;
    height: 97px;
    padding: 0 8px;
    background: #092743;
    border-radius: 8px;
}
</style>

