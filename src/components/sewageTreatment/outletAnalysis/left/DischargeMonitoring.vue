<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-14 15:50:13
 * @Description:
-->
<template>
    <commonPanel title="排口监测" :height="588">
        <template #rightTitle>
            <div class="flex">
                <div class="global-btn-common" :class="{ 'global-btn-check': currType === 'hour' }" @click="changeTimeType('hour')">
                    小时
                </div>
                <div class="global-btn-common" :class="{ 'global-btn-check': currType === 'day' }" @click="changeTimeType('day')">
                    日
                </div>
            </div>
        </template>
        <template #mainContent>
            <div class="center-box">
                <div class="top-box flex-bw-c flex-w mgb8 cur">
                    <div v-for="(item, index) in factorDataList" :key="index" class="factor-item mgb8" :class="{ 'global-btn-check': currClickType === index }" @click="currClickType = index">
                        <div class="mgb8 text-14">
                            {{ item.label }}
                        </div>
                        <div class="bottom-value-box">
                            <span class="num-20 mgr4 blue">{{ numToSeparate(item.value) }}</span>
                            <span class="unit-12">{{ item.unit }}</span>
                        </div>
                    </div>
                </div>
                <div ref="chartDom" class="bottom-chart" />
            </div>
        </template>
    </commonPanel>
</template>

<script setup lang="ts">
import { usePopStore } from '@/store/popControl'
import { globalKey } from '@/symbols'
import { numToSeparate } from '@/utils/tools'
import { getDischargeMonitoringOption } from '@/utils/echarts/echartsOptions'
const global = inject(globalKey)
const popStore = usePopStore()
const dataJson2 = [
    ['09.26 10:00', 0.02],
    ['09.26 10:20', 0.04],
    ['09.26 10:40', 0.12],
    ['09.26 11:00', 0.1],
    ['09.26 11:20', 0.1],
    ['09.26 11:40', 0.09],
    ['09.26 12:40', 0.12],
    ['09.26 13:00', 0.15],
    ['09.26 13:20', 0.25],
    ['09.26 13:40', 0.3],
    ['09.26 14:00', 0.46],
    ['09.26 14:20', 0.2],
    ['09.26 14:40', 0.3],
    ['09.26 15:00', 0.5],
    ['09.26 15:20', 0.8],
    ['09.26 15:40', 0.6],
    ['09.26 16:00', 0.8],
    ['09.26 16:20', 0.5],
    ['09.26 16:40', 0.5],
    ['09.26 17:00', 0.8],
    ['09.26 17:20', 2],
    ['09.26 12:00', 2],
    ['09.26 12:20', 2.1],
]
const data = reactive({
    currType: 'hour',
    factorDataList: [
        { label: '化学需氧量', unit: 'kg', value: 1254 },
        { label: '化学需氧量排放量', unit: 'kg', value: 2146 },
        { label: '氨氮', unit: 'kg', value: 1254 },
        { label: '氨氮排放量', unit: 'kg', value: 2146 },
        { label: '总磷', unit: 'kg', value: 1254 },
        { label: '总磷排放量', unit: 'kg', value: 2146 },
        { label: '总氮', unit: 'kg', value: 1254 },
        { label: '总氮排放量', unit: 'kg', value: 2146 },
        { label: 'pH', unit: '', value: 7.12 },
        { label: '流量', unit: 'L/S', value: 2146 },
    ],
    currClickType: 0,
    currFactorData: {
        markLimit: 0.5,
        name: '化学需氧量',
        unit: 'mg/L'
    },
    chartDom: ref<HTMLElement | null>()
})
onMounted(() => {
    getChartData()
})
const getChartData = () => {
    const xData = dataJson2.map(item => item[0]) as string[]
    const yData = dataJson2.map(item => item[1]) as number[]
    const chartChance = global?.echarts.init(data.chartDom)
    chartChance.setOption(getDischargeMonitoringOption(xData, yData, data.currFactorData))
}
const changeTimeType = (timeType: 'hour' | 'day') => {
    if (timeType === data.currType) return
    data.currType = timeType
    data.currClickType = 0
}

const { chartDom, factorDataList, currType, currClickType } = toRefs(data)
</script>

<style lang="scss" scoped>
.center-box {
    padding: 8px 0;

    .factor-item {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 178px;
        height: 58px;
        padding: 8px 0;
        background: rgba(0, 47, 93, 0.3);
        border: 1px solid #003f7c;
        border-radius: 4px;
    }

    .bottom-chart {
        width: 368px;
        height: 200px;
    }
}
</style>
