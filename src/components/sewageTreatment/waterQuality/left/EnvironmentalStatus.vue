<template lang="pug">
.environmental-status
    .top-charts
        .chart-body(ref="echartsPie")
        .bottom-chart-count
            .left-label I~III类比例
            .right-value
                .value 55.87%
                .value-label 同比
                .tb-value 4.8%
                .arrow-down-red
    .down-rank
        .title-box.flex-bw-c.mgb14
            span.text-14 下级排名(优良率）
            .right-title
                .btn(:class="[rankType ? 'active' : '']" @click="rankType=true") 前五
                .btn(:class="[!rankType ? 'active' : '']" @click="rankType=false") 后六
        .rank-list-box
            .rank-item(v-for="(item, index) in resultShowRankList" :key="index")
                .rank-value {{item.goodPercent}}
                .rank-bar
                    .rank-bar-value(:style="{ height: item.goodPercent + '%'}")
                .rank-label {{item.name}}
</template>

<script lang="ts" setup name="environmental-status">
import type { situationApiTs } from '../type'
import { globalKey } from '@/symbols'
import type { lowerLevelApiTs } from '@/types/waterQuality'
import { getFactorGroupList } from '@/utils/commonMethods/factor'
import { getSetTreeCode } from '@/utils/treeDataUtils'
import { usePopStore } from '@/store/popControl'
import service from '@/service/api'
const popStore = usePopStore()
const global = inject(globalKey)

const data = reactive({
    rankList: [] as lowerLevelApiTs[],
    rankType: true,
    echartsPie: ref()
})
/**
 * @name 实际显示排名数据
 * @param rankType 前五 后六
 */
const resultShowRankList = computed(() => {
    if (data.rankType) return data.rankList.slice(-5).reverse()
    else return data.rankList.slice(0, 6)
})
onMounted(() => {
    getChartData()
    getLowerLevel()
})

/**
 * @name 获取下级排名数据
 */
const getLowerLevel = async () => {
    const treeData = await getSetTreeCode()
    const factorObj = await getFactorGroupList('surfaceSection')
    const params = {
        treeType: 1,
        treeId: treeData.slice(0, 6),
        factor: factorObj?.id ?? '',
        factorFlag: true,
        beginTime: global?.dayjs().startOf('year').valueOf(),
        endTime: global?.dayjs().add(1, 'years').startOf('year').valueOf(),
        dataTimeType: 1440,
        queryTimeType: 'year',
        // waterType:
    }
    service<lowerLevelApiTs[], true>('waterControlCab/lowerLevel', params).then((res) => {
        res.forEach((item) => {
            if (!item.total || !item.validSiteNum)
                item.goodPercent = null
            else if (typeof item.goodSectionNum === 'number' && typeof item.validSiteNum === 'number')
                item.goodPercent = Number(((item.goodSectionNum / item.validSiteNum) * 100).toFixed(0))
        })
        res.sort((a, b) => (typeof a.goodPercent === 'number' && typeof b.goodPercent === 'number') ? a.goodPercent - b.goodPercent : 1)
        data.rankList = res
    })
}
/**
 * @name: 获取环境现状数据
 */
const getChartData = async () => {
    const treeData = await getSetTreeCode()
    const factorObj = await getFactorGroupList('surfaceSection')
    const params = {
        treeType: 1,
        treeId: treeData.slice(0, 6),
        factorGroupId: factorObj?.id ?? '',
        beginTime: 1640966400000,
        endTime: 1672502400000,
        dataTimeType: 1440,
        queryTimeType: 'year',
        controlLevel: ''
    }
    const res = await service<situationApiTs, true>('waterControlCab/situation', params)
    if (!res) return
    const levelNumMap = res.levelNumMap

    const pieData = [
        { name: 'I类', value: 0, rate: '--' },
        { name: 'II类', value: 0, rate: '--' },
        { name: 'III类', value: 0, rate: '--' },
        { name: 'IV类', value: 0, rate: '--' },
        { name: 'V类', value: 0, rate: '--' },
        { name: '劣V类', value: 0, rate: '--' }
    ]
    pieData.forEach((item, index) => {
        item.value = (levelNumMap as recordt<number>)[index + 1]
    })
    const count = pieData.reduce((pre, curr) => {
        return pre + curr.value
    }, 0)
    pieData.forEach((item) => {
        item.rate = `${((item.value / count) * 100).toFixed(2)}%`
    })
    const dom = data.echartsPie
    if (!dom) return
    const chartChance = global?.echarts.init(dom)
    console.log(getOption(pieData, count), 'getOption(pieData, count)')
    chartChance.setOption(getOption(pieData, count))
}

const getOption = (pieData: { name: string; value: number; rate: string }[], count: number) => {
    const chartOption = {
        grid: {
            top: 0,
            left: 55,
            bottom: '1%',
        },
        color: ['#03A9F4', '#1976D2', '#85C941', '#D9CC4C', '#EE8E00', '#E12234'],
        legend: {
            type: 'scroll',
            orient: 'vertical',
            itemGap: 8,
            right: '0%',
            left: '50%',
            top: 'center',
            itemWidth: 10,
            itemHeight: 10,
            icon: 'circle',
            data: pieData,
            formatter: (name: string) => {
                for (let i = 0; i < pieData.length; i++) {
                    if (name === pieData[i].name) {
                        const richText = `{name|${name}}{num|${pieData[i].value}}{label|${'/'}}{rate|${pieData[i].rate}}`
                        return richText
                    }
                }
            },
            textStyle: {
                rich: {
                    name: {
                        width: 35,
                        fontSize: 14,
                        // fontWeight: 700,
                        // padding: [0, 0, 0, 0],
                        color: '#FFFFFF',
                        fontFamily: 'TRENDS'
                        // overflow: 'hidden',
                        // textOverflow: 'ellipsis',
                        // whiteSpace: 'nowrap'
                    },
                    num: {
                        fontSize: 14,
                        // fontWeight: 400,
                        // padding: [0, 10, 0, 10],
                        color: '#00DDFF',
                        width: 25,
                        align: 'right',
                        fontFamily: 'Furore'
                    },
                    label: {
                        fontSize: 14,
                        fontWeight: 'normal',
                        // padding: [0, 10, 0, 10],
                        color: 'rgba(255,255,255,.5)',
                        width: 10,
                        align: 'center',
                        fontFamily: 'Furore'
                    },
                    rate: {
                        fontSize: 14,
                        padding: [0, 0, 0, 3],
                        align: 'right',
                        fontFamily: 'Furore',
                        color: 'rgba(255,255,255,1)'
                    }
                }
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: (params: {
                data: {
                    name: string
                    value: string
                    rate: string
                }
            }) => {
                const {
                    data: { name, value, rate }
                } = params
                return `${name}：${value}家(${rate})`
            }
        },
        graphic: [ // 设置饼图中间文字内容
            {
                type: 'text',
                left: '16%', // center不行 因为会飞到整个div的中间
                top: '43%',
                style: {
                    text: count,
                    textAlign: 'center',
                    fontWeight: 'normal',
                    fill: 'rgba(255,255,255,.85)',
                    fontSize: 24,
                    fontFamily: 'Oswald'
                }
            }
        ],
        series: [
            {
                name: '企业档案',
                type: 'pie',
                center: ['23%', '50%'],
                radius: ['43%', '70%'],
                avoidLabelOverlap: true,
                hoverAnimation: false,
                data: pieData,
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                }
            }
        ]
    }
    return chartOption
}
/**
 * @name: 面板点击事件
 * @desc: 控制内容见 WaterControlCab文件 以及pinia popControl内
 * @param {*} index
 */
const checkTab = (index: number) => {
    !index && popStore.upDatePopup({ currentPop: 'FloodProtectionPopup' })
}
const { echartsPie, rankType } = toRefs(data)
</script>

<style lang="scss" scoped>
.environmental-status {
    padding: 10px;

    .chart-body {
        width: 100%;
        height: 160px;
    }

    .bottom-chart-count {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 36px;
        padding: 8px 32px;
        margin-top: 10px;
        background: rgba(0, 47, 93, 0.3);
        border: 1px solid #00366a;
        border-radius: 4px;

        .left-label {
            font-family: TRENDS;
            font-size: 16px;
            font-weight: normal;
            line-height: 16px;
            color: #fff;
            letter-spacing: 0;
        }

        .right-value {
            display: flex;
            align-items: center;

            .value {
                margin-right: 16px;
                font-family: Furore;
                font-size: 20px;
                font-weight: normal;
                color: #0df;
            }

            .value-label {
                margin-right: 4px;
                font-family: TRENDS;
                font-size: 14px;
                font-weight: normal;
                color: rgba(255, 255, 255, 0.5);
            }

            .tb-value {
                width: 38px;
                height: 16px;
                margin-right: 4px;
                font-family: Furore;
                font-size: 16px;
                font-weight: normal;
                color: #f84439;
            }
        }
    }

    .down-rank {
        position: relative;
        margin-top: 20px;

        &::after {
            position: absolute;
            bottom: 21px;
            left: 0;
            width: 100%;
            height: 1px;
            content: "";
            background-color: #2f6ba7;
        }

        .rank-title {
            margin-bottom: 16px;
            font-family: TRENDS;
            font-size: 16px;
            font-weight: normal;
            line-height: 16px;
            color: #fff;
        }

        .rank-list-box {
            display: flex;
            justify-content: space-between;
            width: 100%;
            min-height: 90px;

            .rank-item {
                display: flex;
                flex-direction: column;
                align-items: center;

                .rank-value {
                    font-family: Furore;
                    font-size: 14px;
                    font-weight: normal;
                    line-height: 14px;
                    color: #0df;
                    letter-spacing: 0;
                }

                .rank-bar {
                    display: flex;
                    flex-direction: column-reverse;
                    flex-grow: 1;
                    width: 20px;
                    height: 49px;
                    margin: 8px 0 9px;
                    background: rgba(255, 255, 255, 0.1);

                    .rank-bar-value {
                        width: 100%;
                        background: #03a9f4;
                    }
                }

                .rank-label {
                    font-family: TRENDS;
                    font-size: 14px;
                    font-weight: normal;
                    line-height: 14px;

                    /* 白色 */
                    color: #fff;
                    letter-spacing: 0;
                }
            }
        }
    }

    .right-title {
        display: flex;
        font-family: TRENDS;
        font-size: 12px;

        .btn {
            width: 40px;
            height: 22px;
            margin-left: 4px;
            line-height: 22px;
            text-align: center;
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
}
</style>
