<template lang="pug">
.common-container-size-style
        .common-header-query
            .title-header-str 趋势变化
            .item-select
                SelectPanel( arrow='box' :option="factorList" :isShowBack="true"  @change="querySelectChange")
        .change-chart#wq-con-change-chart(ref="wqConChangeChartDom")
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import dayjs from 'dayjs'
import { getColorNameByLevel, getWaterQualityDictionaries, } from '@/utils/waterUtils'
import { mapPointPopLineOptions } from '@/utils/echarts/echartsOptions'
import type { surfaceWaterStandardApiTs, surfaceWaterStandardValueTs } from '@/types/factor'
import type { stationCodeToTypeListTs } from '@/utils/commonMethods/factor'
import type { returnDataTs } from '@/utils/map/mapPoint'
import type { chartDataTs, factorInfoTs, factorItemTs } from '@/components/map/commonMapPop/types'
import { getFactorLevelRange, getFactorListByStationCode } from '@/utils/commonMethods/factor'
import service from '@/service/api'
import echarts from '@/utils/echarts'
import { useAnalysisStore } from '@/store/analysis'
import { detailTimeRange } from '@/utils/tools'
interface numberFactorTs {
    min: number
    max: number
    color: string
    level?: number
}
const props = defineProps({
    factorList: {
        type: Array as PropType<factorItemTs[]>,
        default: () => {
            return []
        }
    },
    properties: {
        type: Object as PropType<returnDataTs[0]>,
        default: () => {
            return {}
        }
    }
})
const analysisStore = useAnalysisStore()
const data = reactive({
    querySelect: 'level',
    timeTypeSelected: 'now',
    wqConChangeChartDom: ref(),
    factorGroupId: '',
    typeCode: '' as stationCodeToTypeListTs | undefined,
    targetWq: 1,
    surfaceWaterStandard: null as surfaceWaterStandardApiTs | null,
    factorStandObj: null as surfaceWaterStandardValueTs | null,
    factorInfo: {
        name: '水质类别',
        unit: '',
        isGroup: true,
        downValue: null,
        upValue: null,
        standardValue: null,
    } as factorInfoTs
})
watch(
    () => props.factorList,
    (val) => {
        if (Array.isArray(val) && val.length)
            data.querySelect = val[0].id || val[0].value
    },
    { deep: true, immediate: false }
)

onMounted(() => {
    initData()
})
/**
 * 获取图表数据
 */
const initData = async () => {
// 站点类型
    data.typeCode = props.properties.typeCode
    if (!data.typeCode) return
    const factorList = await getFactorListByStationCode(data.typeCode)
    data.factorGroupId = factorList?.id ?? ''
    const monitoringMethods = props.properties.monitoringMethods // 0 自动 1 手工
    if (monitoringMethods === 1) data.timeTypeSelected = 'month'
    if (props.properties.isAnalysis)
        data.timeTypeSelected = analysisStore.analysis.data.timeType || 'day'

    getSunWaterRealData()
}

/**
 * 水质站实时数据趋势数据
 * @param factor
 * @param factorFlag
 * @param siteId
 * @param typeCode
 * @param timeType
 * @return {*}
 */
const getSunWaterRealData = async () => {
    const url = data.typeCode === '40' ? 'common/wgmsStationDataChange40' : 'common/wgmsStationDataChange1'
    const params = getChartDefaultParams(data.timeTypeSelected, props.properties.id || '', data.factorInfo.isGroup ? data.factorGroupId : data.querySelect, data.factorInfo.isGroup)
    const res = await service<chartDataTs, true>(url, params)
    data.targetWq = await getColorNameByLevel('waterSurface', 'id', props.properties.waterQuality || '', 'level') // 获取水质评价目标限值
    const markLineData = getMarklines()
    const pieces = await getFactorLevelRange(data.factorInfo.code || 'level', props.properties.sectionType === '001' ? 0 : 1, data.factorStandObj || undefined)
    // const pieces = await getPieces(res.dates || []) || []
    nextTick(async () => {
        const waterChartObj = echarts.init(data.wqConChangeChartDom)
        const lineOptions = await mapPointPopLineOptions(res.times || res.time || [], res.dates || [], data.factorInfo, markLineData, pieces as any)
        waterChartObj.setOption(lineOptions)
    })
}
// 暂时不用注释
const getPieces = async (yData: { level: number | null; value?: number | null }[]) => {
    const gradesList = await getWaterQualityDictionaries('waterSurface') || []
    let piecesStatic: {
        min: null | number
        max: null | number
        color: string
        level?: number
    }[] = [
    ]
    if (data.factorInfo.isGroup) {
        gradesList.forEach((item) => {
            piecesStatic.push({
                min: item.level - 1,
                max: item.level,
                color: item.color
            })
        })
    }
    else {
        yData.forEach((item) => {
            const { value, level } = item
            if (typeof value === 'number' && typeof level === 'number') {
                if (!piecesStatic[level - 1]) {
                    piecesStatic[level - 1] = {
                        min: value,
                        max: value,
                        level,
                        color: gradesList[level - 1].color
                    }
                }
                else {
                    if ((piecesStatic[level - 1].min as number) > value) piecesStatic[level - 1].min = value
                    if ((piecesStatic[level - 1].max as number) < value) piecesStatic[level - 1].max = value
                }
            }
        })
        piecesStatic = piecesStatic.filter(item => item);
        (piecesStatic as numberFactorTs[]).forEach((item, index) => {
            const maxItem = piecesStatic[index + 1] as numberFactorTs || undefined
            if (maxItem) {
                if (maxItem.max < item.min) item.min = maxItem.max + 0.01
                else if (maxItem.min > item.max) item.max = maxItem.min - 0.01
            }
            if (item.max === item.min) {
                item.max = item.max + 0.01
                item.min = item.min - 0.01
            }
        })
    }
    return piecesStatic
}
/**
 * 获取所有标准线配置
 **/
