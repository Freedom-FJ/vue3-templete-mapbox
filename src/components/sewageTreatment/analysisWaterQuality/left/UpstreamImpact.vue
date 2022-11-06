<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-29 09:35:44
 * @Description:
-->
<template lang="pug">
commonPanel(title="上游影响" panelBg='panel-1' :height='406')
    template(#mainContent)
        .chart(ref='elementChart')
        .bottom-table
            .table-header
                .header-item(style="flex: 4.5;text-align: left;").text-12 断面相关性系数排名及最近报警统计
                .header-item.text-12.c-w-6 相关系数
                .header-item.text-12.c-w-6 报警数
            .table-body
                .table-line(v-for="(item,index) in relativeData" :key="index")
                    .table-line-item.num-14 {{index+1}}
                    .table-line-item.text-14(style="flex: 1.5;") {{item.siteName}}
                    .table-line-item(style="flex: 2;")
                        .bar-box
                            .bar-value(:style="{ width: Number(item.coefficientPre)*100 + '%'}")
                    .table-line-item.num-14.green-e {{item.coefficientPre || '--'}}
                    .table-line-item.num-14.red-5 {{item.alarmNum || '--'}}
</template>

<script setup lang="ts">
import type { correlationTs } from '../types'
import { upImpactLine } from '@/utils/echarts/echartsOptions'
import { getWaterQualityDictionaries } from '@/utils/waterUtils'
import { globalKey } from '@/symbols'
import service from '@/service/api'
import { useAnalysisStore } from '@/store/analysis'
const analysisStore = useAnalysisStore()
const global = inject(globalKey)
const elementChart = ref('')
const data = reactive({
    toggleList: [
        { name: '最近7天', value: '' },
        { name: '最近30天', value: '' }
    ],
    activeIndex: 0,
    standardValue: '',
    relativeData: [] as correlationTs[],
    firstAlarmNum: '',
    analysisData: {} as typeof analysisStore['analysis']['data']
})
const watchData = computed(() => {
    const dateTime = analysisStore.getAnalysisData.dateTime
    const pointData = analysisStore.getAnalysisData.data.pointData
    return { dateTime, pointData }
})
watch(watchData, (val) => {
    if (!val.pointData) return
    data.analysisData = analysisStore.analysis.data
    if (data.standardValue)
        getFactorStandard()
    else getPathAnalysis()
    getCorrelationAnalysis()
}, { deep: true })

// 获取因子限值
const getFactorStandard = async () => {
    const gradeList = await getWaterQualityDictionaries('waterSurface')

    // 获取baseLevel
    const resQ = gradeList.filter((o) => {
        return o.id === data.analysisData.waterQuality
    })
    const params = {
        baseLevel: resQ[0].level, // 需要根据ID匹配
        factorGroup: '',
        sectionType: data.analysisData.sectionType
    }
    const res = await service<record, true>('common/surfaceWaterStandard', params)
    data.standardValue = data.analysisData.factorCode && res[data.analysisData.factorCode].value
    console.log(data.standardValue, 'data.standardValue')
    getPathAnalysis() // 沿程分析-折线图
}

const getCorrelationAnalysis = () => {
    const params = {
        startTime: analysisStore.analysis.dateTime[0], // 开始时间
        endTime: analysisStore.analysis.dateTime[1], // 结束时间
        factorCode: data.analysisData.factorCode, // 因子编码
        siteCode: data.analysisData.siteCode, // 站点编码
        sourceIds: data.analysisData.pointData, // 关联的站点id
        timeType: data.analysisData.timeType // 报警类型映射
    }
    service<correlationTs[]>('waterQuality/correlationAnalysis', params)
        .then((res) => {
            const resData = res.data || []
            data.relativeData = resData.slice(0, 3)
            if (data.relativeData.length > 0)
                data.firstAlarmNum = data.relativeData[0].alarmNum
        })
        .catch((error) => {
            console.error('相关性报错：', error)
        })
}
// 沿程分析-折线图 获取数据
const getPathAnalysis = async () => {
    const res = await service<{ siteName: string; value: string; quality: string }[]>('waterQuality/pathAnalysisNew', {
        time: data.analysisData.dataTime,
        factorCode: data.analysisData.factorCode, // 因子编码
        siteCode: data.analysisData.siteCode, // 站点编码
        sourceIds: data.analysisData.pointData, // 关联的站点id
        timeType: data.analysisData.timeType // 报警类型映射
    })

    const waterQualityData: { xAxis: string[]; data: string[]; qualitys: string[] } = {
        xAxis: [],
        data: [],
        qualitys: []
    }
    const juageArr = []
    const resData = res.data || []
    resData.forEach((item) => {
        waterQualityData.xAxis.push(item.siteName)
        waterQualityData.data.push(item.value)
        waterQualityData.qualitys.push(item.quality)
        item.value === '' ? juageArr.push(item.value) : 0
    })
    if (juageArr.length === resData.length)
        return
    nextTick(async () => {
        const chart = global?.echarts.init(elementChart.value)
        const lineOptions = await upImpactLine(waterQualityData, data.standardValue, data.analysisData.dataTimeStr || '', data.analysisData.factorName || '')
        chart.setOption(lineOptions)
    })
}
const { relativeData } = toRefs(data)
</script>

<style lang="scss" scoped>
.chart {
    width: 100%;
    height: 147px;
}

.bottom-table {
    margin-top: 16px;

    .table-header {
        display: flex;
        align-items: center;

        .header-item {
            flex: 1;
            text-align: center;
        }
    }

    .table-body {
        margin-top: 16px;

        .table-line {
            display: flex;
            align-items: center;
            height: 28px;

            .table-line-item {
                flex: 1;
                text-align: center;
            }

            .bar-box {
                width: 96px;
                height: 6.12px;
                margin: 0 auto;
                background: rgba(255, 255, 255, 0.2);

                .bar-value {
                    height: 100%;
                    background-color: #00e87e;
                }
            }
        }
    }
}
</style>

