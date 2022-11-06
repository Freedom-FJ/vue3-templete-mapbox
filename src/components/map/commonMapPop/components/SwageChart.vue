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
import { getSetTreeCode } from '@/utils/treeDataUtils'
import { mapSwagePointPopLineOptions } from '@/utils/echarts/echartsOptions'
import type { stationCodeToTypeListTs } from '@/utils/commonMethods/factor'
import type { returnDataTs } from '@/utils/map/mapPoint'
import type { chartSwageDataTs, factorInfoTs, factorItemTs } from '@/components/map/commonMapPop/types'
import { getFactorListByStationCode, wgmsFindFactorInfoByCode } from '@/utils/commonMethods/factor'
import service from '@/service/api'
import { detailTimeRange } from '@/utils/tools'
import echarts from '@/utils/echarts'
import { useAnalysisStore } from '@/store/analysis'

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
    },
    /**
     * 排口值
     */
    outletValue: {
        type: String,
        default: ''
    }
},)
const analysisStore = useAnalysisStore()

const data = reactive({
    querySelect: 'level',
    timeTypeSelected: 'now',
    wqConChangeChartDom: ref(),
    factorGroupId: '',
    typeCode: '' as stationCodeToTypeListTs | undefined,
    targetWq: 1,
    timeParams: {
        beginTime: dayjs().add(-6, 'days').startOf('day').valueOf(),
        endTime: dayjs().endOf('day').valueOf(),
        timeUnit: 'day',
        timeStr: '日均值'
    },
    factorInfo: {
        name: '',
        unit: '',
        downValue: null,
        upValue: null,
        standardValue: null,
    } as Omit<factorInfoTs, 'isGroup'>
})
watch(
    () => props.factorList,
    (val) => {
        if (Array.isArray(val) && val.length)
            data.querySelect = val[0].id || val[0].value
    },
    { deep: true, immediate: false }
)
watch(() => props.outletValue, () => {
    getChartData()
})
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
    if (monitoringMethods === 1) data.timeParams.timeUnit = 'month'
    if (props.properties.isAnalysis) { // 代表预警研判页面
        const {
            beginTime,
            endTime,
            queryTimeType,
            timeStr
        } = detailTimeRange(props.properties.queryTimeType || 'day', props.properties.time ? dayjs(props.properties.time).valueOf() : analysisStore.analysis.data.dataTime, true)
        data.timeParams = {
            beginTime,
            endTime,
            timeUnit: queryTimeType,
            timeStr: `${timeStr}均值`
        }
    }
    getChartData()
}

/**
 * @name: 处理echarts图标数据
 */
const getChartData = async () => {
    if (!props.outletValue) return
    const treeData = await getSetTreeCode()
    const params = {
        ...data.timeParams,
        regionId: treeData,
        accessCodes: props.outletValue,
        factorIndex: data.querySelect,
        dataType: 0 // 通过dataType---1  后台累加计算
    }
    Promise.all([service<chartSwageDataTs, true>('publicMap/outletPollutant', params), service<chartSwageDataTs, true>('publicMap/outletPollutant', {
        ...params,
        dataType: 1
    })]).then((resList) => {
        const xData = resList[0].times || []
        const yData1 = resList[0].data || []
        const yData2 = resList[1].data || []
        const waterChartObj = echarts.init(data.wqConChangeChartDom)
        const lineOptions = mapSwagePointPopLineOptions(xData, [yData1, yData2], data.factorInfo, [], data.timeParams.timeStr)
        waterChartObj.setOption(lineOptions)
    })
}

/**
 * 图表类型修改
 * @param val
 */
const querySelectChange = async (val: factorItemTs) => {
    data.querySelect = val.id
    const factorDetail = val.factorIndexCode ? await wgmsFindFactorInfoByCode(val.factorIndexCode) : {}
    data.factorInfo = {
        name: (factorDetail as factorItemTs)?.factorIndexName ?? '',
        unit: (factorDetail as factorItemTs)?.unitName ?? '',
        downValue: (factorDetail as factorItemTs)?.downValue ?? null,
        upValue: (factorDetail as factorItemTs)?.upValue ?? null,
        standardValue: (factorDetail as factorItemTs)?.standardValue ?? null,
    }
    getChartData()
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
