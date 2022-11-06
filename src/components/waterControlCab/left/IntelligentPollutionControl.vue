<!--
 * @Author: mjh
 * @Date: 2022-08-29 14:17:56
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-11 21:03:11
 * @Description:
-->
<template lang="pug">
.container
    .rate-box
        .left-box
            .abso-pie
            #completeBox(ref="completeRateDom")
        .right-box.pdt12
            .river-num.flex-bw-c.mgb12
                    .label-line.flex-c
                        img.mgr4(src="@/assets/images/waterControlCab/river-num.png")
                        span 河流总数(镇街级以上)
                    .num-title.num-16 213
            .complete-num.flex-bw-c.mgb12
                    .label-line.flex-c
                        img.mgr4(src="@/assets/images/waterControlCab/completeRate.png")
                        span 已监测河道数
                    .num-title.num-16 {{rateObj.validSiteNum}}
            .back-line
                img(src="@/assets/images/waterControlCab/done.png")
                .label-span  达标率状况
                .rate-num(style="color: #0AFDA5;") {{rateObj.reachRate}}%
                .total-num /{{rateObj.validSiteNum}}
                .arrow-green
            .back-line
                img(src="@/assets/images/waterControlCab/un-done.png")
                .label-span 不达标率状况
                .rate-num(style="color:#F84439;") {{rateObj.unReachRate}}%
                .total-num /{{rateObj.validSiteNum}}
                .arrow-red
    .river-level
        .river-box.mgb16(:class="[popStore.getCurrentPop === 'BadVRiverPopup' && popStore.getPopData.level === '1' ? 'panel-checked' : '']" @click="checkLevelPop('1')")
            .border
            img.left-icon(src="@/assets/images/waterControlCab/bad-1-icon.png")
            .right-value
                .top-title I类河道
                .value-num {{countLevel[1]}}
        .river-box.mgb16(:class="[popStore.getCurrentPop === 'BadVRiverPopup' && popStore.getPopData.level === '2' ? 'panel-checked' : '']" @click="checkLevelPop('2')")
            .border
            img.left-icon(src="@/assets/images/waterControlCab/bad-2-icon.png")
            .right-value
                .top-title II类河道
                .value-num {{countLevel[2]}}
        .river-box.mgb16(:class="[popStore.getCurrentPop === 'BadVRiverPopup' && popStore.getPopData.level === '3' ? 'panel-checked' : '']" @click="checkLevelPop('3')")
            .border
            img.left-icon(src="@/assets/images/waterControlCab/bad-3-icon.png")
            .right-value
                .top-title III类河道
                .value-num {{countLevel[3]}}
        .river-box.mgb16(:class="[popStore.getCurrentPop === 'BadVRiverPopup' && popStore.getPopData.level === '4' ? 'panel-checked' : '']" @click="checkLevelPop('4')")
            .border
            img.left-icon(src="@/assets/images/waterControlCab/bad-4-icon.png")
            .right-value
                .top-title IV类河道
                .value-num {{countLevel[4]}}
        .river-box(:class="[popStore.getCurrentPop === 'BadVRiverPopup' && popStore.getPopData.level === '5' ? 'panel-checked' : '']" @click="checkLevelPop('5')")
            .border
            img.left-icon(src="@/assets/images/waterControlCab/v-icon.png")
            .right-value
                .top-title V类河道
                .value-num {{countLevel[5]}}
        .river-box(:class="[popStore.getCurrentPop === 'BadVRiverPopup' && popStore.getPopData.level === '6' ? 'panel-checked' : '']" @click="checkLevelPop('6')")
            .border(v-show="popStore.getCurrentPop !== 'BadVRiverPopup'")
            img.left-icon(src="@/assets/images/waterControlCab/bad-v-icon.png")
            .right-value
                .top-title 劣V类河道
                .value-num {{countLevel[6]}}
    .table-box.mgb24
        .table-header
            .title-box( style="flex: 2;text-align: left;") 类型
            .title-box( style="flex: 1;") 未达标
            .title-box( style="flex: 1;")  达标
            .title-box( style="flex: 1;")  达标率
        .value-line(v-for="item in levelData" :key="item.label")
            .labe-line.mgb4
                .value-title( style="flex: 2;") {{ item.label }}
                .value-no-stand( style="flex: 1;") {{ item.noStand }}
                .value-stand( style="flex: 1;") {{ item.stand }}
                .value-rate( style="flex: 1;") {{ item.rate }}
            .bar-box
                .no-stand-bar(:style="{ width: 100 - parseInt(item.rate) + '%' }")
                .bar-head
                .stand-bar(:style="{ width: `calc(${item.rate} - 2px)` }")
    .top-title.mgb8
        span.title.text-16 水质预警
        span.unit-14 （2022）
    .quality-warning
        .warning-one(v-for='item, index in dataList' :key='index' :class="[popStore.getCurrentPop === 'waterQualityPop' && !index ? 'panel-checked' : '']" @click="checkPop(index)")
            .top {{item.name}}
            .circle-content
                .circle-inner
                .circle-pos
                .text {{item.rate}}%
            .bottom
                span {{item.warn}}
                span /{{item.total}}
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import type { countSiteTypeAndRateApiTs, situationApiTs } from '../types'
import { globalKey } from '@/symbols'
import { usePopStore } from '@/store/popControl'
import { getFactorGroupList } from '@/utils/commonMethods/factor'
import { getSetTreeCode } from '@/utils/treeDataUtils'
import service from '@/service/api'
const popStore = usePopStore()
const global = inject(globalKey)

