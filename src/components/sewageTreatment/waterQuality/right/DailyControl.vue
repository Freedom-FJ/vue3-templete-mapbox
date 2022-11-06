<template lang="pug">
commonPanel(title="日常管控" :height='224' :subTitle='subTitle')
    template(#rightTitle)
        .right-title 已处理/预警数

    template(#mainContent)
        .warn-content
            .tab-item(:class="[popStore.getCurrentPop === 'EarlyWarningEventPop' ? 'panel-checked' : '']" @click="popStore.upDatePopup({currentPop: 'EarlyWarningEventPop'})")
                .title 预警事件
                .today-line
                    .label 今日
                    .value {{analysisCount.done}}
                    .text /
                    .label-num {{analysisCount.total}}
                    .chart(ref="warnCharts")
                .year-line
                    .year-label 年累计
                    .year-value {{warningYearData.done}}
                    .year-text /
                    .year-total {{warningYearData.total}}
                .bottom-bar
                    .bar-value(:style="{ width: warningYearData.percent + '%'}")
            .tab-item
                .title 上报事件
                .today-line
                        .label 今日
                        .value 20
                        .text /
                        .label-num 23
                        .chart(ref="upCharts")
                .year-line
                        .year-label 年累计
                        .year-value 10000
                        .year-text /
                        .year-total 10000
                .bottom-bar
                        .bar-value(:style="{ width: '70%'}")
</template>

<script lang="ts" setup name="torrent-warning">
import dayjs from 'dayjs'
import type { PropType } from 'vue'
import type { countSiteTypeAndRateApiTs } from '../type'
import { globalKey, } from '@/symbols'
import { usePopStore, } from '@/store/popControl'
import { getSetTreeCode } from '@/utils/treeDataUtils'

import type { waterQualityPointTs } from '@/types/waterQuality'
import service from '@/service/api'
const props = defineProps({
    yearWaringData: {
        type: Array as PropType<waterQualityPointTs[]>
    }
})
const popStore = usePopStore()
const global = inject(globalKey)
const data = reactive({
    subTitle: '（2022）',
    warnCharts: ref(),
    upCharts: ref(),
    analysisCount: {
        done: 0,
        total: 0
    },
    warningYearData: {
        done: 0,
        total: 0,
        percent: 0
    }
})

onMounted(() => {
    getAnalysisDAta()
    getDataCount()
    getChartData(data.upCharts, { done: 20, total: 23 })
})
/**
 * @name: 获取预警统计 当日
 * @return {*}
 */
const getAnalysisDAta = async () => {
    const treeData = await getSetTreeCode()
    const startTime = dayjs().startOf('day').valueOf()
    const endTime = dayjs().valueOf()
    const params = {
        regionCodeList: [treeData],
        startTime,
        endTime,
        envTypeCodeList: [
            'water'
        ]
    }
    const res = await service<countSiteTypeAndRateApiTs[]>('waterControlCab/countSiteTypeAndRate', params)
    const resData = res.data || []
    let totalCount = 0
    let totalDis = 0
    resData.forEach((item) => {
        totalDis += item.disposedCount
        totalCount += item.totalCount
    })
    data.analysisCount.total = totalCount
    data.analysisCount.done = totalDis
    getChartData(data.warnCharts, data.analysisCount)
}
/**
 * @name: 获取当年事件数
 */
const getDataCount = async () => {
    const treeData = await getSetTreeCode()
    const params = {
        regionCodeList: [treeData],
        startTime: dayjs().startOf('year').valueOf(),
        endTime: dayjs().add(1, 'years').startOf('year').valueOf(),
        envTypeCodeList: [
            'water'
        ]
    }
    const res = await service<countSiteTypeAndRateApiTs[]>('waterControlCab/countSiteTypeAndRate', params)
    const resData = res.data || []
    let totalCount = 0
    let totalDis = 0
    resData.forEach((item) => {
        totalDis += item.disposedCount
        totalCount += item.totalCount
    })
    data.warningYearData = {
        done: totalDis,
        total: totalCount,
        percent: Math.round((totalDis / totalCount) * 100)
    }
    // data.dataList[0].total = totalCount
    // data.dataList[0].warn = totalDis
    // data.dataList[0].rate = Math.round((totalDis / totalCount) * 100)
}
const getChartData = (dom: HTMLElement, pie: { done: number; total: number }) => {
    const pieData = pie.total
        ? [
            { name: '完成', value: pie.done },
            { name: '未完成', value: pie.total - pie.done },
        ]
        : []

    if (!dom) return
    const chartChance = global?.echarts.init(dom)
    chartChance.setOption(getOption(pieData))
}

const getOption = (pieData: { name: string; value: number }[]) => {
    const chartOption = {
        grid: {
            top: 0,
            left: 55,
            bottom: '1%',
        },
        color: ['#00DDFF', 'rgba(255,255,255,.3)'],
        tooltip: {
            trigger: 'item',
            formatter: (params: {
                data: {
                    name: string
                    value: string
                    rate: string
                }
            }) => {
                const {
                    data: { name, value, rate }
                } = params
                return `${name}：${value}`
            }
        },
        series: [
            {
                name: '企业档案',
                type: 'pie',
                center: ['50%', '50%'],
                radius: ['53%', '90%'],
                avoidLabelOverlap: true,
                hoverAnimation: false,
                data: pieData,
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                }
            }
        ]
    }
    return chartOption
}
const { subTitle, warnCharts, upCharts, analysisCount, warningYearData } = toRefs(data)
</script>

<style lang="scss" scoped>
.right-title {
    font-family: TRENDS;
    font-size: 12px;
    font-weight: normal;
    line-height: 12px;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 0;
}

.warn-content {
    display: flex;
    justify-content: space-between;
    padding: 18px 12px 0;

    .tab-item {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        width: 165px;
        height: 144.44px;
        padding: 16px 15px 14px;
        background: rgba(2, 48, 87, 0.5);
        border: 1px solid #00366a;
        border-radius: 8px;

        .title {
            margin-bottom: 20px;
            font-family: TRENDS;
            font-size: 14px;
            font-weight: normal;
            line-height: 14px;
            color: #fff;
            letter-spacing: 0;
        }

        .today-line {
            display: flex;
            align-items: center;

            .label {
                margin-right: 15px;
                font-family: TRENDS;
                font-size: 14px;
                font-weight: normal;
                line-height: 14px;
                color: #fff;
                letter-spacing: 0;
            }

            .value {
                font-family: Furore;
                font-size: 16px;
                font-weight: normal;
                line-height: 16px;

                /* 主题色 */
                color: #0df;
                letter-spacing: 0;
            }

            .text {
                margin: 0 2px;
                font-family: Furore;
                font-size: 16px;
                font-weight: normal;
                line-height: 16px;
                color: rgba(255, 255, 255, 0.5);
                letter-spacing: 0;
            }

            .label-num {
                font-family: Furore;
                font-size: 16px;
                font-weight: normal;
                line-height: 16px;
                color: #fff;
                letter-spacing: 0;
            }

            .chart {
                width: 20px;
                height: 20px;
                margin-left: 8px;
            }
        }

        .year-line {
            display: flex;
            align-items: center;
            margin-top: 20px;

            .year-label {
                margin-right: 2px;
                font-family: TRENDS;
                font-size: 14px;
                font-weight: normal;
                line-height: 14px;
                color: #fff;
                letter-spacing: 0;
            }

            .year-value {
                font-family: Furore;
                font-size: 12px;
                font-weight: normal;
                line-height: 12px;

                /* 主题色 */
                color: #0df;
                letter-spacing: 0;
            }

            .year-text {
                margin: 0 2px;
                font-family: Furore;
                font-size: 12px;
                font-weight: normal;
                line-height: 12px;
                color: rgba(255, 255, 255, 0.5);
                letter-spacing: 0;
            }

            .year-total {
                font-family: Furore;
                font-size: 12px;
                font-weight: normal;
                line-height: 12px;
                color: #fff;
                letter-spacing: 0;
            }
        }

        .bottom-bar {
            width: 130px;
            height: 6px;
            margin-top: 20px;
            background-color: rgba(255, 255, 255, 0.5);

            .bar-value {
                height: 100%;

                /* 主题色 */
                background: #0df;
            }
        }
    }
}
</style>
