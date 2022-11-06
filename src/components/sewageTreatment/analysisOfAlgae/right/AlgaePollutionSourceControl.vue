<!--
 * @Author: Tian
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-16 18:15:04
 * @Description:
-->
<template lang="pug">
commonPanel(title="污染源管控" panelBg='panel-1' :height='440')
    template(#rightTitle)
        .right-title
            .btn(v-for='item, index in toggleList' :class='index === activeIndex ? "active" : ""' @click='changeNav(index)' :key="item.name") {{item.name}}
    template(#mainContent)
        .pollution-source
            .key-source
                .title-text
                    .text 重点源超标前三
                    .select
                        select-panel(:option="keySelectList" @change="keyFactorsCheck")
                .key-list
                    .key-one(v-for='item in companyList')
                        .top
                            .left
                                span {{item.rank}}
                                span {{item.siteName}}
                            .right {{item.alarmNum}}
                        .bar
                            .pos(:style='{width: item.alarmNum / alarmMax * 100 + "%"}')
            .statistic-content
                .statistic-box
                    .text 重点源超标统计
                    .total-content
                        .left 总数
                        .right
                            .num {{totalCount}}
                            .chart(ref='statChart')
                    .legend
                        .legend-one(v-for='item, index in chartDetail')
                            .left
                                .circle(:style='{background: colorList[index]}')
                                .name {{item.name || '--'}}
                            .right
                                span {{item.value || '--'}}
                                span /
                                span {{item.rate || '--'}}%

                .statistic-box
                    .text 入河排污口
                    .port-list
                        .port-one
                            .name 氮超标
                            .value
                                span {{nh3OverNum}}
                                span 个
                        .port-one
                            .name 磷超标
                            .value
                                span {{tpOverNum}}
                                span 个
</template>

<script setup lang="ts">
import { maxBy } from 'lodash-es'
import type { PomsAlarmList, PomsDataList, PortToRiverData } from '../type'
import { getFactorGroupList } from '@/utils/commonMethods/factor'
import { pollutionSourcePieOptions } from '@/utils/echarts/echartsOptions'
import { globalKey } from '@/symbols'
import service from '@/service/api'
import { useAnalysisStore } from '@/store/analysis'
const global = inject(globalKey)
const analysisStore = useAnalysisStore()
const data = reactive({
    toggleList: [
        { name: '实时', value: '' },
        { name: '历史', value: '' }
    ],
    activeIndex: 0,
    keySelectList: [] as Record<string, any>[],
    curSelectFactor: '',
    companyList: [] as {
        siteName: string
        alarmNum: number
        rank: number
    }[],
    alarmMax: 0,
    keySourseData: [
        { factorIndexCode: 'w21003', standardUnitName: null, factorName: '氮超标', rank: 1, total: 0, proportion: 0 },
        { factorIndexCode: 'w21011', standardUnitName: null, factorName: '磷超标', rank: 2, total: 0, proportion: 0 },
        { factorIndexCode: 'w01009', standardUnitName: null, factorName: '其他 ', rank: 3, total: 0, proportion: 0 }
    ],
    chartDetail: [] as {
        value: string | number
        rate: string | number
        name: string
        itemStyle: Record<string, any>
    }[],
    colorList: ['#F84439', '#0062FF', '#2AC94F'],
    nh3OverNum: 0,
    tpOverNum: 0,
    totalCount: 0
})
const statChart = ref('')
const changeNav = (index: number) => {
    data.activeIndex = index
}
const keyFactorsCheck = (item: { value: string; code: string }, index: number) => {
    data.curSelectFactor = item.code
}
onMounted(() => {
    nextTick()
    keyPollutionData()
    getPortData()
    keyPollutionStatistic()
})
/**
 * 监听研判分析面板时间改变
 */
watch(() => analysisStore.analysis, () => {
    keyPollutionData()
    getPortData()
    keyPollutionStatistic()
}, { deep: true })
// 重点源超标前三
const keyPollutionData = async () => {
    // 获取因子组
    const factorList = await getFactorGroupList('companyPollutionSource')
    const resList = factorList?.factors.length
        ? factorList.factors.map((item: Record<string, any>) => {
            return {
                label: item.factorIndexName,
                code: item.factorIndexCode,
                id: item.id
            }
        })
        : []
    data.keySelectList = [
        { label: '所有因子', code: '', id: '' },
        ...resList
    ]
    const res = await service<PomsAlarmList, true>('drinkingWaterSource/pomsAlarm', {
        startTime: analysisStore.getAnalysisData.dateTime[0],
        endTime: analysisStore.getAnalysisData.dateTime[1],
        distance: analysisStore.getAnalysisData.distance,
        siteCode: analysisStore.getAnalysisData.data.siteCode,
        factorCodes: data.curSelectFactor
    })
    if (res.data.length) {
        // 获取前三
        data.companyList = res.data.slice(0, 3)
        data.companyList.forEach((item) => {
            item.alarmNum = Number(item.alarmNum)
        })
        const maxObj = maxBy(data.companyList, 'alarmNum')
        data.alarmMax = maxObj.alarmNum
    }
    else {
        data.companyList = []
    }
}
// 入河排污口接口联调
const getPortData = async () => {
    const res = await service<PortToRiverData, true>('drinkingWaterSource/portToRiver', {
        startTime: analysisStore.getAnalysisData.dateTime[0],
        endTime: analysisStore.getAnalysisData.dateTime[1],
        distance: analysisStore.getAnalysisData.distance,
        longitude: analysisStore.getAnalysisData.data.longitude,
        latitude: analysisStore.getAnalysisData.data.latitude,
    })
    data.nh3OverNum = res.data.nh3OverNum
    data.tpOverNum = res.data.tpOverNum
}
// 重点源超标统计
const keyPollutionStatistic = async () => {
    const res = await service<PomsDataList, true>(analysisStore.getAnalysisData.data.isHandle ? 'drinkingWaterSource/pomsFactorAlarmHandle' : 'drinkingWaterSource/pomsFactorAlarm', {
        startTime: analysisStore.getAnalysisData.dateTime[0],
        endTime: analysisStore.getAnalysisData.dateTime[1],
        distance: analysisStore.getAnalysisData.distance,
        siteCode: analysisStore.getAnalysisData.data.siteCode,
        timeType: analysisStore.getAnalysisData.data.isHandle ? 'day' : ''
    })
    data.totalCount = res.data.total
    const total = res.data.total
    const dataList = res?.data?.data ?? []
    let N = 0; let P = 0
    dataList.forEach((item: Record<string, any>) => {
        if (item.w21003)
            N = item.w21003

        else if (item.w21011)
            P = item.w21011
    })
    data.keySourseData.forEach((item: Record<string, any>) => {
        if (item.factorIndexCode === 'w21003') {
            item.proportion = N
            item.total = total === 0 ? '' : ((100 * N) / total).toFixed(1) as number | string
        }
        else if (item.factorIndexCode === 'w21011') {
            item.proportion = P
            item.total = total === 0 ? '' : ((100 * P) / total).toFixed(1)
        }
        else {
            item.proportion = total - P - N
            item.total = total === 0 ? '' : ((100 * (total - P - N)) / total).toFixed(1)
        }
    })
    let otherCount = 0
    const colors = ['#35aded', '#ff9902', '#00fc83']
    const details = [] as {
        value: string | number
        rate: string | number
        name: string
        itemStyle: Record<string, any>
    }[]
    data.keySourseData.forEach((item, index) => {
        otherCount -= item.proportion
        details.push({
            value: item.proportion,
            rate: item.total,
            name: item.factorName,
            itemStyle: { color: colors[index] }
        })
    })
    data.chartDetail = details
    const seriesData = [
        ...data.chartDetail,
        {
            value: otherCount,
            rate: otherCount,
            name: '其他',
            itemStyle: { color: '#00fc83' }
        }
    ]
    const chart = global?.echarts.init(statChart.value)
    const lineOptions = pollutionSourcePieOptions(seriesData)
    chart.setOption(lineOptions)
}
const { toggleList, activeIndex, keySelectList, companyList, colorList, nh3OverNum, tpOverNum, totalCount, chartDetail, alarmMax } = toRefs(data)
</script>

<style lang="scss" scoped>
.pollution-source {
    padding: 0 8px;

    .key-source {
        margin-top: 16px;

        .title-text {
            display: flex;
            justify-content: space-between;

            .text {
                font-family: TRENDS;
                font-size: 16px;
            }

            .select {
                font-family: TRENDS;
                font-size: 14px;

                // width: 90px;
            }
        }

        .key-list {
            min-height: 150px;
            margin-top: 10px;

            .key-one {
                margin-bottom: 10px;

                .top {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 4px;

                    .left {
                        span:nth-child(1) {
                            margin-right: 15px;
                            font-family: Furore;
                            font-size: 14px;
                        }

                        span:nth-child(2) {
                            font-family: TRENDS;
                            font-size: 14px;
                        }
                    }

                    .right {
                        font-family: Furore;
                        font-size: 16px;
                        color: #f54455;
                    }
                }

                .bar {
                    position: relative;
                    width: 100%;
                    height: 12px;
                    background: rgba(255, 255, 255, 0.2);

                    .pos {
                        position: absolute;
                        height: 100%;
                        background: #f54455;
                    }
                }
            }

            .key-one:last-child {
                margin-bottom: 0;
            }
        }
    }

    .statistic-content {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;

        .statistic-box {
            width: 164px;
            height: 180px;
            padding: 16px;
            background: rgba(0, 47, 93, 0.3);
            border: 1px solid #00366a;
            border-radius: 8px;

            .text {
                font-family: TRENDS;
                font-size: 16px;
            }

            .total-content {
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 20px;
                margin-top: 16px;

                .left {
                    font-family: TRENDS;
                    font-size: 14px;
                }

                .right {
                    display: flex;
                    font-family: Furore;
                    font-size: 16px;

                    .chart {
                        width: 20px;
                        height: 20px;
                        margin-left: 8px;
                    }
                }
            }

            .legend {
                margin-top: 16px;

                .legend-one {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 13px;

                    .left {
                        display: flex;
                        align-items: center;

                        .circle {
                            width: 10px;
                            height: 10px;
                            margin-right: 4px;
                            border-radius: 50%;
                        }

                        .name {
                            font-family: TRENDS;
                            font-size: 14px;
                        }
                    }

                    .right {
                        display: flex;
                        align-items: center;
                        font-family: Furore;
                        font-size: 16px;

                        span:nth-child(1) {
                            color: #2ac94f;
                        }

                        span:nth-child(2) {
                            color: rgba(255, 255, 255, 0.5);
                        }
                    }
                }

                .legend-one:last-child {
                    margin-bottom: 0;
                }
            }

            .port-list {
                padding-top: 32px;

                .port-one {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 16px;

                    .name {
                        font-family: TRENDS;
                        font-size: 18px;
                    }

                    .value {
                        span:nth-child(1) {
                            font-family: Furore;
                            font-size: 32px;
                            color: #f54455;
                        }

                        span:nth-child(2) {
                            font-family: TRENDS;
                            font-size: 16px;
                            color: rgba(255, 255, 255, 0.6);
                        }
                    }
                }
            }
        }
    }
}

.right-title {
    display: flex;
    font-family: TRENDS;
    font-size: 12px;

    .btn {
        box-sizing: border-box;
        height: 22px;
        padding: 0 10px;
        margin-left: 4px;
        line-height: 22px;
        text-align: center;
        cursor: pointer;
        background: #023057;
        border: 1px solid #286c9d;
        border-radius: 4px;
    }

    .active {
        background: #008dce;
        border: 1px solid #00e5ff;
    }
}
</style>
