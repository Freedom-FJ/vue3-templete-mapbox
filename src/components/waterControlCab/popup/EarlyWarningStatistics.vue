<!--
 * @Author: Tian
 * @Date: 2022-10-11 10:05:11
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-19 09:36:35
 * @Description:
-->
<template lang="pug">
.early-warning.bf-blur(:style='{height: showPanel ? "436px" : "40px"}')
    .warning-bg(:style='{height: showPanel ? "436px" : "40px"}')
    .warning-content
        .text-title
            .left
                .text 预警统计
                .detail(@click='goPage') 详情
            img(:src='getAssetsFile(`waterControlCab/${showPanel ? "close" : "close-up"}.png`)' @click='toggleList')
        .date-list(v-show='showPanel')
            .one(v-for='item, index in dateList' :key='index' :class='activeIndex === index ? "active" : ""' @click='changeDate(index)') {{item.text}}
        el-scrollbar.list-content(style='height: 350px;' v-show='showPanel')
            .auto-select(v-if='activeIndex === 3')
                el-date-picker(
                    v-model="autoDate"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :disabled-date="disabledDate"
                )
            .warning-list
                .list-one
                    .top-title
                        .th 污水
                        .th 已完成/问题数
                        .th 处置率
                    .tb-content
                        .one(v-for='item, index in warningList' :class='selectedIdx === index ? "active" : ""' @click='selectedItem(item, index)')
                            .td {{item.siteTypeName}}
                            .td
                                span.doNum {{item.disposedCount}}
                                span.split /
                                span.total {{item.totalCount}}
                            .td {{item.disposalRate}}%
                        .one
                            .td 总计
                            .td
                                span.doNum {{totalAll.disposedCount}}
                                span.split /
                                span.total {{totalAll.totalCount}}
                            .td {{totalAll.disposalRate}}%
                .other-one
                    .top-title 山洪
                    img(src='@/assets/images/waterControlCab/down.png')
                .other-one
                    .top-title 涝水
                    img(src='@/assets/images/waterControlCab/down.png')
                .other-one
                    .top-title 供水
                    img(src='@/assets/images/waterControlCab/down.png')
                .other-one
                    .top-title 节水
                    img(src='@/assets/images/waterControlCab/down.png')
</template>

<script lang="ts" setup name="early-warning-statistics">
import dayjs from 'dayjs'
import { filter } from 'lodash-es'
import { useRouter } from 'vue-router'
import type { WarningListApiTs, WarningListItem } from '../types'
import { getAssetsFile } from '@/utils/tools'
import service from '@/service/api'
const emit = defineEmits([
    'changeType'
])
const router = useRouter()
const data = reactive({
    activeIndex: 2,
    dateList: [
        {
            type: 'today',
            text: '今天',
            startTime: dayjs()
                .startOf('day')
                .valueOf()
        },
        {
            type: 'month',
            text: '过去一月',
            startTime: dayjs()
                .subtract(1, 'month')
                .startOf('day')
                .valueOf()
        },
        {
            type: 'year',
            text: '当年',
            startTime: dayjs()
                .startOf('year')
                .valueOf()
        },
        {
            type: 'auto',
            text: '自定义',
            startTime: ''
        }
    ],
    warningList: [] as WarningListItem[],
    totalAll: {
        disposedCount: 0,
        totalCount: 0,
        disposalRate: ''
    },
    autoDate: [] as any,
    disabledDate: (time: Date) => {
        return time.getTime() > Date.now()
    },
    typeList: [],
    startTime: '' as strNum,
    endTime: '' as strNum,
    selectedIdx: -1,
    showPanel: true
})
// 获取预警数量
const getMonitorData = async () => {
    data.totalAll = {
        disposedCount: 0,
        totalCount: 0,
        disposalRate: ''
    }
    const { data: list } = await service<WarningListApiTs, true>('common/monitorWarnData', {
        startTime: data.startTime,
        endTime: data.endTime,
        envTypeCodeList: ['water'],
        regionCodeList: ['330110000000']
    })
    list.forEach((item) => {
        data.totalAll.disposedCount += item.disposedCount
        data.totalAll.totalCount += item.totalCount
        item.disposalRate = (Number(item.disposalRate) * 100).toFixed(2)
    })
    data.totalAll.disposalRate = data.totalAll.totalCount === 0 ? '--' : ((data.totalAll.disposedCount / data.totalAll.totalCount) * 100).toFixed(2)
    // 过滤掉脏数据
    data.warningList = filter(list, (o: WarningListItem) => {
        return o.siteTypeName != null
    })
}
onMounted(() => {
    //
    data.startTime = data.dateList[data.activeIndex].startTime
    data.endTime = dayjs()
        .endOf('day')
        .valueOf()
    getMonitorData()
})
const changeDate = (index: number) => {
    data.selectedIdx = -1
    data.activeIndex = index
    data.startTime = data.dateList[data.activeIndex].startTime
    data.endTime = dayjs()
        .endOf('day')
        .valueOf()
    if (index !== 3) {
        getMonitorData()
        emit('changeType', {
            startTime: data.startTime,
            endTime: data.endTime,
            type: ''
        })
    }
}
const selectedItem = (item: WarningListItem, index: number) => {
    data.selectedIdx = index
    emit('changeType', {
        startTime: data.startTime,
        endTime: data.endTime,
        type: item.siteTypeCode
    })
}
const toggleList = () => {
    data.showPanel = !data.showPanel
}
const goPage = () => {
    router.push('/closedLoop/ClosedLoopManagement')
}
watch(() => data.autoDate, (val) => {
    data.selectedIdx = -1
    data.startTime = dayjs(val[0])
        .startOf('day')
        .valueOf()
    data.endTime = dayjs(val[1])
        .endOf('day')
        .valueOf()
    getMonitorData()
    emit('changeType', {
        startTime: data.startTime,
        endTime: data.endTime,
        type: ''
    })
})
const { dateList, activeIndex, warningList, totalAll, autoDate, disabledDate, selectedIdx, showPanel } = toRefs(data)
</script>

