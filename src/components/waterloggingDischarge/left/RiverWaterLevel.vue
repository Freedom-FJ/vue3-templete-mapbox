<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-09 16:55:48
 * @Description:
-->
<template lang="pug">
commonPanel(title="河道水位"  panelBg='panel-big' :height='224' :bigBgTop="14")
    template(#mainContent)
        .main-box(ref="chartDom")
</template>

<script setup lang="ts">
import { globalKey } from '@/symbols'
import { riverWaterLevelChartOption } from '@/utils/echarts/echartsOptions'
const global = inject(globalKey)
const data = reactive({
    chartDom: ref(),
})
onMounted(async () => {
    const xAxis = ['2022-08-01 01', '2022-08-01 02', '2022-08-01 03', '2022-08-01 04', '2022-08-01 05', '2022-08-01 06', '2022-08-01 07', '2022-08-01 08', '2022-08-01 09', '2022-08-01 10', '2022-08-01 11', '2022-08-01 12', '2022-08-01 13', '2022-08-01 14', '2022-08-01 15', '2022-08-01 16', '2022-08-01 17', '2022-08-01 18', '2022-08-01 19', '2022-08-01 20', '2022-08-01 21', '2022-08-01 22', '2022-08-01 23', '2022-08-01 24',
    ]
    const seriesData = [
        { label: '余杭塘河', data: [15.5, 8.5, 1.2, 8.5, 17.4, 25.8, 20.8, 25.8, 15.8, 8.5, 25.8, 15.8, 14.6, 30.8, 8.5, 17.4, 25.8, 15.8, 20.8, 15.8, 15.8, 8.5, 25.8, 8.5] },
        { label: '五常港', data: [10.2, 0.85, 1.74, 10.55, 20.58, 2.08, 1.58, 0.85, 10.85, 10.85, 2.58, 2.58, 2.58, 2.58, 10.55, 2.58, 3.08, 1.74, 0.85, 10.55, 1.58, 0.85, 2.08, 1.46] },
        { label: '沿山港', data: [10.2, 0.85, 1.74, 10.55, 1.58, 1.08, 1.58, 0.85, 0.85, 0.85, 2.58, 1.58, 2.58, 2.58, 10.55, 2.58, 3.08, 1.74, 10.85, 10.55, 1.58, 0.85, 2.08, 1.46] },
        { label: '顾家桥港', data: [10.2, 0.85, 1.74, 0.85, 2.58, 1.58, 2.58, 2.58, 10.55, 2.58, 3.08, 10.55, 1.58, 1.08, 1.58, 0.85, 0.85, 1.74, 10.85, 10.55, 1.58, 0.85, 2.08, 1.46] },
    ]
    const chartChance = global?.echarts.init(data.chartDom)
    const option = riverWaterLevelChartOption(xAxis, seriesData)
    console.log(option)
    chartChance.setOption(option)
})
const { chartDom } = toRefs(data)
</script>

<style lang="scss" scoped>
.main-box {
    width: 100%;
    height: 150px;
}
</style>

