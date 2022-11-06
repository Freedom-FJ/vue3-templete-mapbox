<!--
 * @Author: mjh
 * @Date: 2022-09-06 10:32:34
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-11 16:17:06
 * @Description:
-->
<template lang="pug">
div
    popup-panel(:title="properties.name"  :height='330' :width="736" :titleHeight="32" :isMapPop="true")
        .common-pop-container
            .top-pop-line
                .waring-num
                    span.label.text-14 最近产生预警次数：
                    span.label.num-16.red(style="vertical-align: top;") {{countObj.count}}
                .waring-address
                    span.label.text-14 所在区域：
                    span.label.text-14 {{ siteInfo.gridName || '余杭区' }}
                .right-count
                    .count-tips
                        .tips-label 绿色预警
                        .tips-num {{countObj.green}}
                    .count-tips
                        .tips-label 黄色预警
                        .tips-num {{countObj.yellow}}
                    .count-tips
                        .tips-label 橙色预警
                        .tips-num {{countObj.orange}}
                    .count-tips
                        .tips-label 红色预警
                        .tips-num {{countObj.red}}
            .table-box
                popup-table(:option="option" ref="popupTableDom"  :data="tableData" :height="170" :lineStyle="{ height: '32px'}"  :heightLineStyle="{ height: '28px'}" )
                el-pagination( layout="prev, pager, next" :total="pageTotal" :page-size="5" @current-change="currentChange" style="margin: -5px auto;width: fit-content;")
    WarningCheckPop( v-model="checkDetailData" v-if="checkDetailData")
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import dayjs from 'dayjs'
import type { alarmFactorTs, alarmLevelAllTs, alarmListDataTs, alarmListTs } from './types'
import { useAnalysisStore } from '@/store/analysis'
import type { disposalTs, popTableOptionAllTs, popTableOptionTs, queryAlarmTs, selectPanelTs } from '@/types/common'
import type { waterQualityPointTs } from '@/types/waterQuality'
import service from '@/service/api'
const props = defineProps({
    properties: {
        type: Object as PropType<waterQualityPointTs>,
        default: () => {
            return {}
        }
    },
})
const analysis = useAnalysisStore()

