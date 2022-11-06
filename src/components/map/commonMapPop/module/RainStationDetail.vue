<template lang="pug">
popup-panel(:height='340' :width="336" :titleHeight="32" :isMapPop="true")
    template(#title)
        span {{detailObj.name}}
    .main-content
        .rain-detail
            .left
                .label 实时{{props.properties.typeCode === '3' ? '降雨量' : '水位'}}
                .value
                    span.val {{detailObj.real}}
                    span.unit {{factorInfo.unitName}}
                .time {{detailObj.time}}
            .right
                .line 站点类型：{{props.properties.typeCode === '3' ? '雨量站' : '水文站'}}
                .line 所在区域：{{detailObj.regionText}}
        .rain-chart
            .chart-title
                .name 趋势变化
                .factor {{factorInfo.factorIndexName}}（{{factorInfo.unitName}}）
            .chart-bar(ref='barChart' style='width: 296px;height: 120px;')
</template>

<script lang="ts" setup name="RainStationDetail">
import type { PropType } from 'vue'
import dayjs from 'dayjs'
import { useAnalysisStore } from '@/store/analysis'
import type { returnDataTs } from '@/utils/map/mapPoint'
import { baseChartOptions } from '@/utils/echarts/echartsOptions'
import echarts from '@/utils/echarts'
import treeUtil from '@/utils/treeDataUtils'
import { getFactorListByStationCode } from '@/utils/commonMethods/factor'
import Service from '@/service/api'
const props = defineProps({
    properties: {
        type: Object as PropType<returnDataTs[0]>,
        default: () => {
            return {}
        }
    }
})
const popData = reactive({
    detailObj: {
        name: '',
        stationType: '',
        regionText: '',
        real: '',
        time: '',
        typeCode: ''
    },
    factorInfo: {
        factorIndexName: '',
        unitName: '',
        id: ''
    } as any
})
const barChart = ref('')
const dataInit = async () => {
    // baseinfo
    const reginData = await treeUtil.getAreaCodeObj(props.properties.regionId)
    if (reginData)
        popData.detailObj.regionText = reginData.label || '--'
    popData.detailObj.name = props.properties.name
    const pollutantsArr = props.properties?.pollutants ? JSON.parse(props.properties?.pollutants) : []
    popData.detailObj.real = pollutantsArr.length ? pollutantsArr[0].value : '--'
    popData.detailObj.stationType = props.properties.typeCode === '3' ? '雨情站' : '水文站'
    popData.detailObj.time = getTime()
    const typeCode = props.properties.typeCode || '3'
    const factor = await getFactorListByStationCode(typeCode)
    popData.factorInfo.factorIndexName = factor?.factors[0].factorIndexName
    popData.factorInfo.unitName = factor?.factors[0].unitName
    popData.factorInfo.id = factor?.factors[0].id
    getChartData()
}

const getTime = () => {
    if (props.properties.time) return props.properties.time
    if (props.properties.isAnalysis)
        return dayjs(useAnalysisStore().analysis.data.dataTime).format('YYYY-MM-DD HH') || ''

    else
        return '--'
}
const getChartData = async () => {
    const res = await Service<{
        dates: Record<string, any>[]
        times: string[]
    }, true>(props.properties.typeCode === '3' ? 'common/wgmsRainWaterSingleSiteQuality' : 'common/wgmsHydrometricSingleSiteQuality', {
        accessCode: props.properties.accessCode,
        factor: popData.factorInfo.id,
        factorFlag: false,
        beginTime: dayjs(popData.detailObj.time).add(-11, 'hours')
            .startOf('hour')
            .valueOf(),
        endTime: dayjs(popData.detailObj.time)
            .add(1, 'hours')
            .startOf('hour')
            .valueOf(),
        dataTimeType: 60,
        queryTimeType: 'hour',
        siteId: props.properties.id
    })
    const chart = echarts.init(barChart.value)
    const seriesData = res.dates.map((item) => {
        return item.value
    })
    const xData = res.times.map((item) => {
        return item.slice(-2)
    })
    const dateTime = dayjs(popData.detailObj.time).format('YYYY-MM-DD')
    chart.setOption(baseChartOptions(dateTime, popData.factorInfo.unitName, xData, seriesData))
}
onMounted(() => {
    nextTick()
    dataInit()
})
const { detailObj, factorInfo } = toRefs(popData)
</script>

<style lang="scss" scoped>
.main-content {
    .rain-detail {
        display: flex;
        justify-content: space-between;
        padding: 16px 30px;
        font-family: TRENDS;
        font-size: 14px;

        .left {
            .value {
                margin: 10px 0;

                .val {
                    margin-right: 4px;
                    font-family: Furore;
                    font-size: 32px;
                    color: #30d385;
                }
            }

            .time {
                color: rgba(255, 255, 255, 0.5);
            }
        }

        .right {
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 82px;

            .line {
                margin-bottom: 12px;
            }

            .line:last-child {
                margin-bottom: 0;
            }
        }
    }

    .rain-chart {
        width: 296px;
        height: 166px;
        margin-left: 12px;
        background: rgba(0, 47, 93, 0.3);
        border: 1px solid #00366a;
        border-radius: 4px;

        .chart-title {
            display: flex;
            justify-content: space-between;
            padding: 12px;
            font-family: TRENDS;
            font-size: 14px;

            .factor {
                color: rgba(255, 255, 255, 0.5);
            }
        }
    }
}
</style>
