<!--
 * @Author: Tian
 * @Date: 2022-10-09 15:13:08
 * @LastEditors: Tian
 * @LastEditTime: 2022-10-10 09:54:14
 * @Description:
-->
<template lang="pug">
commonPanel(title="蓄水统计" :subTitle='subTitle' panelBg='panel-big' :height='192' :bigBgTop="14")
    template(#mainContent)
        .storage
            .left
                .top-text 中大型水库蓄水率
                .rate-val 47.6%
            .right
                .chart(ref="chartDom")
</template>

<script lang="ts" setup>
import { globalKey } from '@/symbols'
import { getBallWaterOption } from '@/utils/echarts/echartsOptions'
const global = inject(globalKey)
const chartDom = ref()
const data = reactive({
    subTitle: '（最新）'
})
onMounted(() => {
    getChart()
})

const getChart = () => {
    const chartChance = global?.echarts.init(chartDom.value)
    const options = getBallWaterOption()
    options.title.text = ''
    options.series[0].label.formatter = ''
    chartChance.setOption(options)
}
const { subTitle } = toRefs(data)
</script>

<style lang="scss" scoped>
.storage {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 120px;
}
.left {
    margin-right: 47px;
    .top-text {
        font-family: TRENDS;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 12px;
    }
    .rate-val {
        font-family: Furore;
        font-size: 32px;
        color: #02C6FC;
    }
}
.right {
    .chart {
        width: 88px;
        height: 88px;
    }
}
</style>
