<!--
 * @Author: Tian
 * @Date: 2022-10-09 15:13:08
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-13 10:38:14
 * @Description:
-->
<template lang="pug">
commonPanel(title="用水保障" panelBg='panel-big' :height='240' :bigBgTop="14")
    template(#mainContent)
        .chart-box
            .chart-one
                .text 生活用水保障率
                .chart(ref="completeRateDom")
            .chart-one
                .text 生产用水保障率
                .chart(ref="produceRateDom")
</template>

<script lang="ts" setup>
import { globalKey } from '@/symbols'
const global = inject(globalKey)
const completeRateDom = ref()
const produceRateDom = ref()
const data = reactive({
    subTitle: '（最新）'
})
const getChartOption = (chartData: number[], color: string, fillColor: string) => {
    const chartOption = {
        grid: {
            top: 0,
            left: '1%',
            bottom: '1%',
            right: '1%'
        },
        color: [color, 'rgba(248, 68, 57, 1)'],
        graphic: [ // 设置饼图中间文字内容
            {
                type: 'text',
                left: 'center',
                top: 'center',
                style: {
                    text: '89.6%',
                    textAlign: 'center',
                    fontSize: 20,
                    fontFamily: 'Furore',
                    fill: fillColor
                }
            },
        ],
        series: [
            {
                name: '企业档案',
                type: 'pie',
                // center: ['16%', '50%'],
                roseType: 'radius',
                radius: ['80%', '98%'],
                avoidLabelOverlap: true,
                hoverAnimation: false,
                data: chartData,
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        },

                    },
                }
            }
        ]
    }
    return chartOption
}
onMounted(() => {
    const chartance = global?.echarts.init(completeRateDom.value)
    const chartData = [80, 20]
    chartance.setOption(getChartOption(chartData, '#0AFDA5', '#36F097'))
    const produceDom = global?.echarts.init(produceRateDom.value)
    produceDom.setOption(getChartOption(chartData, '#00DDFF', '#00DDFF'))
})
const { subTitle } = toRefs(data)
</script>

<style lang="scss" scoped>
.chart-box {
    display: flex;
    width: 100%;

    .chart-one {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 50%;
        height: 180px;

        .chart {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            box-shadow: 0 0 10px 3px rgba(10, 253, 165, 0.4);
        }

        .text {
            margin-bottom: 16px;
            font-family: TRENDS;
            font-size: 14px;
        }
    }

    .chart-one:last-child {
        .chart {
            box-shadow: 0 0 16px 0 rgba(10, 253, 253, 0.7);
        }
    }
}
</style>

