<!--
 * @Author: mjh
 * @Date: 2022-10-13 11:08:12
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-13 11:22:57
 * @Description:
-->
<template lang="pug">
commonPanel(title="水质达标率" panelBg='panel-big' :height='372' :bigBgTop="14")
    template(#mainContent)
        .environmental-status
            .factor-body.mgb24
                .factor-body-item(v-for="item in rateList" :key="item.name")
                    img.fator-pie(src="@/assets/images/sewageTreatment/percent-bg.png")
                    .factor-value {{ typeof item.rate === 'number'? `${item.rate}%` : '--' }}
                    .factor-name {{ item.name }}
            .bottom-chart(ref="chartDom")
</template>

<script lang="ts" setup name="environmental-status">
import { globalKey } from '@/symbols'
import { getWaterQualityRateOption } from '@/utils/echarts/echartsOptions'
const global = inject(globalKey)
const data = reactive({
    rateList: [
        { name: '卫建达标率', rate: 96.3 },
        { name: '卫建达标率', rate: 100 },
        { name: '卫建达标率', rate: 99.2 },
    ],
    chartDom: ref()
})
onMounted(() => {
    getChartData()
})
const getChartData = () => {
    const xData = ['2018', '2019', '2020', '2021']
    const yData = [70, 88, 73, 100]
    const chartChance = global?.echarts.init(data.chartDom)
    chartChance.setOption(getWaterQualityRateOption(xData, yData))
}
const { rateList, chartDom } = toRefs(data)
</script>

<style lang="scss" scoped>
.environmental-status {
    width: 100%;
    height: 100%;
    padding: 12px 0;

    .factor-body {
        display: flex;
        justify-content: space-between;
        padding: 0 16px;

        .factor-body-item {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            min-width: 78px;

            .fator-pie {
                position: absolute;
                top: -9px;
                left: -40px;
                width: 160px;
                height: 100px;

                // transform: translateX(-50%);
            }

            .factor-value {
                margin: 6px 0 32px;
                font-family: Furore;
                font-size: 20px;
                font-weight: normal;
                line-height: 30px;
                color: #0df;
                letter-spacing: 0;
            }

            .factor-name {
                width: 85px;
                font-family: TRENDS;
                font-size: 16px;
                font-weight: normal;
                line-height: 16px;
                color: #fff;
                text-align: center;
                letter-spacing: 0;
            }
        }
    }

    .bottom-chart {
        width: 100%;
        height: 170px;
    }
}
</style>