const data = reactive({
    completeRateDom: ref(),
    countLevel: {} as record,
    levelData: [
        { label: '国控', noStand: 5, stand: 15, rate: '75%' },
        { label: '省控', noStand: 5, stand: 5, rate: '50%' },
        { label: '市控', noStand: 20, stand: 10, rate: '66%' },
        { label: '区县控', noStand: 20, stand: 10, rate: '66%' },
    ],
    rateObj: {
        total: 0,
        reach: 0,
        validSiteNum: 0,
        reachRate: 0,
        unReachRate: 0
    },
    dataList: [
        { name: '水环境质量', rate: 0, total: 0, warn: 0 },
        { name: '饮用水源地', rate: 75, total: 20, warn: 12 },
        { name: '污水零直排', rate: 75, total: 20, warn: 12 },
    ]
})

onMounted(() => {
    getControlLevelCount()
    goalAttainment()
    getDataCount()
})
const getDataCount = async () => {
    const treeData = await getSetTreeCode()

    const params = {
        regionCodeList: [treeData],
        startTime: dayjs().startOf('year').valueOf(),
        endTime: dayjs().add(1, 'years').startOf('year').valueOf(),
        envTypeCodeList: [
            'water'
        ]
    }
    const res = await service<countSiteTypeAndRateApiTs[]>('waterControlCab/countSiteTypeAndRate', params)
    const resData = res.data || []
    let totalCount = 0
    let totalDis = 0
    resData.forEach((item) => {
        totalDis += item.disposedCount
        totalCount += item.totalCount
    })
    data.dataList[0].total = totalCount
    data.dataList[0].warn = totalDis
    data.dataList[0].rate = Math.round((totalDis / totalCount) * 100)
}
const checkPop = (index: number) => {
    if (!index && popStore.getCurrentPop !== 'waterQualityPop') popStore.upDatePopup({ currentPop: 'waterQualityPop' })
    else popStore.initPop()
}
/**
 * @name: 渲染整体达标情况
 */
