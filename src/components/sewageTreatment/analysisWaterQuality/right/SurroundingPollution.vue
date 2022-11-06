<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-16 13:46:00
 * @Description:
-->
<template lang="pug">
commonPanel(title="周边污染影响" panelBg='panel-1' :height='536')
    template(#mainContent)
        .box-big.mgb24.mgt24
            .left-box
                .title-line.flex-bw-c.mgb8
                    .left-title.text-14 重点源超标率前三
                    .right-title
                        select-panel(:option="factorList" @change="checkFactor")
                .table-body
                    .table-line.flex-c.flex-son-1.h-32(v-for="(item,index) in pomsAlarmData" :key="index")
                        .line-item.flex-1.num-12.t-c {{item.rank}}
                        .line-item.flex-4.text-12 {{item.siteName}}
                        .line-item.red.flex-1.num-12.t-c {{item.alarmNum}}
                .no-data(v-if='pomsAlarmData.length == 0') 暂无数据
            .right-box
                .top-title.t-c.text-14.mgb24 异常溢流口统计
                .top-value.num-24.red {{typeof analysisStore.analysis.data.overflowPortNum === 'number' ? analysisStore.analysis.data.overflowPortNum : '--'}}
        .box-big.mgb24
            .left-box
                .title-line.flex-bw-c.mgb8
                    .left-title.text-14 重点源波动率前三
                    .right-title
                .table-body
                    .table-line.flex-c.flex-son-1.h-32(v-for="(item,index) in pomsAnalysisData" :key="index")
                        .line-item.flex-1.num-12.t-c {{item.rank}}
                        ElTooltip(
                            class="box-item"
                            effect="dark"
                            :content="item.companyName"
                            placement="top"
                        )
                            .line-item.flex-4.text-12.text-overflow {{item.companyName}}
                        .line-item.red.flex-1.num-12.t-c {{item.adjacentPre}}
                .no-data(v-if='pomsAnalysisData.length == 0') 暂无数据
            .right-box
                .top-title.t-c.text-14.mgb24 周边未处置事件
                .top-value
                    span.num-24.red {{boundaryData.disposal}}
                    span.num-16 /{{boundaryData.total}}
        .bottom-box
            .min-box( :class="[popStore.getCurrentPop ==='ProblemQuartersPop' && popStore.getPopData===0  ? 'panel-checked' : '']" @click="popStore.upDatePopup({currentPop:'ProblemQuartersPop', popData: 0})")
                .top-title.t-c.text-14.mgb24 异常入河排污口
                .top-value.num-24.red 5
            .min-box( :class="[popStore.getCurrentPop ==='ProblemQuartersPop' && popStore.getPopData===1  ? 'panel-checked' : '']" @click="popStore.upDatePopup({currentPop:'ProblemQuartersPop', popData: 1})")
                .top-title.t-c.text-14.mgb24 问题小区
                .top-value.num-24.red 5
            .min-box( :class="[popStore.getCurrentPop ==='ProblemQuartersPop' && popStore.getPopData===2  ? 'panel-checked' : '']" @click="popStore.upDatePopup({currentPop:'ProblemQuartersPop', popData: 2})")
                .top-title.t-c.text-14.mgb24 问题园区
                .top-value.num-24.red 5
</template>

<script setup lang="ts">
import { maxBy } from 'lodash-es'
import type { pomsAlarmTs, pomsAnalysisTs } from '../types'
import { getFactorGroupList, wgmsGetWaterAllFactorList } from '@/utils/commonMethods/factor'
import { usePopStore } from '@/store/popControl'
import service from '@/service/api'
import { useAnalysisStore } from '@/store/analysis'
const analysisStore = useAnalysisStore()
const popStore = usePopStore()
const data = reactive({
    pomsAlarmData: [] as pomsAlarmTs[],
    pomsAnalysisData: [] as any[],
    curFactor: '',
    factorList: [] as any[],
    pomsMax: 0,
    boundaryData: {
        disposal: 0,
        total: 0
    }, // 异常溢流口、周边未处置事件
})
const watchData = computed(() => {
    const dateTime = analysisStore.getAnalysisData.dateTime
    const distance = analysisStore.getAnalysisData.distance
    return { dateTime, distance }
})

watch(() => analysisStore.analysis.data.accessCodeList, () => {
    getBoundaryAnalysis()
})

// 获取污染源因子列表
const getFactorList = async () => {
    if (data.factorList.length) {
        getPomsAlarm()
        return
    }
    const allFactorListRes = await wgmsGetWaterAllFactorList()
    const factorsList = await getFactorGroupList('companyPollutionSource')
    if (!factorsList) return
    const factors = factorsList.factors
    const factorList = factors.map((item) => {
        const factorInfo = allFactorListRes.get(item.factorIndexCode)
        return { ...factorInfo, ...item, label: item.factorIndexName, value: item.factorIndexCode }
    })
    const codes: string[] = []
    factorList.forEach((item) => {
        codes.push(item.factorIndexCode)
    })
    const defaultFactor = { value: codes.join(','), label: '所有因子' }
    factorList.unshift(defaultFactor)
    data.factorList = factorList
    data.curFactor = data.factorList[0].value
    getPomsAlarm() // 重点源预警
}
// 重点源预警
const getPomsAlarm = async () => {
    const params = {
        startTime: analysisStore.analysis.dateTime[0], // 开始时间
        endTime: analysisStore.analysis.dateTime[1], // 结束时间
        distance: analysisStore.analysis.distance, // 距离
        siteCode: analysisStore.analysis.data.siteCode, // 所选站点编码
        factorCodes: data.curFactor,
        timeType: analysisStore.analysis.data.timeType // 报警类型映射
        // startTime: 1661760000000,
        // endTime: 1661846400000,
        // distance: 10000,
        // siteCode: 'JMSZJG10008',
        // factorCodes: 'w21003,w01018,w21011,w21001,w99030,w01001',
        // timeType: 'hour'
    }
    const res = await service<pomsAlarmTs[]>('waterQuality/pomsAlarm', params)
    data.pomsAlarmData = []
    if (res.data && res.data.length > 0) {
        data.pomsAlarmData = res.data.slice(0, 3)
        data.pomsAlarmData.forEach((item) => {
            item.alarmNum = Number(item.alarmNum)
        })
        const maxObj = maxBy(data.pomsAlarmData, 'alarmNum')
        data.pomsMax = maxObj.alarmNum
    }
}
// 重点波动率
const getPomsAnalysis = async () => {
    const params = {
        startTime: analysisStore.analysis.dateTime[0], // 开始时间
        endTime: analysisStore.analysis.dateTime[1], // 结束时间
        factorCode: analysisStore.analysis.data.factorCode, // 因子编码
        siteCode: analysisStore.analysis.data.siteCode, // 所选站点编码
        distance: analysisStore.analysis.distance, // 距离
        timeType: analysisStore.analysis.data.timeType // 报警类型映射
    }
    const res = await service<pomsAnalysisTs[]>('waterQuality/pomsAnalysis', params)
    const resData = res.data || []
    data.pomsAnalysisData = resData.slice(0, 3)
}
// 周边事件
const getBoundaryAnalysis = async () => {
    if (!analysisStore.analysis.data.accessCodeList) return
    // 不包含自己的点位
    const resultCodes = analysisStore.analysis.data.accessCodeList.split(',')
    const params = {
        envTypeCodeList: ['water'],
        siteCodeList: resultCodes, // res,
        timeStamp: analysisStore.analysis.data.dataTime, // 报警时间
        centerLatitude: analysisStore.analysis.data.latitude, // 纬度
        centerLongitude: analysisStore.analysis.data.longitude // 经度
    }
    const res = await service<{ notDisposedCount: number; totalCount: number }>('waterQuality/countEventStatusByTimePoint', params)
    if (res.success && res.data) {
        data.boundaryData.disposal = res.data.notDisposedCount
        data.boundaryData.total = res.data.totalCount
    }
}
const checkFactor = (val: { label: string; value: string }) => {
    data.curFactor = val.value
    getPomsAlarm()
}

watch(watchData, (val) => {
    const { dateTime, distance } = val
    if (!dateTime.length || !distance) return
    getFactorList()
    getPomsAnalysis()
}, { deep: true, immediate: true })
const { pomsAlarmData, factorList, pomsAnalysisData, boundaryData } = toRefs(data)
</script>

<style lang="scss" scoped>
.box-big {
    display: flex;
    justify-content: space-between;
    width: 100%;

    .left-box {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        width: 267px;
        height: 142px;
        padding: 12px;
        background: rgba(0, 47, 93, 0.3);
        border: 1px solid #00366a;
        border-radius: 4px;
    }

    .right-box {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 93px;
        height: 142px;
        padding: 12px;
        background: rgba(0, 47, 93, 0.3);
        border: 1px solid #00366a;
        border-radius: 4px;
    }
}

.no-data {
    width: 100%;
    margin-top: 40px;
    color: rgba(255, 255, 255, 0.6);
    text-align: center;
}

.bottom-box {
    display: flex;
    justify-content: space-between;
    width: 100%;

    .min-box {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 117.33px;
        height: 110px;
        padding: 24px 5px;
        background: rgba(0, 47, 93, 0.3);
        border: 1px solid #00366a;
        border-radius: 4px;
    }
}
</style>