const data = reactive({
    defaultYear: dayjs().format('YYYY'),
    countObj: {
        green: 0,
        yellow: 0,
        orange: 0,
        red: 0,
        count: 0
    },
    pageTotal: 0,
    siteInfo: {
        siteTypeName: '',
        gridName: '',
        siteName: ''
    },
    parentName: '',
    alarmTypeCodes: '',
    alarmLevelAll: [] as alarmLevelAllTs[], // 报警级别列表
    currAlarmLevelCode: '', // 当前报警级别
    disposalStatusList: [] as disposalTs[], // 全部处置
    currFactorCodes: '', // 当前选择因子
    currDisposalStatus: '', // 当前处置类型
    tableData: [] as alarmListDataTs[],
    currPage: 1,
    params: {
        startTime: 1662566400000,
        endTime: 1663171199999,
        isAccessPermission: false,
        envTypeCodeList: [
            'water'
        ],
        siteCodeList: [
            props.properties.siteCode
        ],
    },
    alarmTypeCodeList: [] as string[], // 报警类型列表
    waterQuality: '',
    sectionType: '',
    checkDetailData: null as null | record,
    option: [
        {
            label: '报警时间',
            key: 'dataTimeStr',
        },
        {
            label: '报警类型',
            key: 'alarmTypeName',
            type: 'select',
            list: [
                { label: '报警类型', value: '', selectLabel: '全 部' },
                { label: '周报警', value: '周报警' },
                { label: '月报警', value: '月报警' },
                { label: '年报警', value: '年报警' }
            ],
            defaultSelect: 0,
            click: (item: record, optionItem: popTableOptionAllTs) => {
                //
            }
        },
        {
            label: '报警级别',
            key: 'alarmLevelName',
            type: 'select',
            list: [
                { label: '报警级别', value: '', selectLabel: '全部' },
                { label: '周报警', value: '周报警' },
                { label: '月报警', value: '月报警' },
                { label: '年报警', value: '年报警' }
            ],
            defaultSelect: 0,
            renderStyle: (item: record, option: popTableOptionTs) => {
                return {
                    color: 'white'
                }
            },
            click: (item: record, optionItem: popTableOptionAllTs) => {
                //
            }
        },
        {
            label: '因子',
            key: 'factorName',
            type: 'select',
            list: [
                { label: '因子', value: '', selectLabel: '全部' },
                { label: '氧气', value: '氧气' },
                { label: '氮气', value: '氮气' },
                { label: '臭氧', value: '臭氧' }
            ],
            defaultSelect: 0,
            click: (item: record, optionItem: popTableOptionAllTs) => {
                //
            }
        },
        {
            label: '浓度（mg/L）',
            key: 'factorValue',
        },
        {
            label: '处理状态',
            key: 'disposalStatus',
            renderStyle: (item: record, option: popTableOptionTs) => {
                return {
                    color: 'white' //  F7C706
                }
            },
            render: (val: record, optionItem: Partial<popTableOptionTs>) => {
                return val.disposalStatus === 0 ? '未处置' : val.disposalStatus === 1 ? '处置中' : '已处置'
            },
            type: 'select',
            list: [
                { label: '处理状态', value: '', selectLabel: '全部' },
                { label: '未处置', value: 0 },
                { label: '处置中', value: 1 },
                { label: '已处置', value: 2 }
            ],
            defaultSelect: 0,
            click: (item: record, optionItem: popTableOptionAllTs) => {
                //
            }
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
                        //
                    }
                },
                {
                    label: '查看',
                    click: (item: record) => {
                        data.checkDetailData = item
                    }
                }
            ]
        }
    ] as popTableOptionTs[]
})
onMounted(() => {
    getArmCount()
    getQueryAlarmTypeByRole()
    getEventInfoByEventIds()
    alarmLevelAll()
    getAllFator()
    getSurfaceWaterSection()
    getDisposalStatus()
    initTableOption()
})
console.log(props.properties, 'properties')
/**
 * @name: 获取表格顶部统计数据
 */
const getArmCount = async () => {
    const startTime = dayjs(data.defaultYear)
        .startOf('year')
        .valueOf()
    const endTime = dayjs(data.defaultYear)
        .endOf('year')
        .valueOf()
    const res = await service<{ totalNum: number; alarmLevelName: string }[]>('waterQuality/countByAlarmLevel', {
        ...data.params,
        startTime,
        endTime,
        disposalStatusList: data.currDisposalStatus ? [data.currDisposalStatus] : [],
        alarmTypeCodeList: data.alarmTypeCodeList
    })
    const resData = res.data || []
    data.countObj.count = 0
    resData.forEach((element) => {
        if (element.alarmLevelName === '黄色预警') data.countObj.yellow = element.totalNum
        if (element.alarmLevelName === '绿色预警') data.countObj.green = element.totalNum
        if (element.alarmLevelName === '橙色预警') data.countObj.orange = element.totalNum
        if (element.alarmLevelName === '红色预警') data.countObj.red = element.totalNum
        data.countObj.count += element.totalNum
    })
}
/**
 * @name: 初始化表格方法
 */
const initTableOption = () => {
    data.option[1].click = clickAlarmType
    data.option[2].click = clickAlarmLevelType
    data.option[2].renderStyle = alarmLevelRenderStyle
    data.option[3].click = clickFactor
    data.option[5].renderStyle = disposalStatusRenderStyle
    data.option[5].click = clickDisposalStatus
    data.option[6].toolList && (data.option[6].toolList[0].click = startAnalysis)
}
/**
 * @name: 获取waterQuality
 * @desc:
 * @return {*}
 */
const getSurfaceWaterSection = async () => {
    const params = {
        stationCode: 1,
        accessCode: props.properties.siteCode,
        configTime: dayjs().valueOf()
    }
    const res = await service<{ waterQuality: string; sectionType: string }[], true>('common/querySiteListByAccessCode', params)
    if (!res.length) return
    const { waterQuality, sectionType } = res[0]
    data.waterQuality = waterQuality
    data.sectionType = sectionType
}
/**
 * @name: 获取表格数据
 */
