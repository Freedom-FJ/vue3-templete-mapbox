<!--
 * @Author: mjh
 * @Date: 2022-09-06 10:32:34
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-27 17:41:58
 * @Description:
-->
<template lang="pug">
popup-panel(:title="props.properties.name"  :height='320' :width="480" :titleHeight="32" :isMapPop="true")
    .common-pop-container
        .top-pop-line
            .waring-num
                span.label.text-14 提醒次数：
                span.label.num-16.red(style="vertical-align: top;") {{alarmTimes}}
            .waring-address
                span.label.text-14 所在区域：
                span.label.text-14 {{regionName}}
            .waring-address
                span.label.text-14 所在水系：
                span.label.text-14 {{watershedName}}
        .table-box
            popup-table(:option="option" ref="popupTableDom"  :data="tableData" :height="188" :lineStyle="{ height: '32px'}"  :heightLineStyle="{ height: '28px'}")
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import type { AlgaeWarningList } from './types'
import { usePopStore } from '@/store/popControl'
import service from '@/service/api'
import MapUtil from '@/utils/map/mapUtils'
import { useAnalysisStore } from '@/store/analysis'
const props = defineProps({
    properties: {
        type: Object,
        default: () => {
            return {}
        }
    },
    router: {
        type: Object,
        default: () => {
            return {}
        }
    }

})
const popStore = usePopStore()
const analysis = useAnalysisStore()
const data = reactive({
    alarmTimes: 0,
    watershedName: '',
    regionName: '',
    tableData: [],
    option: [
        {
            label: '监测时间',
            key: 'time',
            renderStyle: (item: record, option: record) => {
                return {
                    fontSize: '12px'
                }
            }
        },
        {
            label: '超标因子',
            key: 'factorName',
        },
        {
            label: '监测值(μg/L)',
            key: 'factorValue',
            renderStyle: (item: record, option: record) => {
                return {
                    color: '#F84439' // #36F097
                }
            }
        },
        {
            label: '限值(μg/L)',
            key: 'factorLimit',
        },
        {
            label: '操作',
            key: 'tool',
            type: 'tool',
            flex: 0.8,
            toolList: [
                {
                    label: '研判分析',
                    click: (item: record) => {
                        analysis.startAnalysis({
                            type: 'AnalysisOfAlgae',
                            distance: 10000,
                            dateTime: item.dateTime,
                            data: {
                                ...item,
                                dataTime: dayjs(item.time).valueOf(),
                                timeType: item.timeType,
                                isHandle: !!popStore.getPopData
                            }
                        })
                        window.glPopup && window.glPopup.remove()
                    }
                },
            ]
        }
    ]
})
// dayjs(analysisStore.analysis.data.time).valueOf()
onMounted(() => {
    getListData()
})
const getListData = async () => {
    const res = await service<AlgaeWarningList, true>(popStore.getPopData ? 'drinkingWaterSource/algaeSiteOverListHandle' : 'drinkingWaterSource/algaeSiteOverList', {
        begin: dayjs().startOf('year').valueOf(),
        end: dayjs().valueOf(),
        accessCode: props.properties.accessCode,
        timeType: popStore.getPopData ? 'day' : ''
    })
    data.tableData = res.data?.alarmList
    data.alarmTimes = res.data?.alarmTimes
    data.regionName = res.data?.regionName
    data.watershedName = res.data?.watershedName
    // 将siteCode塞进去
    data.tableData.forEach((item: Record<string, any>) => {
        item.siteCode = props.properties.accessCode
        item.alarmTypeName = '超标预警'
        // dateTime 自动 小时 近24小时 手工 日 最近七天
        item.dateTime = popStore.getPopData
            ? [
                dayjs(item.time).subtract(6, 'days').startOf('day').valueOf(),
                dayjs(item.time).valueOf()
            ]
            : [
                dayjs(item.time).subtract(23, 'hours').startOf('hour').valueOf(),
                dayjs(item.time).valueOf()
            ]
        item.timeType = popStore.getPopData ? 'day' : 'hour'
    })
}

const { tableData, option, alarmTimes, regionName, watershedName } = toRefs(data)
</script>

<style lang="scss" scoped>
.common-pop-container {
    width: 100%;
    height: 100%;

    .top-pop-line {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 16px 6px 16px 16px;

        .waring-num {
            display: flex;
            align-items: center;
        }

        .waring-address {
            display: flex;
        }

        .right-count {
            display: flex;
            align-items: center;

            .count-tips:first-child {
                box-sizing: border-box;
                display: flex;
                align-items: center;
                height: 28px;
                padding: 0 12px;
                margin-right: 8px;
                background: rgba(54, 240, 151, 0.2);
                border: 1px solid #36f097;
                border-radius: 4px;

                .tips-label {
                    margin-right: 8px;
                    font-family: TRENDS;
                    font-size: 12px;
                    font-weight: normal;
                    color: #36f097;
                }

                .tips-num {
                    font-family: Furore;
                    font-size: 16px;
                    font-weight: normal;
                    color: #36f097;
                }
            }

            .count-tips:nth-child(2) {
                box-sizing: border-box;
                display: flex;
                align-items: center;
                height: 28px;
                padding: 0 12px;
                margin-right: 8px;
                background: rgba(237, 225, 0, 0.2);
                border: 1px solid #f7c706;
                border-radius: 4px;

                .tips-label {
                    margin-right: 8px;
                    font-family: TRENDS;
                    font-size: 12px;
                    font-weight: normal;
                    color: #f7c706;
                }

                .tips-num {
                    font-family: Furore;
                    font-size: 16px;
                    font-weight: normal;
                    color: #f7c706;
                }
            }

            .count-tips:nth-child(3) {
                box-sizing: border-box;
                display: flex;
                align-items: center;
                height: 28px;
                padding: 0 12px;
                margin-right: 8px;
                background: rgba(237, 107, 0, 0.2);
                border: 1px solid #ed6b00;
                border-radius: 4px;

                .tips-label {
                    margin-right: 8px;
                    font-family: TRENDS;
                    font-size: 12px;
                    font-weight: normal;
                    color: #ff8000;
                }

                .tips-num {
                    font-family: Furore;
                    font-size: 16px;
                    font-weight: normal;
                    color: #ff8000;
                }
            }
        }
    }

    .table-box {
        margin: 0 16px;
    }
}
</style>