<style lang="scss" scoped>
:deep(.el-date-editor .el-range__icon) {
    display: none;
}

:deep(.el-date-editor .el-range__close-icon) {
    display: none;
}

:deep(.el-date-editor .el-range-input) {
    width: 45%;
    font-family: TRENDS;
    font-size: 12px;
    color: #fff;
}

:deep(.el-input__wrapper) {
    width: 240px;
    padding: 0;
    background-color: #002950;
    border: 1px solid #194269;
    box-shadow: none;
}

:deep(.el-date-editor .el-range-separator) {
    color: #60a2e1;
}

.early-warning {
    position: absolute;
    bottom: 32px;
    left: 459px;
    z-index: 20;
    width: 288px;
    height: 436px;

    .warning-bg {
        position: absolute;
        width: 100%;
        height: 436px;
        border-top: 30px solid;
        border-right: 70px solid;
        border-bottom: 30px solid;
        border-left: 70px solid;
        border-image-source: url(@/assets/images/panel/panel-1.png);
        border-image-slice: 30 70 30 70 fill;
    }

    .auto-select {
        padding-left: 20px;
        margin-bottom: 8px;
    }

    .warning-content {
        position: absolute;
        width: 100%;

        .text-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: calc(100% - 16px);
            height: 40px;
            padding: 0 16px;
            margin-left: 8px;
            border-bottom: 1px solid rgba(7, 131, 250, 0.5);

            .left {
                display: flex;

                .text {
                    margin-right: 8px;
                    font-family: TRENDS;
                    font-size: 16px;
                }

                .detail {
                    width: 44px;
                    height: 20px;
                    font-family: TRENDS;
                    font-size: 14px;
                    line-height: 20px;
                    text-align: center;
                    cursor: pointer;
                    background: #001823;
                    border: 1px solid #00547b;
                    border-radius: 2px;
                }
            }

            img {
                width: 20px;
                height: 20px;
                cursor: pointer;
            }
        }

        .date-list {
            display: flex;
            align-content: center;
            justify-content: center;
            padding: 8px 0;

            .one {
                box-sizing: border-box;
                padding: 6px 8px;
                margin-right: 4px;
                font-family: TRENDS;
                font-size: 12px;
                cursor: pointer;
                background: #001823;
                border: 1px solid #00547b;
                border-radius: 2px;
            }

            .active {
                color: #0df;
                background: rgba(0, 0, 0, 0.2);
                border: 1px solid #0df;
                box-shadow: inset 0 0 8px 0 rgba(0, 238, 255, 0.5);
            }
        }

        .warning-list {
            width: calc(100% - 16px);
            margin-left: 8px;

            .list-one {
                .top-title {
                    display: flex;
                    align-items: center;
                    height: 40px;
                    font-family: TRENDS;
                    font-size: 12px;
                    color: #60a2e1;
                    background: rgba(96, 162, 225, 0.1);

                    .th {
                        width: 33.3%;
                        text-align: center;
                    }
                }

                .tb-content {
                    .one {
                        display: flex;
                        align-items: center;
                        height: 32px;
                        cursor: pointer;

                        .td {
                            width: 33.3%;
                            font-family: Furore;
                            font-size: 14px;
                            text-align: center;
                        }

                        .td:nth-child(1) {
                            font-family: TRENDS;
                            font-size: 14px;
                        }

                        .td:nth-child(2) {
                            .doNum {
                                color: #36f097;
                            }

                            .split {
                                color: rgba(255, 255, 255, 0.5);
                            }

                            .total {
                                color: #fff;
                            }
                        }
                    }

                    .active {
                        background-color: #008dce;
                        border: 1px solid #00e5ff;
                        border-radius: 4px;
                    }
                }
            }

            .other-one {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                height: 32px;
                padding: 0 8px 0 36px;
                font-family: TRENDS;
                font-size: 14px;
                color: #60a2e1;
                background: rgba(96, 162, 225, 0.05);
                border-bottom: 1px solid rgba(7, 131, 250, 0.3);

                img {
                    width: 16px;
                    height: 16px;
                }
            }
        }
    }
}
</style>