const getEventInfoByEventIds = async () => {
    const params = {
        envTypeCodeList: [
            'water'
        ],
        startHour: 0,
        endHour: 24,
        alarmTimeEnd: dayjs(data.defaultYear)
            .endOf('year')
            .valueOf(),
        alarmTimeStart: dayjs(data.defaultYear)
            .startOf('year')
            .valueOf(),
        isQueryDetail: true,
        alarmTypeCodeList: data.alarmTypeCodeList,
        alarmLevelCode: data.currAlarmLevelCode,
        disposalStatus: data.currDisposalStatus,
        factorCodes: data.currFactorCodes,
        limit: 5,
        siteCodeList: [props.properties.siteCode],
        page: data.currPage,
    }
    const res = await service<alarmListTs, true>('waterQuality/queryPage', params)
    data.tableData = []
    data.pageTotal = res.totalCount
    if (!res.data || (res.data && !res.data.length)) return
    const resData = res.data || []
    resData.forEach((item) => {
        if (!(item.dataTimeStr.includes('周') || item.dataTimeStr.includes('月') || item.dataTimeStr.includes('季')))
            item.dataTimeStr = dayjs(item.dataTimeStr).format('YYYY-MM-DD HH')
        const factorName: string[] = []
        const factorValue: string[] = []
        const factorUnit: string[] = []
        const factorCode: string[] = []
        item.detailList.forEach((factor) => {
            factorName.push(factor.factorName)
            factorValue.push(factor.factorValue)
            factorUnit.push(factor.factorUnit)
            factorCode.push(factor.factorCode)
        })
        item.factorName = factorName.join(',')
        item.factorValue = factorValue.join(',')
        item.factorUnit = factorUnit.join(',')
        item.factorCode = factorCode.join(',')
    })
    data.tableData = resData
}

const startAnalysis = (item: record) => {
    const { timeList, timeType, alarmTimeValue } = formatDate(item.alarmTypeName, item.dataTimeStr)
    analysis.startAnalysis({
        type: 'AnalysisWaterQuality',
        distance: 10000,
        dateTime: timeList,
        data: {
            alarmTypeName: item.alarmTypeName,
            alarmTypeCode: item.alarmTypeCode,
            dataTimeStr: item.dataTimeStr,
            dataTime: item.dataTime, // 报警时间
            siteName: item.siteName,
            siteCode: item.siteCode,
            factorName: item.factorName,
            factorUnit: item.factorUnit,
            factorCode: item.factorCode,
            factorValue: item.factorValue,
            latitude: item.latitude,
            longitude: item.longitude,
            timeType,
            alarmTimeValue,
            pointData: '',
            overflowPortNum: '',
            accessCodeList: '',
            waterQuality: data.waterQuality,
            sectionType: data.sectionType,
            // 详情所需数据：
            address: item.address,
            alarmTimeStr: item.alarmTimeStr,
            detailList: item.detailList,
            alarmLevelColor: item.alarmLevelColor,
            alarmLevelName: item.alarmLevelName,
            id: item.id,
            envTypeCode: item.envTypeCode
        }
    })
    window.glPopup && window.glPopup.remove()
}
/**
 * 格式化时间
 * alarmType 报警类型（小时超标预警，日均值超标预警，周均值超标预警，月均值超标预警）
 * alarmTime 报警时间为时间戳
 */
