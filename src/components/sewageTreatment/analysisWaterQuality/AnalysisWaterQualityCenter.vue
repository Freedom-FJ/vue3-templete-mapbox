<!--
 * @Author: Tian
 * @Date: 2022-09-05 14:21:51
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-15 19:33:05
 * @Description:
-->

<template lang="pug">
el-scrollbar.analysis-center-boxs
    commonPanel(title="辅助研判" panelBg='panel-1' :height='286' :width="1000")
        template(#mainContent)
            .body-box
                .left-box
                    .label-line.text-12.mgb23 1.{{resultObj.alarmResultDetail}}
                    .label-line.text-12.mgb23 2. {{resultObj.pomsResultDetail}}
                    .label-line.text-12.mgb23 3. {{resultObj.rainResultDetail}}
                    .label-line.text-12.mgb23 4. {{resultObj.eventResultDetail}}
                .right-box
                    .top-line.flex-bw-c
                        .left-title.text-14 各要素详情
                        .right-btn.flex-c.son-cur
                            .btn-box.mgr4(:class="!currType ? 'btn-box-click' : ''" @click="checkType(0)").cur 重点源
                            .btn-box.mgr4(:class="currType===1 ? 'btn-box-click' : ''" @click="checkType(1)").cur  溢流口
                            .btn-box(:class="currType===2 ? 'btn-box-click' : ''" @click="checkType(2)").cur  事件
                    .bottom-table.w-100(v-show="!currType")
                        .table-header.flex-c
                            .table-header-item.flex-1.t-c 序号
                            .table-header-item.flex-3.t-c 名称
                            .table-header-item.flex-1.t-c 预警次数
                            .table-header-item.flex-1.t-c 距离
                            .table-header-item.flex-1.t-c 波动率
                        .table-body
                            .table-body-line.flex-c.h-28(v-for="(item, index) in pomsAlarmStatList" :key="index")
                                .table-body-item.flex-1.t-c.num-12 {{index+1}}
                                .table-body-item.flex-3.t-c.text-12 {{item.companyName}}
                                .table-body-item.flex-1.t-c.num-12.blue {{item.alarmNum || '-'}}
                                .table-body-item.flex-1.t-c.num-12.blue {{item.distance || '-'}}
                                .table-body-item.flex-1.t-c.num-12.blue {{item.adjacentPre || '-'}}
                    .bottom-table.w-100(v-show="currType===1")
                        .table-header.flex-c
                            .table-header-item.flex-1.t-c 序号
                            .table-header-item.flex-3.t-c 溢流口
                            .table-header-item.flex-1.t-c 监测值
                            .table-header-item.flex-1.t-c 距离
                        .table-body
                            .table-body-line.flex-c.h-28(v-for="(item, index) in overflowTable" :key="index")
                                .table-body-item.flex-1.t-c.num-12 {{index+1}}
                                .table-body-item.flex-3.t-c.text-12 {{item.name}}
                                .table-body-item.flex-1.t-c.num-12.blue {{item.jiancezhi || '-'}}
                                .table-body-item.flex-1.t-c.num-12.blue {{item.intDistance || '-'}}
                    .bottom-table.w-100(v-show="currType===2")
                        .table-header.flex-c
                            .table-header-item.flex-1.t-c 序号
                            .table-header-item.flex-3.t-c 事件名称
                            .table-header-item.flex-1.t-c 状态
                            .table-header-item.flex-1.t-c 距离
                        el-scrollbar.table(:style="{height: height + 'px'}")
                            .table-body
                                .table-body-line.flex-c.h-28(v-for="(item, index) in eventTable" :key="index")
                                    .table-body-item.flex-1.t-c.num-12 {{index+1}}
                                    .table-body-item.flex-3.t-c.text-12 {{item.eventName}}
                                    .table-body-item.flex-1.t-c.num-12.blue {{item.prevDisposalStatusName || '-'}}
                                    .table-body-item.flex-1.t-c.num-12.blue {{item.distance || '-'}}
                        el-pagination( layout="prev, pager, next" :total="pageTotal" :page-size="10" @current-change="currentChange" style="margin: -5px auto;width: fit-content;")
</template>

<script lang="ts" setup>
import type { allQueryEventDataByTimePointTs, analysisResultTs, overFlowOutletTs, pomsAlarmStatTs, queryEventDataByTimePointTs } from './types'
import service from '@/service/api'
import { useAnalysisStore } from '@/store/analysis'
const analysisStore = useAnalysisStore()
const data = reactive({
    resultObj: {} as analysisResultTs | record,
    pomsAlarmStatList: [] as pomsAlarmStatTs[],
    overflowTable: [] as overFlowOutletTs['data'],
    eventTable: [] as queryEventDataByTimePointTs[],
    currType: 0,
    height: 127,
    unDisposalNum: 0,
    pageTotal: 0,
    currPage: 1
})

watch(analysisStore.analysis, (val) => {
    const { dateTime, data: valData } = val
    if (!dateTime.length || !valData.accessCodeList) return
    data.currType = 0
    getConclusion()
    getPomsAlarmStat()
    overflowPort()
}, { deep: true })
watch(() => analysisStore.analysis.data.accessCodeList, () => {
    eventList()
})

const getConclusion = () => {
    const params = {
        distance: analysisStore.analysis.distance,
        startTime: analysisStore.analysis.dateTime[0], // 开始时间
        endTime: analysisStore.analysis.dateTime[1], // 结束时间
        factorCode: analysisStore.analysis.data.factorCode, // 因子编码
        siteCode: analysisStore.analysis.data.siteCode, // 关联的站点编码
        timeType: analysisStore.analysis.data.timeType // 报警类型映射
    }
    service<analysisResultTs>('waterQuality/analysisResult', params)
        .then((res) => {
            data.resultObj = res.data || {}
        })
}
// 重点源
const getPomsAlarmStat = async () => {
    const params = {
        startTime: analysisStore.analysis.dateTime[0], // 开始时间
        endTime: analysisStore.analysis.dateTime[1], // 结束时间
        factorCode: analysisStore.analysis.data.factorCode, // 因子编码
        siteCode: analysisStore.analysis.data.siteCode, // 关联的站点编码
        distance: analysisStore.analysis.distance, // 距离
        timeType: analysisStore.analysis.data.timeType // 报警类型映射
        // startTime: 1661875200000,
        // endTime: 1662566399999,
        // factorCode: 'w01009',
        // siteCode: 'GKA330100_0002',
        // distance: 10000,
        // timeType: 'day'
    }
    const res = await service<pomsAlarmStatTs[]>('waterQuality/pomsAlarmStat', params)
    const resData = res.data || []
    data.pomsAlarmStatList = resData
}
// 溢流口
const overflowPort = async () => {
    data.overflowTable = []
    const params = {
        distance: analysisStore.analysis.distance, // 距离
        latitude: analysisStore.analysis.data.latitude, // 纬度
        longitude: analysisStore.analysis.data.longitude, // 经度
        timeType: analysisStore.analysis.data.timeType // 报警类型映射
    }
    const res = await service<overFlowOutletTs>('waterQuality/overFlowOutlet', params)
    if (res.data) {
        analysisStore.analysis.data.overflowPortNum = res.data.total
        data.overflowTable = res.data.data.map((item) => {
            item.jiancezhi = '--' // 监测值
            return item
        })
    }
}

// 事件
const eventList = async () => {
    if (!analysisStore.analysis.data.accessCodeList) return
    data.eventTable = []
    // 不包含自己的点位
    const resultCodes = analysisStore.analysis.data.accessCodeList.split(',')
    const params = {
        envTypeCodeList: ['water'],
        siteCodeList: resultCodes, // res,
        timeStamp: analysisStore.analysis.data.dataTime, // 报警时间
        centerLatitude: analysisStore.analysis.data.latitude, // 纬度
        centerLongitude: analysisStore.analysis.data.longitude, // 经度
        page: data.currPage,
        limit: 10
    }
    // 新API
    const res = await service<allQueryEventDataByTimePointTs, true>('waterQuality/queryEventDataByTimePoint', params)
    if (res.success && res.data) {
        data.eventTable = res.data.map((item) => {
            // 0 未处置  1处置中  2 已处置
            item.disposalStatusName = item.prevDisposalStatusCode === 0 ? '未处置' : item.prevDisposalStatusCode === 1 ? '处置中' : '已处置'
            return item
        })
        data.pageTotal = res.totalCount
    }
    else {
        console.log('事件接口请求失败')
    }
}
// 周边事件
// const getBoundaryAnalysis = () => {
//     const resultCodes = analysisStore.analysis.data.accessCodeList.split(',')
//     const params = {
//         envTypeCodeList: ['water'],
//         siteCodeList: resultCodes,
//         timeStamp: analysisStore.analysis.data.dataTime, // 报警时间
//         centerLatitude: analysisStore.analysis.data.latitude, // 纬度
//         centerLongitude: analysisStore.analysis.data.longitude // 经度
//     }
//     // 不包含自己的点位
//     service<countEventStatusByTimePointTs>('waterQuality/countEventStatusByTimePoint', params)
//         .then((res) => {
//             if (res.success && res.data)
//                 data.unDisposalNum = res.data.notDisposedCount
//         })
//         .catch((error) => {
//             console.log('事件接口请求出错', error)
//         })
// }
const checkType = (type: number) => {
    if (data.currType === type) return
    data.currPage = 1
    data.pageTotal = 0
    data.currType = type
    data.height = 127
    // if (type === 0)getPomsAlarmStat()
    // if (type === 1) overflowPort()
    if (type === 2)
        data.height = 112
}
/**
 * @name: 页码切换
 */
const currentChange = (page: number) => {
    data.currPage = page
    eventList()
}
const { resultObj, pomsAlarmStatList, currType, overflowTable, eventTable, height, pageTotal } = toRefs(data)
</script>

<style lang="scss" scoped>
.analysis-center-boxs {
    position: absolute;
    bottom: 32px;
    left: 50%;
    z-index: 9;
    width: fit-content;
    height: 286px;
    transform: translateX(-50%);

    .body-box {
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        padding-top: 12px;
    }

    .left-box {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        width: 544px;
        height: 210px;
        padding: 16px;
        /* stylelint-disable-next-line color-function-notation */
        background: rgb(0 47 93 / 0.3);
        border: 1px solid #00366a;
        border-radius: 4px;

        & > div {
            line-height: 13px;
        }
    }

    .right-box {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 408px;
        height: 210px;
        padding: 8px 16px;
        /* stylelint-disable-next-line color-function-notation */
        background: rgb(0 47 93 / 0.3);
        border: 1px solid #00366a;
        border-radius: 4px;
    }

    .btn-box {
        box-sizing: border-box;
        padding: 1px 10px;
        font-family: TRENDS;
        font-size: 12px;
        font-weight: normal;
        line-height: 20px;
        color: #0df;
        letter-spacing: 0;
        background: #002950;
        border: 1px solid #194269;
        border-radius: 4px;
    }

    .btn-box-click {
        color: white;
        background: #008dce;
        border: 1px solid #00e5ff;
    }

    .top-line {
        width: 100%;
        height: 22px;
        margin-bottom: 9px;
    }

    .table-header {
        height: 28px;
        font-size: 12px;
        /* stylelint-disable-next-line color-function-notation */
        border-bottom: 1px solid rgb(96 162 225 / 0.5);
    }

    ::v-deep() .el-pagination {
        .btn-next,
        .btn-prev {
            color: white;
            background-color: transparent;
        }
    }

    ::v-deep() .el-pager {
        li {
            color: white;
            background-color: transparent;
        }

        .is-active {
            color: #409eff;
        }
    }
}
</style>