const goalAttainment = async () => {
    const treeData = await getSetTreeCode()
    const factorObj = await getFactorGroupList('surfaceSection')
    const params = {
        treeType: 1,
        treeId: treeData.slice(0, 6),
        factorGroupId: factorObj?.id ?? '',
        factorFlag: true,
        factor: factorObj?.id ?? '',
        beginTime: dayjs().startOf('year').valueOf(),
        endTime: dayjs().add(1, 'years').startOf('year').valueOf(),
        dataTimeType: 1440,
        queryTimeType: 'year',
        parentId: 3301,
        controlLevel: '004',
        calculateFlag: -1
    }
    const res = await service<situationApiTs, true>('waterControlCab/situation', params)
    if (!res) return
    data.countLevel = res.levelNumMap
    const percent = Math.round(res.reachStandard / res.validSiteNum * 1000) / 10
    data.rateObj.reachRate = percent
    data.rateObj.unReachRate = Math.round((100 - percent) * 10) / 10
    data.rateObj.total = res.total
    data.rateObj.validSiteNum = res.validSiteNum
    const chartData = [percent, data.rateObj.unReachRate]
    const chartance = global?.echarts.init(data.completeRateDom)
    chartance.setOption(getChartOption(chartData))
}
/**
 * @name: 渲染控制级别达标情况
 */
const getControlLevelCount = async () => {
    const levelList = ['001', '002', '003', '004']
    const treeData = await getSetTreeCode()
    const factorObj = await getFactorGroupList('surfaceSection')
    const resList = await Promise.all(levelList.map(async (item) => {
        const params = {
            treeType: 1,
            treeId: treeData.slice(0, 6),
            factorGroupId: factorObj?.id ?? '',
            beginTime: 1640966400000,
            endTime: 1672502400000,
            dataTimeType: 1440,
            queryTimeType: 'year',
            controlLevel: item
        }
        const res = await service<situationApiTs, true>('waterControlCab/situation', params)
        return res
    }))
    resList.forEach((item, index) => {
        data.levelData[index].stand = item.reachStandard
        data.levelData[index].noStand = item.validSiteNum - item.reachStandard
        data.levelData[index].rate = `${((item.reachStandard / item.validSiteNum) * 100).toFixed(1)}%`
    })
}

const checkLevelPop = (level: string) => {
    if (popStore.currentPop === 'BadVRiverPopup' && popStore.popData.level === level) {
        popStore.initPop()
        return
    }
    popStore.upDatePopup({
        currentPop: 'BadVRiverPopup',
        popData: {
            level
        }
    })
}
const getChartOption = (chartData: number[]) => {
    const chartOption = {
        grid: {
            top: 0,
            left: '1%',
            bottom: '1%',
            right: '1%'
        },
        color: ['rgba(10, 253, 165, 1)', 'rgba(248, 68, 57, 1)'],
        graphic: [ // 设置饼图中间文字内容
            {
                type: 'text',
                left: 'center',
                top: '31%',
                style: {
                    text: '达标率',
                    textAlign: 'center',
                    fill: '#ffffff',
                    fontSize: 12,
                    fontFamily: 'TRENDS'
                }
            },
            {
                type: 'text',
                left: 'center',
                top: '51%',
                style: {
                    text: `${Math.round(chartData[0])}%`,
                    textAlign: 'center',
                    fill: 'rgba(255,255,255,1)',
                    fontSize: 16,
                    fontFamily: 'Furore'

                }
            }
        ],
        series: [
            {
                name: '企业档案',
                type: 'pie',
                // center: ['16%', '50%'],
                roseType: 'radius',
                radius: ['80%', '98%'],
                avoidLabelOverlap: true,
                hoverAnimation: false,
                data: chartData,
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        },

                    },
                }
            }
        ]
    }
    return chartOption
}
const { completeRateDom, levelData, countLevel, rateObj, dataList } = toRefs(data)
</script>

<style lang="scss" scoped>
/* stylelint-disable color-function-notation */