const formatDate = (alarmType: string, dataTime: string) => {
    let timeType = ''
    let timeList: number[] = []
    if (alarmType === '小时超标预警') {
        timeType = 'hour'
        timeList = [
            dayjs(dataTime)
                .subtract(12, 'hour')
                .startOf('hour')
                .valueOf(),
            dayjs(dataTime)
                .subtract(0, 'hour')
                .startOf('hour')
                .valueOf()
        ]
    }
    else if (alarmType === '日均值超标预警') {
        timeType = 'day'
        timeList = [
            dayjs(dataTime)
                .subtract(6, 'day')
                .startOf('day')
                .valueOf(),
            dayjs(dataTime)
                .endOf('day')
                .valueOf()
        ]
    }
    else if (alarmType === '周均值超标预警') {
        timeType = 'week'

        const [year, week] = dataTime.split('-')
        const endWeek = dayjs(year).startOf('year')
            .add(parseInt(week), 'week')
            .endOf('week')
            .valueOf()
        timeList = [
            dayjs(endWeek)
                .subtract(3, 'week')
                .startOf('week')
                .valueOf(),
            endWeek
        ]
    }
    else if (alarmType === '月均值超标预警' || alarmType === '手工月均值超标预警') {
        timeType = 'month'
        const [year, month] = dataTime.split('-')
        const endWeek = dayjs(year)
            .add(parseInt(month), 'month')
            .endOf('month').valueOf()
        timeList = [
            dayjs(endWeek).subtract(5, 'month')
                .startOf('month').valueOf(),
            endWeek
        ]
    }
    const alarmTimeValue = timeList.length ? timeList[1] : 0
    return { timeList, timeType, alarmTimeValue }
}
/**
 * @name: 预警类型点击事件
 */
const clickAlarmType = (item: record, optionItem: popTableOptionAllTs) => {
    if (!item.value) data.alarmTypeCodeList = []
    else data.alarmTypeCodeList = [item.value]
    getArmCount()
    getEventInfoByEventIds()
}
/**
 * @name: 预警级别点击事件
 */
const clickAlarmLevelType = (item: record, optionItem: popTableOptionAllTs) => {
    data.currAlarmLevelCode = item.value
    // getArmCount()
    getEventInfoByEventIds()
}

/**
 * @name: 因子筛选点击事件
 */
const clickFactor = (item: record, optionItem: popTableOptionAllTs) => {
    data.currFactorCodes = item.value
    getEventInfoByEventIds()
}
/**
 * @name: 处置类型筛选点击事件
 */
const clickDisposalStatus = (item: record, optionItem: popTableOptionAllTs) => {
    data.currDisposalStatus = item.value
    getArmCount()
    getEventInfoByEventIds()
}
/**
 * @name: 获取报价类型筛选数据
 */
const getQueryAlarmTypeByRole = async () => {
    const res = await service<queryAlarmTs[]>('common/queryAlarmTypeByRole', {
        envTypeCodeList: ['water'],
        isQueryRole: false
    })
    const resData = res.data || []
    const list: selectPanelTs[] = resData.map((item) => {
        return {
            label: item.name,
            value: item.code,
        }
    })
    list.unshift({ label: '报警类型', value: '', selectLabel: '全 部' },)
    data.option[1].list = list
}

/**
 * @name: 处置类型renderstyle
 * @param {*} item 当前列
 * @param {*} option 配置项
 */
const disposalStatusRenderStyle = (item: record, option: popTableOptionTs) => {
    const currData = item[option.key || '']
    const currType = data.disposalStatusList.filter(item => item.disposalStatusCode === currData)
    if (!currType.length) {
        return {
            color: 'rgba(255, 255, 255, 1)'
        }
    }
    return {
        color: currType[0].disposalStatusColor
    }
}
/**
 * @name: 报警级别renderstyle
 * @param {*} item 当前列
 * @param {*} option 配置项
 */
const alarmLevelRenderStyle = (item: record, option: popTableOptionTs) => {
    const currData = item[option.key || '']
    const currType = data.alarmLevelAll.filter(item => item.alarmLevelName === currData)
    if (!currType.length) {
        return {
            color: 'rgba(255, 255, 255, 0.6)'
        }
    }
    return {
        color: currType[0].alarmLevelColor
    }
}
/**
 * @name: 获取报警级别筛选数据
 */
