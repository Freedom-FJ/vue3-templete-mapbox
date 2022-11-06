<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-27 13:49:58
 * @Description:
-->
<template>
    <commonPanel title="水环境质量" panel-bg="panel-big" :height="336" :big-bg-top="14">
        <template #rightTitle>
            <div class="text-14 cur title-detail" @click="$router.push({ path: '/closedLoop/ClosedLoopWaterQuality' })">
                进入详情》
            </div>
        </template>
        <template #mainContent>
            <div class="main-box">
                <div ref="chartPieDom" class="chart mgb16" /><div ref="barDom" class="bottom-bar" />
            </div>
        </template>
    </commonPanel>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { globalKey } from '@/symbols'
import type { WarningListApiTs } from '@/components/waterControlCab/types'
import { getChartCloseBarWaterQualityOption, getWaterQualityCloseOption } from '@/utils/echarts/echartsOptions'
import service from '@/service/api'
const global = inject(globalKey)
const data = reactive({
    chartPieDom: ref(),
    barDom: ref(),
    chartPieData: [
        { name: '未处理', value: 4, rate: '1.4%' },
        { name: '已处理', value: 180, rate: '98.6%' },
    ]
})

onMounted(() => {
    getChart()
})

const getChart = async () => {
    const res = await service<WarningListApiTs, true>('common/monitorWarnData', {
        startTime: dayjs().startOf('year').valueOf(),
        endTime: dayjs().endOf('year').valueOf(),
        envTypeCodeList: ['water'],
        regionCodeList: ['330110000000']
    })
    const resData = res.data || []
    let disposedCount = 0
    let totalCount = 0
    resData.forEach((item) => {
        disposedCount += item.disposedCount
        totalCount += item.totalCount
    })
    const disRate = Math.round(disposedCount / totalCount * 1000) / 10
    data.chartPieData = [
        { name: '未处理', value: totalCount - disposedCount, rate: `${100 - disRate}%` },
        { name: '已处理', value: disposedCount, rate: `${disRate}%` },
    ]
    const chartChance = global?.echarts.init(data.chartPieDom)
    chartChance.setOption(getWaterQualityCloseOption(data.chartPieData, totalCount))
    getBarChart(resData)
}
const getBarChart = (val: WarningListApiTs['data']) => {
    const xData = ['国控', '省控', '市控', '县控']
    const yData = val.slice(0, 4).map((item) => {
        return {
            value: item.totalCount, done: item.disposedCount, unDone: item.totalCount - item.disposedCount
        }
    })
    const chartChance = global?.echarts.init(data.barDom)
    chartChance.setOption(getChartCloseBarWaterQualityOption(xData, yData))
}

const { chartPieDom, barDom } = toRefs(data)
</script>

<style lang="scss" scoped>
.chart {
    box-sizing: border-box;
    width: 100%;
    height: 112px;
    padding: 12px 16px;
    margin-top: 12px;
    background: rgba(0, 47, 93, 0.3);
    border: 1px solid #00366a;
    border-radius: 4px;
}

.bottom-bar {
    width: 344px;
    height: 115px;
}

.main-box {
    padding: 0 12px;
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

.title-detail {
    color: rgba(255, 255, 255, 0.7);
}

.title-detail:hover {
    color: #00e5ff;
}
</style>