const getMarklines = () => {
    const resData = []
    if (data.targetWq && data.factorInfo.isGroup) {
        resData.push(getMarklineOption('目标线', data.targetWq))
    }
    else {
        if (data.factorInfo.standardValue)
            resData.push(getMarklineOption('标准限', data.factorInfo.standardValue))

        if (data.factorInfo.upValue)
            resData.push(getMarklineOption('上限', data.factorInfo.upValue))

        if (data.factorInfo.downValue)
            resData.push(getMarklineOption('下限', data.factorInfo.downValue))
    }
    return resData
}
/***
 * 获取单条标准线配置
 */
const getMarklineOption = (label: string, val: any) => {
    return {
        yAxis: val,
        name: label,
        symbol: 'none',
        label: {
            show: true,
            formatter: '{b}',
            position: 'end',
            distance: -35,
            fontSize: 12,
            lineHeight: 15,
            padding: [2, 6, 0, 6],
            color: '#FFFFFF',
            backgroundColor: '#F84439',
            borderRadius: 8
        },
        lineStyle: {
            type: 'solid',
            color: '#F84439',
            width: 2
        }
    }
}
/**
 * 获取图表默认参数
 * @param timeType<String> ['year' | 'month', | 'now']
 * @param siteId<String> 监测点id
 * @param factor<String> 因子id或因子组id
 * @param factorFlag<Boolean> 是否因子组
 */
const getChartDefaultParams = (timeType: string, siteId: string, factor: string, factorFlag = true) => {
    const commonParams = {
        factor,
        factorFlag,
        siteId,
        waterType: props.properties.waterType,
        accessCode: props.properties.accessCode,
        stationCode: props.properties.typeCode
    }
    if (props.properties.isAnalysis) {
        const timeParams = detailTimeRange(timeType as any, dayjs(props.properties.time || analysisStore.analysis.data.dataTimeStr).valueOf(), true)
        return {
            ...timeParams,
            ...commonParams
        }
    }
    if (timeType === 'now') {
        return {
            ...commonParams,
            beginTime: dayjs()
                .add(-24, 'hours')
                .startOf('hour')
                .valueOf(),
            endTime: dayjs()
                .add(1, 'hours')
                .startOf('hour')
                .valueOf(),
            dataTimeType: 60,
            queryTimeType: 'hour'
        }
    }
    if (timeType === 'month') {
        return {
            ...commonParams,
            beginTime: dayjs()
                .add(-12, 'months')
                .startOf('month')
                .valueOf(),
            endTime: dayjs()
                .add(1, 'months')
                .startOf('month')
                .valueOf(),
            dataTimeType: 1440,
            queryTimeType: 'month'
        }
    }
    if (timeType === 'hour') {
        return {
            ...commonParams,
            beginTime: dayjs(props.properties.time)
                .add(-24, 'hours')
                .startOf('hours')
                .valueOf(),
            endTime: dayjs(props.properties.time)
                .startOf('hour')
                .valueOf(),
            dataTimeType: 60,
            queryTimeType: 'hour'
        }
    }
}
/**
 * 图表类型修改
 * @param val
 */
const querySelectChange = async (val: factorItemTs) => {
    const isGroup = val.value === 'level'
    data.querySelect = val.id
    const params = {
        baseLevel: data.targetWq || 3,
        factorGroup: '8',
        sectionType: props.properties.sectionType || ''
    }
    if (!data.surfaceWaterStandard)
        data.surfaceWaterStandard = await service<surfaceWaterStandardApiTs, true>('factor/surfaceWaterStandard', params)
    const factorDetail = val.factorIndexCode ? data.surfaceWaterStandard[val.factorIndexCode] : null
    data.factorStandObj = factorDetail
    data.factorInfo = {
        name: val.value === 'level' ? '水质类别' : val.factorIndexName ?? '',
        code: val.factorIndexCode,
        unit: val.unitName ?? '',
        isGroup,
        downValue: factorDetail?.downValue ?? null,
        upValue: factorDetail?.upValue ?? null,
        standardValue: factorDetail?.standardValue || factorDetail?.value || null,
    }
    getSunWaterRealData()
}

const {
    wqConChangeChartDom
} = toRefs(data)
</script>

<style scoped lang="scss">
.common-container-size-style {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 100%;
    height: 100%;
    padding: 7px 12px 12px;
    background: rgba(0, 47, 93, 0.3);
    border: 1px solid #00366a;
    border-radius: 4px;

    .common-header-query {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        .title-header-str {
            font-family: "Microsoft YaHei";
            font-size: 14px;
            font-weight: 700;
            color: #fff;
        }
    }
}

.change-chart {
    width: 100%;
    height: 194px;
    margin-top: 8px;
}
</style>