const alarmLevelAll = async () => {
    const res = await service<alarmLevelAllTs[]>('common/alarmLevelAll', {
        envTypeCodeList: ['water'],
        isQueryRole: false
    })
    const resData = res.data || []
    data.alarmLevelAll = resData
    const list: selectPanelTs[] = resData.map((item) => {
        return {
            label: item.alarmLevelName,
            value: item.alarmLevelCode,
        }
    })
    list.unshift({ label: '报警级别', value: '', selectLabel: '全 部' },)
    data.option[2].list = list
}
/**
 * @name: 获取因子筛选数据
 */
const getAllFator = async () => {
    const res = await service<alarmFactorTs[]>('common/queryFactorCodeListByAlarmType', {
        envTypeCodeList: ['water'],
        alarmTypeCodeList: ['automonitor_over']
    })
    const resData = res.data || []
    const list: selectPanelTs[] = resData.map((item) => {
        return {
            label: item.name,
            value: item.code,
        }
    })
    list.unshift({ label: '因子', value: '', selectLabel: '全 部' },)
    data.option[3].list = list
}

/**
 * @name: 获取处置列表
 */
const getDisposalStatus = async () => {
    const res = await service<disposalTs[]>('common/getDisposalStatus', {
        envTypeCodeList: ['water'],
        alarmTypeCodeList: ['automonitor_over']
    })
    const resData = res.data || []
    data.disposalStatusList = resData
    const list: selectPanelTs[] = resData.map((item) => {
        return {
            label: item.disposalStatusName,
            value: item.disposalStatusCode,
        }
    })
    list.unshift({ label: '处置状态', value: '', selectLabel: '全 部' })
    data.option[5].list = list
}
/**
 * @name: 页码切换
 */
const currentChange = (page: number) => {
    data.currPage = page
    getEventInfoByEventIds()
}
const { tableData, option, countObj, siteInfo, pageTotal, checkDetailData } = toRefs(data)
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
                justify-content: space-between;
                height: 28px;
                padding: 0 8px;
                margin-right: 4px;
                /* stylelint-disable-next-line color-function-notation */
                background: rgb(54 240 151 / 0.2);
                border: 1px solid #36f097;
                border-radius: 4px;

                .tips-label {
                    font-family: TRENDS;
                    font-size: 12px;
                    font-weight: normal;
                    color: #36f097;
                }

                .tips-num {
                    font-family: Furore;
                    font-size: 14px;
                    font-weight: normal;
                    color: #36f097;
                }
            }

            .count-tips:nth-child(2) {
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 28px;
                padding: 0 8px;
                margin-right: 4px;
                /* stylelint-disable-next-line color-function-notation */
                background: rgb(237 225 0 / 0.2);
                border: 1px solid #f7c706;
                border-radius: 4px;

                .tips-label {
                    font-family: TRENDS;
                    font-size: 12px;
                    font-weight: normal;
                    color: #f7c706;
                }

                .tips-num {
                    font-family: Furore;
                    font-size: 14px;
                    font-weight: normal;
                    color: #f7c706;
                }
            }

            .count-tips:nth-child(3) {
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 28px;
                padding: 0 8px;
                margin-right: 4px;
                /* stylelint-disable-next-line color-function-notation */
                background: rgb(237 107 0 / 0.2);
                border: 1px solid #ed6b00;
                border-radius: 4px;

                .tips-label {
                    font-family: TRENDS;
                    font-size: 12px;
                    font-weight: normal;
                    color: #ff8000;
                }

                .tips-num {
                    font-family: Furore;
                    font-size: 14px;
                    font-weight: normal;
                    color: #ff8000;
                }
            }

            .count-tips:nth-child(4) {
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 28px;
                padding: 0 8px;
                margin-right: 4px;
                background: rgba(248, 68, 57, 0.2);
                border: 1px solid #f84439;
                border-radius: 4px;

                .tips-label {
                    font-family: TRENDS;
                    font-size: 12px;
                    font-weight: normal;
                    color: #f84439;
                }

                .tips-num {
                    font-family: Furore;
                    font-size: 14px;
                    font-weight: normal;
                    color: #f84439;
                }
            }
        }
    }

    .table-box {
        margin: 0 16px;
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
            border: 0 !important;
        }

        .is-active {
            color: #409eff;
            border: 0;
        }
    }
}
</style>
