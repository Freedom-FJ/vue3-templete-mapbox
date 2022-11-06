<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-09 18:36:40
 * @Description:
-->
<template lang="pug">
commonPanel(title="积水监测"  panelBg='panel-big' :height='712' :bigBgTop="14")
    template(#mainContent)
        .main-box.pdt20.mg-a.w-96
            .chart-box.mgb24(v-for="(item, index) in list" :key="index")
                .title.text-16.mgb4 {{item.name}}
                .chart-dom(:ref="el => item.chartDom = el")
                .also-box.w-fit
                    .equipment.text-12.mgb25
                        span.name {{item.equipment}}：
                        span.equip-value.orange-3 1小时降雨量{{item.hourValue}}mm
                    .rain-box.blue.mg-a.w-fit 当前水位：{{item.currWaterLevel}}m
</template>

<script setup lang="ts">
import { globalKey } from '@/symbols'
import { PondingMonitoringRiverChartOption } from '@/utils/echarts/echartsOptions'
const global = inject(globalKey)
const data = reactive({
    chartDom: ref(),
    list: [
        {
            name: '下穿通道积水',
            chartDom: ref(),
            equipment: '余杭下穿通道',
            hourValue: 0,
            currWaterLevel: 0,
            data: {
                temperature: [0.02, 0.85, 1.74, 1.58, 1.55, 1.58, 1.08, 1.55, 1.58, 1.08, 1.58, 1.58, 1.74, 0.85, 1.55, 1.58, 0.85, 0.85, 0.85, 1.58, 1.58, 0.85, 1.08, 1.46],
                rain: [1.4, 1.44, 1.43, 1.41, 1.30, 1.20, 1.11, 1.05, 0.85, 0.75, 0.58, 0.50, 0.58, 0.68, 0.75, 0.88, 0.98, 1.04, 1.15, 1.25, 1.38, 1.45, 1.58, 1.56]
            },
            xAxis: ['2022-08-01 01', '2022-08-01 02', '2022-08-01 03', '2022-08-01 04', '2022-08-01 05', '2022-08-01 06', '2022-08-01 07', '2022-08-01 08', '2022-08-01 09', '2022-08-01 10', '2022-08-01 11', '2022-08-01 12', '2022-08-01 13', '2022-08-01 14', '2022-08-01 15', '2022-08-01 16', '2022-08-01 17', '2022-08-01 18', '2022-08-01 19', '2022-08-01 20', '2022-08-01 21', '2022-08-01 22', '2022-08-01 23', '2022-08-01 24']
        },
        {
            name: '道路积水',
            chartDom: ref(),
            equipment: '路面积水仪1号',
            hourValue: 0,
            currWaterLevel: 0,
            data: {
                temperature: [0.02, 0.85, 1.74, 1.58, 1.55, 1.58, 1.08, 1.55, 1.58, 1.08, 1.58, 1.58, 1.74, 0.85, 1.55, 1.58, 0.85, 0.85, 0.85, 1.58, 1.58, 0.85, 1.08, 1.46],
                rain: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
            },
            xAxis: ['2022-08-01 01', '2022-08-01 02', '2022-08-01 03', '2022-08-01 04', '2022-08-01 05', '2022-08-01 06', '2022-08-01 07', '2022-08-01 08', '2022-08-01 09', '2022-08-01 10', '2022-08-01 11', '2022-08-01 12', '2022-08-01 13', '2022-08-01 14', '2022-08-01 15', '2022-08-01 16', '2022-08-01 17', '2022-08-01 18', '2022-08-01 19', '2022-08-01 20', '2022-08-01 21', '2022-08-01 22', '2022-08-01 23', '2022-08-01 24']
        },
        {
            name: '地下空间积水',
            chartDom: ref(),
            equipment: '余杭下穿通道',
            hourValue: 0,
            currWaterLevel: 0,
            data: {
                temperature: [],
                rain: []
            },
            xAxis: ['2022-08-01 01', '2022-08-01 02', '2022-08-01 03', '2022-08-01 04', '2022-08-01 05', '2022-08-01 06', '2022-08-01 07', '2022-08-01 08', '2022-08-01 09', '2022-08-01 10', '2022-08-01 11', '2022-08-01 12', '2022-08-01 13', '2022-08-01 14', '2022-08-01 15', '2022-08-01 16', '2022-08-01 17', '2022-08-01 18', '2022-08-01 19', '2022-08-01 20', '2022-08-01 21', '2022-08-01 22', '2022-08-01 23', '2022-08-01 24']
        }
    ]
})
onMounted(async () => {
    data.list.forEach((item) => {
        const chartChance = global?.echarts.init(item.chartDom)
        const option = PondingMonitoringRiverChartOption(item.xAxis, item.data)
        chartChance.setOption(option)
    })
})
const { chartDom, list } = toRefs(data)
</script>

<style lang="scss" scoped>
.chart-dom {
    width: 100%;
    height: 170px;
}

.chart-box {
    position: relative;
}

.also-box {
    position: absolute;
    top: 35%;
    left: 24%;
}
</style>