.container {
    width: 100%;
    height: 100%;
    padding: 26px 10px 0;

    .rate-box {
        display: flex;
        width: 100%;
        height: 120px;
        margin-bottom: 30px;

        .left-box {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 120px;
            height: 120px;
            margin-right: 20px;

            .abso-pie {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 120px;
                height: 120px;
                border: 1px solid rgb(255 255 255 / 0.4);
                border-radius: 50%;
                transform: translate(-50%, -50%);

                // box-shadow: 0 0 10px 6px rgba(10, 253, 165, 0.4);
            }

            #completeBox {
                width: 100px;
                height: 100px;
                border-radius: 50%;
                box-shadow: 0 0 10px 3px rgb(10 253 165 / 0.4);

                // border: 1px solid red;
            }
        }

        .right-box {
            width: calc(100% - 120px);
            border-top: 1px solid #004576;

            .top-line {
                display: flex;
                padding: 11px 0;

                .river-num {
                    border-right: 1px solid #004576;
                }

                & > div {
                    width: 50%;
                    padding-left: 13px;

                    .num-title {
                        width: fit-content;
                        margin-bottom: 8px;
                        font-family: Furore;
                        font-size: 20px;
                        font-weight: normal;
                        line-height: 20px;
                        color: #fff;
                    }

                    .label-line {
                        img {
                            width: 13.33px;
                            height: 13.33px;
                            margin-right: 4px;
                        }

                        span {
                            font-family: TRENDS;
                            font-size: 12px;
                            font-weight: normal;
                            line-height: 12px;
                            color: #fff;
                        }
                    }
                }
            }

            .back-line {
                display: flex;
                align-items: center;
                width: 100%;
                height: 22px;
                padding: 2px 8px;
                margin-bottom: 6px;
                background: rgb(255 255 255 / 0.1);

                img {
                    width: 10px;
                    height: 10px;
                    margin-right: 8px;
                }

                .label-span {
                    width: 110px;
                    font-family: TRENDS;
                    font-size: 10px;
                    font-weight: normal;
                    color: #fff;
                }

                .rate-num {
                    font-family: Furore;
                    font-size: 10px;
                    font-weight: normal;
                    color: #fff;
                }

                .total-num {
                    margin-right: 4px;
                    font-family: Furore;
                    font-size: 10px;
                    font-weight: normal;
                    color: #fff;
                }

                .arrow-green {
                    width: 0;
                    height: 0;
                    border-top: 0 solid transparent;
                    border-right: 4px solid transparent;
                    border-bottom: 4px solid #0afda5;
                    border-left: 4px solid transparent;
                }

                .arrow-red {
                    width: 0;
                    height: 0;
                    border-top: 4px solid red;
                    border-right: 4px solid transparent;
                    border-bottom: 0 solid transparent;
                    border-left: 4px solid transparent;
                }
            }
        }
    }

    .river-level {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        width: 100%;
        margin-top: 16px;
        margin-bottom: 10px;
        cursor: pointer;

        .river-box:nth-child(1) {
            background-color: #003261;
            border-top: 1px solid #03a9f4;
            border-bottom: 1px solid #03a9f4;

            .value-num {
                font-family: Furore;
                font-size: 24px;
                font-weight: normal;
                line-height: 24px;
                color: transparent;
                letter-spacing: 0;
                background: linear-gradient(to bottom, rgb(255 255 255 / 1), rgba(3, 169, 244, 1));
                -webkit-background-clip: text;
                background-clip: text;
            }

            &::before {
                position: absolute;
                top: 0;
                left: 0;
                width: 1px;
                height: 10px;
                content: "";
                background: linear-gradient(180deg, #03a9f4 0%, rgb(0 0 0 / 0) 100%);
            }

            &::after {
                position: absolute;
                top: 0;
                right: 0;
                width: 1px;
                height: 10px;
                content: "";
                background: linear-gradient(180deg, #03a9f4 0%, rgb(0 0 0 / 0) 100%);
            }

            .border::after {
                position: absolute;
                right: 0;
                bottom: 0;
                width: 1px;
                height: 10px;
                content: "";
                background: linear-gradient(0deg, #03a9f4 0%, rgb(0 0 0 / 0) 100%);
            }

            .border::before {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 1px;
                height: 10px;
                content: "";
                background: linear-gradient(0deg, #03a9f4 0%, rgb(0 0 0 / 0) 100%);
            }
        }

        .river-box:nth-child(2) {
            background-color: #002149;
            border-top: 1px solid #4f8aff;
            border-bottom: 1px solid #4f8aff;

            .value-num {
                font-family: Furore;
                font-size: 24px;
                font-weight: normal;
                line-height: 24px;
                color: transparent;
                letter-spacing: 0;
                background: linear-gradient(to bottom, rgb(255 255 255 / 1), #4f8aff);
                -webkit-background-clip: text;
                background-clip: text;
            }

            &::before {
                position: absolute;
                top: 0;
                left: 0;
                width: 1px;
                height: 10px;
                content: "";
                background: linear-gradient(180deg, #4f8aff 0%, rgb(0 0 0 / 0) 100%);
            }

            &::after {
                position: absolute;
                top: 0;
                right: 0;
                width: 1px;
                height: 10px;
                content: "";
                background: linear-gradient(180deg, #4f8aff 0%, rgb(0 0 0 / 0) 100%);
            }

            .border::after {
                position: absolute;
                right: 0;
                bottom: 0;
                width: 1px;
                height: 10px;
                content: "";
                background: linear-gradient(0deg, #4f8aff 0%, rgb(0 0 0 / 0) 100%);
            }

            .border::before {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 1px;
                height: 10px;
                content: "";
                background: linear-gradient(0deg, #4f8aff 0%, rgb(0 0 0 / 0) 100%);
            }
        }

        .river-box:nth-child(3) {
            background-color: #1a2e14;
            border-top: 1px solid #4fee00;
            border-bottom: 1px solid #4fee00;

            .value-num {
                font-family: Furore;
                font-size: 24px;
                font-weight: normal;
                line-height: 24px;
                color: transparent;
                letter-spacing: 0;
                background: linear-gradient(to bottom, rgb(255 255 255 / 1), #4fee00);
                -webkit-background-clip: text;
                background-clip: text;
            }

            &::before {
                position: absolute;
                top: 0;
                left: 0;
                width: 1px;
                height: 10px;
                content: "";
                background: linear-gradient(180deg, #4fee00 0%, rgb(0 0 0 / 0) 100%);
            }

            &::after {
                position: absolute;
                top: 0;
                right: 0;
                width: 1px;
                height: 10px;
                content: "";
                background: linear-gradient(180deg, #4fee00 0%, rgb(0 0 0 / 0) 100%);
            }

            .border::after {
                position: absolute;
                right: 0;
                bottom: 0;
                width: 1px;
                height: 10px;
                content: "";
                background: linear-gradient(0deg, #4fee00 0%, rgb(0 0 0 / 0) 100%);
            }

            .border::before {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 1px;
                height: 10px;
                content: "";
                background: linear-gradient(0deg, #4fee00 0%, rgb(0 0 0 / 0) 100%);
            }
        }

        .river-box:nth-child(4) {
            background-color: #292917;
            border-top: 1px solid #fffc4f;
            border-bottom: 1px solid #fffc4f;

            .value-num {
                font-family: Furore;
                font-size: 24px;
                font-weight: normal;
                line-height: 24px;
                color: transparent;
                letter-spacing: 0;
                background: linear-gradient(to bottom, rgb(255 255 255 / 1), #fffc4f);
                -webkit-background-clip: text;
                background-clip: text;
            }

            &::before {
                position: absolute;
                top: 0;
                left: 0;
                width: 1px;
                height: 10px;
                content: "";
                background: linear-gradient(180deg, #fffc4f 0%, rgb(0 0 0 / 0) 100%);
            }

            &::after {
                position: absolute;
                top: 0;
                right: 0;
                width: 1px;
                height: 10px;
                content: "";
                background: linear-gradient(180deg, #fffc4f 0%, rgb(0 0 0 / 0) 100%);
            }

            .border::after {
                position: absolute;
                right: 0;
                bottom: 0;
                width: 1px;
                height: 10px;
                content: "";
                background: linear-gradient(0deg, #fffc4f 0%, rgb(0 0 0 / 0) 100%);
            }

            .border::before {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 1px;
                height: 10px;
                content: "";
                background: linear-gradient(0deg, #fffc4f 0%, rgb(0 0 0 / 0) 100%);
            }
        }

        .river-box:nth-child(5) {
            .value-num {
                font-family: Furore;
                font-size: 24px;
                font-weight: normal;
                line-height: 24px;
                color: transparent;
                letter-spacing: 0;
                background: linear-gradient(to bottom, rgb(255 255 255 / 1), rgb(238 142 0 / 1));
                -webkit-background-clip: text;
                background-clip: text;
            }

            &::before {
                position: absolute;
                top: 0;
                left: 0;
                width: 1px;
                height: 10px;
                content: "";
                background: linear-gradient(180deg, rgb(238 142 0 / 1) 0%, rgb(0 0 0 / 0) 100%);
            }

            &::after {
                position: absolute;
                top: 0;
                right: 0;
                width: 1px;
                height: 10px;
                content: "";
                background: linear-gradient(180deg, rgb(238 142 0 / 1) 0%, rgb(0 0 0 / 0) 100%);
            }

            .border::after {
                position: absolute;
                right: 0;
                bottom: 0;
                width: 1px;
                height: 10px;
                content: "";
                background: linear-gradient(0deg, rgb(238 142 0 / 1) 0%, rgb(0 0 0 / 0) 100%);
            }

            .border::before {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 1px;
                height: 10px;
                content: "";
                background: linear-gradient(0deg, rgb(238 142 0 / 1) 0%, rgb(0 0 0 / 0) 100%);
            }
        }

        .river-box:nth-child(6) {
            background-color: rgba(49, 26, 26, 1);
            border-top: 1px solid rgba(255, 79, 96, 1);
            border-bottom: 1px solid rgba(255, 79, 96, 1);

            .value-num {
                font-family: Furore;
                font-size: 24px;
                font-weight: normal;
                line-height: 24px;
                color: transparent;
                letter-spacing: 0;
                background: linear-gradient(to bottom, rgb(255 255 255 / 1), rgba(255, 170, 170, 1));
                -webkit-background-clip: text;
                background-clip: text;
            }

            &::before {
                position: absolute;
                top: 0;
                left: 0;
                width: 1px;
                height: 10px;
                content: "";
                background: linear-gradient(180deg, rgba(255, 79, 96, 1) 0%, rgb(0 0 0 / 0) 100%);
            }

            &::after {
                position: absolute;
                top: 0;
                right: 0;
                width: 1px;
                height: 10px;
                content: "";
                background: linear-gradient(180deg, rgba(255, 79, 96, 1) 0%, rgb(0 0 0 / 0) 100%);
            }

            .border::after {
                position: absolute;
                right: 0;
                bottom: 0;
                width: 1px;
                height: 10px;
                content: "";
                background: linear-gradient(0deg, rgba(255, 79, 96, 1) 0%, rgb(0 0 0 / 0) 100%);
            }

            .border::before {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 1px;
                height: 10px;
                content: "";
                background: linear-gradient(0deg, rgba(255, 79, 96, 1) 0%, rgb(0 0 0 / 0) 100%);
            }
        }

        .river-box {
            position: relative;
            display: flex;
            align-items: center;
            width: 164px;
            height: 72px;
            padding-left: 16px;
            background-color: #2e2414;
            border-top: 1px solid rgb(238 142 0 / 1);
            border-bottom: 1px solid rgb(238 142 0 / 1);

            .left-icon {
                width: 52px;
                height: 52px;
                margin-right: 20px;
            }

            .right-value {
                .top-title {
                    margin-bottom: 8px;
                    font-family: TRENDS;
                    font-size: 14px;
                    font-weight: normal;
                    line-height: 14px;
                    color: #fff;
                    letter-spacing: 0;
                }

                .value-num {
                    font-family: Furore;
                    font-size: 24px;
                    font-weight: normal;
                    line-height: 24px;
                    color: transparent;
                    letter-spacing: 0;

                    // background: linear-gradient(to bottom, rgb(255 255 255 / 1), rgb(255 224 98 / 1));
                    -webkit-background-clip: text;
                    background-clip: text;
                }

                .value-num-red {
                    font-family: Furore;
                    font-size: 24px;
                    font-weight: normal;
                    line-height: 24px;
                    color: transparent;
                    letter-spacing: 0;
                    background: linear-gradient(to bottom, rgb(255 255 255 / 1), #faa);
                    -webkit-background-clip: text;
                    background-clip: text;
                }
            }
        }
    }

    .table-box {
        margin-top: 16px;
        margin-bottom: 34px;

        .table-header {
            display: flex;
            align-items: center;
            width: 100%;
            height: 28px;
            padding: 3px 0 3px 8px;
            background: rgb(255 255 255 / 0.06);

            .title-box {
                font-family: TRENDS;
                font-size: 14px;
                font-weight: normal;
                line-height: 14px;
                color: #fff;
                text-align: center;
            }
        }

        .value-line {
            .labe-line {
                display: flex;
                align-items: center;
                height: 24px;
                padding: 0 8px;
                margin: 8px 0 4px;
            }

            .value-title {
                font-family: TRENDS;
                font-size: 14px;
                font-weight: normal;
                line-height: 14px;
                color: #fff;
            }

            .value-no-stand {
                font-family: Furore;
                font-size: 16px;
                font-weight: normal;
                line-height: 16px;
                color: #ff4e44;
                text-align: center;
                letter-spacing: 0;
            }

            .value-stand {
                font-family: Furore;
                font-size: 16px;
                font-weight: normal;
                line-height: 16px;
                color: #0febc6;
                text-align: center;
                letter-spacing: 0;
            }

            .value-rate {
                font-family: Furore;
                font-size: 16px;
                font-weight: normal;
                line-height: 16px;
                color: #fff;
                text-align: center;
                letter-spacing: 0;
            }

            .bar-box {
                display: flex;
                align-items: center;

                .stand-bar {
                    width: 177px;
                    height: 8px;
                    background: linear-gradient(270deg, rgb(15 235 198 / 0.8) 0%, rgb(15 235 198 / 0.2) 100%);
                }

                .bar-head {
                    width: 2px;
                    height: 12px;
                    background: #ff3636;
                }

                .no-stand-bar {
                    width: 171px;
                    height: 8px;
                    background: linear-gradient(270deg, rgb(255 54 54 / 0.8) 0%, rgb(255 34 0 / 0.2) 100%);
                }
            }
        }
    }

    .quality-warning {
        display: flex;
        justify-content: space-between;
        padding: 10px 8px 0;

        .warning-one {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 96px;

            .top {
                margin-bottom: 6px;
                font-family: TRENDS;
                font-size: 14px;
            }

            .circle-content {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 64px;
                height: 64px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 50%;

                .circle-inner {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 58px;
                    height: 58px;
                    background: conic-gradient(from 90deg at 50% 50%, #0ef 0deg, rgba(0, 238, 255, 0) 273deg, rgba(0, 238, 255, 0) 360deg);
                    border-radius: 50%;
                    -webkit-mask: radial-gradient(transparent, transparent 22px, #000 22px);
                    mask: radial-gradient(transparent 22px, #000 22px);
                }

                .circle-pos {
                    position: absolute;
                    z-index: 999;
                    width: 46px;
                    height: 46px;
                    background: url(@/assets/images/waterControlCab/circle.svg) no-repeat;
                    background-size: 100% 100%;
                }

                .text {
                    position: absolute;
                    z-index: 999;
                    font-family: Furore;
                    font-size: 16px;
                    color: transparent;
                    text-shadow: 0 2px 4px 0 #000;
                    background: linear-gradient(to bottom, #fff, #92f4ff);
                    -webkit-background-clip: text;
                    background-clip: text;
                }
            }

            .bottom {
                margin-top: 6px;

                span:nth-child(1) {
                    font-family: Furore;
                    font-size: 18px;
                    color: #0df;
                }

                span:nth-child(2) {
                    font-family: Furore;
                    font-size: 16px;
                    color: rgba(255, 255, 255, 0.8);
                }
            }
        }
    }
}
</style>
