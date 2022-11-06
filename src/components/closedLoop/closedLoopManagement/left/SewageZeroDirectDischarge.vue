<template>
    <commonPanel title="污水零直排" :height="196">
        <template #rightTitle>
            <div class="text-14 cur title-detail" @click="$router.push({ path: '/closedLoop/ClosedLoopSewage' })">
                进入详情》
            </div>
        </template>
        <template #mainContent>
            <div class="warn-content">
                <div class="tab-item">
                    <div class="title">
                        整体分析
                    </div><div class="today-line flex-bw-c">
                        <div class="label">
                            总数
                        </div><div class="right-box-item flex-c">
                            <div class="label-num">
                                3
                            </div><div ref="upCharts" class="chart" />
                        </div>
                    </div><div class="bottom-count-box flex-bw-c mgb10">
                        <div class="left-box flex-c">
                            <div class="ball mgr4 bgc-red" /><div class="text-label text-14">
                                未处置
                            </div>
                        </div><div class="right-box">
                            <span class="value mgr2 red num-16">3</span><span class="unit mgr2 unit-16">/</span><span class="rate num-16">15%</span>
                        </div>
                    </div><div class="bottom-count-box flex-bw-c">
                        <div class="left-box flex-c">
                            <div class="ball mgr4 bgc-green-3" /><div class="text-label text-14">
                                已处置
                            </div>
                        </div><div class="right-box">
                            <span class="value mgr2 green num-16">3</span><span class="unit mgr2 unit-16">/</span><span class="rate num-16">15%</span>
                        </div>
                    </div>
                </div><div class="right-item">
                    <div class="title text-14 mgb13">
                        分类统计
                    </div><div class="label-line flex-bw-c mgb10">
                        <div class="label text-14">
                            工业园区
                        </div><div class="value num-16">
                            10
                        </div>
                    </div><div class="label-line flex-bw-c mgb10">
                        <div class="label text-14">
                            生活小区
                        </div><div class="value num-16">
                            5
                        </div>
                    </div><div class="label-line flex-bw-c">
                        <div class="label text-14">
                            建设镇街
                        </div><div class="value num-16">
                            5
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </commonPanel>
</template>

<script lang="ts" setup name="torrent-warning">
import type { PropType } from 'vue'
import { globalKey } from '@/symbols'
import { usePopStore } from '@/store/popControl'

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
    getChartData(data.upCharts, { done: 20, total: 23 })
})

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
                center: ['50%', '51%'],
                radius: ['53%', '100%'],
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
const { warnCharts, upCharts, analysisCount, warningYearData } = toRefs(data)
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
    padding: 18px 0;

    .tab-item {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        width: 216px;
        height: 120px;
        padding: 12px 16px;
        background: rgba(0, 47, 93, 0.3);
        border: 1px solid #00366a;
        border-radius: 8px;

        .title {
            margin-bottom: 10px;
            font-family: TRENDS;
            font-size: 14px;
            font-weight: normal;
            line-height: 14px;
            color: #fff;
        }

        .today-line {
            display: flex;
            align-items: center;
            margin-bottom: 10px;

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

        .ball {
            width: 10px;
            height: 10px;
            border-radius: 50%;
        }
    }

    .right-item {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        width: 144px;
        height: 120px;
        padding: 12px 16px;
        background: rgba(0, 47, 93, 0.3);
        border: 1px solid #00366a;
        border-radius: 8px;
    }
}

.title-detail {
    color: rgba(255, 255, 255, 0.7);
}

.title-detail:hover {
    color: #00e5ff;
}
</style>
