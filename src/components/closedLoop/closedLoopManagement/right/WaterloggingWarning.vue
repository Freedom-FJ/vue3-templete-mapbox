<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-13 17:31:46
 * @Description:
-->
<template lang="pug">
commonPanel(title="涝水预警"   :height='168' )
    template(#mainContent)
        .main-box
            .chart.mgb16(ref="chartPieDom")
</template>

<script setup lang="ts">
import { getWaterloggingWarningCloseOption } from '@/utils/echarts/echartsOptions'
import { globalKey } from '@/symbols'
const global = inject(globalKey)
const data = reactive({
    chartPieData: [
        { name: '已处理', value: 5, rate: '75%' },
        { name: '未处理', value: 4, rate: '1.4%' },
        { name: '处置中', value: 5, rate: '98.6%' },
    ],
    chartPieDom: ref(),
})
onMounted(() => {
    getChart()
})

const getChart = () => {
    const chartChance = global?.echarts.init(data.chartPieDom)
    const count = data.chartPieData.reduce((pre, cur) => {
        return pre + cur.value
    }, 0)
    chartChance.setOption(getWaterloggingWarningCloseOption(data.chartPieData))
}

const { chartPieDom } = toRefs(data)
</script>

<style lang="scss" scoped>
.main-box {
    padding: 4px 8px;
}

.chart {
    box-sizing: border-box;
    width: 100%;
    height: 112px;
    padding: 12px 16px;
}
</style>

