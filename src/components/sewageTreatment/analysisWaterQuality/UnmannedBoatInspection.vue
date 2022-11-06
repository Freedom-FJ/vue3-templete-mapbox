<template lang="pug">
.mask
    .boat-inspect.bf-blur
        .common-bg
        .panel-content
            .panel-title
                .text 无人船巡查
                .center
                    .btn(v-for='item, index in titleList' :class="index === activeIndex ? 'active' : ''" @click="changeNav(index)") {{ item }}
                img.close(src='@/assets/images/map/close.png' @click='closePop')
            .inspect-content
                .left-select
                    .one(v-for='item, index in inspectList' :class='leftIndex === index ? "active" : ""' @click="changeLeft(index)") {{ item }}
                .history-list
                    .head-top
                        .text 历史巡查
                        .begin 发起巡查
                    .one(v-for='item, index in historyList' :class='historyIndex === index ? "active" : ""' @click='changeHistory(index)') {{ item }}
                .main-content
                    .video(v-if='activeIndex === 0')
                        //- img(src='@/assets/images/sewageTreatment/video-2.png')
                        video(width="842" height="420" controls loop autoplay :src="getAssetsFile(`video/boat0926.mp4`)" type="video/mp4")
                    .map-content(v-if='activeIndex === 1')
                        #inspectMapContent
                        .map-video
                            video(width="240" height="128" controls loop autoplay :src="getAssetsFile(`video/boat0926.mp4`)" type="video/mp4")
                    .water-quality
                        .tools
                            .left
                                .factor(v-for='item, index in factorList' :class='factorIndex === index ? "active" : ""' @click='changeFactor(index)') {{item.name}}
                            .right
                                img(src='@/assets/images/sewageTreatment/play/left.png' @click='')
                                img(src='@/assets/images/sewageTreatment/play/stop.png' v-show="!data.playStatus" @click='play')
                                img(src='@/assets/images/sewageTreatment/play/play.png' v-show="data.playStatus" @click='stop')
                                img(src='@/assets/images/sewageTreatment/play/right.png')
                        .chart(ref='waterChart')
                        .playLine(ref='selectedBar')
                            .pos(:style='{width: dynamicWidth + "px"}')
</template>

<script setup lang="ts">
import imgStyle from '@static/json/imgStyle.json'
import { DynamicLineBoatClass } from './unmannedBoatInspection'
import { allList, coordStatic } from './static'
import type { UnShipStaticTs } from './types'
import { getFactorLevelRange } from '@/utils/commonMethods/factor'
import type { JSONDataTs } from '@/types/common'
import { initMap } from '@/utils/map/mapInit'
import { waterQualityLineOptions } from '@/utils/echarts/echartsOptions'
import { globalKey } from '@/symbols'
import { getAssetsFile } from '@/utils/tools'
import { usePopStore } from '@/store/popControl'
const dataJson = [
    ['09.26 10:00', 0.06],
    ['09.26 10:20', 0.08],
    ['09.26 10:40', 0.1],
    ['09.26 11:00', 0.15],
    ['09.26 11:20', 0.12],
    ['09.26 11:40', 0.1],
    ['09.26 12:40', 0.15],
    ['09.26 13:00', 0.2],
    ['09.26 13:20', 0.5],
    ['09.26 13:40', 0.3],
    ['09.26 14:00', 0.6],
    ['09.26 14:20', 0.2],
    ['09.26 14:40', 1.2],
    ['09.26 15:00', 1.5],
    ['09.26 15:20', 0.8],
    ['09.26 15:40', 0.6],
    ['09.26 16:00', 1.8],
    ['09.26 16:20', 1.5],
    ['09.26 16:40', 1.5],
    ['09.26 17:00', 1.8],
    ['09.26 17:20', 2],
    ['09.26 12:00', 2],
    ['09.26 12:20', 2.1],
]
const dataJson2 = [
    ['09.26 10:00', 0.02],
    ['09.26 10:20', 0.04],
    ['09.26 10:40', 0.12],
    ['09.26 11:00', 0.1],
    ['09.26 11:20', 0.1],
    ['09.26 11:40', 0.09],
    ['09.26 12:40', 0.12],
    ['09.26 13:00', 0.15],
    ['09.26 13:20', 0.25],
    ['09.26 13:40', 0.3],
    ['09.26 14:00', 0.46],
    ['09.26 14:20', 0.2],
    ['09.26 14:40', 0.3],
    ['09.26 15:00', 0.5],
    ['09.26 15:20', 0.8],
    ['09.26 15:40', 0.6],
    ['09.26 16:00', 0.8],
    ['09.26 16:20', 0.5],
    ['09.26 16:40', 0.5],
    ['09.26 17:00', 0.8],
    ['09.26 17:20', 2],
    ['09.26 12:00', 2],
    ['09.26 12:20', 2.1],
]
const dataJson3 = [
    ['09.26 10:00', 60],
    ['09.26 10:20', 55],
    ['09.26 10:40', 45],
    ['09.26 11:00', 50],
    ['09.26 11:20', 53],
    ['09.26 11:40', 67],
    ['09.26 12:40', 72],
    ['09.26 13:00', 47],
    ['09.26 13:20', 80],
    ['09.26 13:40', 68],
    ['09.26 14:00', 60],
    ['09.26 14:20', 46],
    ['09.26 14:40', 65],
    ['09.26 15:00', 56],
    ['09.26 15:20', 68],
    ['09.26 15:40', 60],
    ['09.26 16:00', 80],
    ['09.26 16:20', 68],
    ['09.26 16:40', 70],
    ['09.26 17:00', 80],
    ['09.26 17:20', 100],
    ['09.26 12:00', 230],
    ['09.26 12:20', 250],
]
const lineJson = {
    type: 'FeatureCollection',
    name: 'wrcgj',
    crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:EPSG::4490' } },
    features: [
        { type: 'Feature', properties: { id: 1 }, geometry: { type: 'LineString', coordinates: [[120.016309, 30.28009], [120.014767, 30.279951], [120.013464, 30.279794], [120.012824, 30.279784], [120.012345, 30.279882], [120.011625, 30.279665], [120.010185, 30.279498], [120.009282, 30.27932]] } }
    ]
}
const visualMapObj = {
    top: 50,
    right: 10,
    show: false,
    dimension: 1,
    seriesIndex: 0,
    pieces: [] as record[],
    outOfRange: {
        color: '#999'
    }
}
const popStore = usePopStore()
const global = inject(globalKey)
const waterChart = ref('')
const selectedBar: any = ref('')
let waterChartObj: any = {}
let inspectMapObj: record | null = null
const data = reactive({
    titleList: ['巡查过程', '排污口排查'],
    activeIndex: 0,
    inspectList: ['余杭塘河无人船1号', '余杭塘河无人船2号'],
    historyList: ['2022.09.26 10:00 - 2022.09.26 17:00'],
    factorList: [
        { name: '总体水质', code: 'level' },
        { name: '氨氮', code: 'w21003' },
        { name: '总磷', code: 'w21011' },
        { name: '总氮', code: 'w21001' },
        { name: '多因子比对', code: 'more' },
    ],
    leftIndex: 0,
    historyIndex: 0,
    factorIndex: -1,
    playIndex: 0,
    dynamicWidth: 0,
    playStatus: false,
    BoatClass: null as null | InstanceType<typeof DynamicLineBoatClass>,
    xAxisData: [] as string[]
})
let timer: any = null

onMounted(async () => {
    nextTick()
    changeFactor(1)
})

onUnmounted(() => {
    data.BoatClass && data.BoatClass.stopAnimate()
    timer && clearInterval(timer)
})
watch(() => data.activeIndex, (val) => {
    if (val === 1) {
        setTimeout(() => {
            // 初始化地图
            inspectMapObj = initMap('inspectMapContent', imgStyle)
            inspectMapObj && inspectMapObj.on('load', () => {
                detailMapLineData(data.factorIndex)
            })
        }, 0)
    }
    else { data.BoatClass?.stopAnimate() }
})
/**
 * tab切换
 * @param index
 */
const changeNav = (index: number) => {
    data.activeIndex = index
    timer && clearInterval(timer)
    data.playStatus = false
    data.playIndex = 0
    data.dynamicWidth = 0
}
/**
 * 无人船切换
 * @param index
 */
const changeLeft = (index: number) => {
    data.leftIndex = index
}
/**
 * 巡查历史播放
 */
const changeHistory = (index: number) => {
    data.historyIndex = index
}
/**
 * 因子切换
 */
const changeFactor = async (index: number) => {
    if (data.factorIndex === index) return
    data.factorIndex = index
    timer && clearInterval(timer)
    const currFactorData = data.factorList[data.factorIndex]
    waterChartObj = global?.echarts.init(waterChart.value)
    waterChartObj.clear()
    if (index !== data.factorList.length - 1) detailMapLineData(index)
    // 多因子情况
    if (currFactorData.code === 'more') {
        // const useData = data.factorList.slice(1, 4)
        // const seriesArr = useData.map((item) => {
        //     return {
        //         name: item.name,
        //         type: 'line',
        //         symbol: 'none',
        //         yAxisIndex: 0,
        //         smooth: true,
        //         data: allList[item.code as keyof typeof allList].dates.map((item: any) => {
        //             return item.value
        //         }),
        //     }
        // })
        const seriesArr = [
            {
                name: '氨氮',
                type: 'line',
                symbol: 'none',
                yAxisIndex: 0,
                smooth: true,
                data: dataJson.map((item) => {
                    return item[1]
                }),
            },
            {
                name: '总氮',
                type: 'line',
                symbol: 'none',
                yAxisIndex: 0,
                smooth: true,
                data: dataJson2.map((item) => {
                    return item[1]
                }),
            },
            {
                name: '浊度',
                type: 'line',
                symbol: 'none',
                smooth: true,
                yAxisIndex: 1,
                itemStyle: {
                    color: 'rgba(255, 64, 133, 1)'
                },
                data: dataJson3.map((item) => {
                    return item[1]
                }),
            }
        ]
        const obj2 = JSON.parse(JSON.stringify(visualMapObj))
        obj2.seriesIndex = 1
        const visualMap = [visualMapObj, obj2]
        const lineOptions = waterQualityLineOptions('mg/L', true, data.xAxisData, visualMap, seriesArr)
        waterChartObj.setOption(lineOptions)
    }
    else {
        const currDataList: UnShipStaticTs = allList[currFactorData.code as keyof typeof allList]
        data.xAxisData = currDataList.times
        const seriesArr = [{
            name: currFactorData.name,
            type: 'line',
            symbol: 'none',
            yAxisIndex: 0,
            smooth: true,
            data: currDataList.dates.map((item) => {
                return currFactorData.code === 'level' ? item.level : item.value
            }),
        }]
        visualMapObj.pieces = await getFactorLevelRange(currFactorData.code, 0)
        console.log(visualMapObj.pieces, 'visualMapObj.pieces')
        const lineOptions = waterQualityLineOptions('mg/L', false, data.xAxisData, [visualMapObj], seriesArr)
        waterChartObj.setOption(lineOptions)
    }
}
/**
 * 处理地图数据
 */
const detailMapLineData = (index: number) => {
    if (!inspectMapObj) return
    const currFactorData = data.factorList[index]
    const currDataList: UnShipStaticTs = allList[currFactorData.code as keyof typeof allList]
    const staticJson: JSONDataTs = {
        type: 'FeatureCollection',
        name: 'wrc-point',
        crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:EPSG::4490' } },
        features: []
    }
    currDataList.dates.forEach((item, index) => {
        const staticFeatures = { type: 'Feature', properties: { id: index, value: item.level }, geometry: { type: 'Point', coordinates: coordStatic[index] } }
        coordStatic[index] && staticJson.features.push(staticFeatures)
    })
    setTimeout(() => {
        if (!data.BoatClass)
            data.BoatClass = new DynamicLineBoatClass('line', staticJson, inspectMapObj, { time: 1000 * 23 })
        else data.BoatClass.replay(inspectMapObj, staticJson, { isShowAll: true })
    }, 300)
}
/**
 * 折线图播放
 */
const play = () => {
    data.playStatus = true
    const onePices = selectedBar.value.offsetWidth / dataJson.length
    if (data.playIndex === 0) { data.BoatClass && data.BoatClass.replay() }
    else {
        data.BoatClass && data.BoatClass.continueAnimate()
        waterChartObj.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: data.playIndex
        })
        data.playIndex++
        data.dynamicWidth = onePices * data.playIndex
    }

    timer = setInterval(() => {
        waterChartObj.dispatchAction({
            type: 'showTip',
            seriesIndex: 0,
            dataIndex: data.playIndex
        })
        data.playIndex++
        data.dynamicWidth = onePices * data.playIndex
        if (data.playIndex > dataJson.length) {
            clearInterval(timer)
            data.playStatus = !data.playStatus
            data.playIndex = 0
            data.dynamicWidth = 0
        }
    }, 1000)
}

/**
 * @name: 暂停动画
 */
const stop = () => {
    data.playStatus = false
    data.BoatClass && data.BoatClass.stopAnimate()
    clearInterval(timer)
}

const closePop = () => {
    popStore.initPop()
}
const { titleList, activeIndex, inspectList, historyList, factorList, leftIndex, historyIndex, factorIndex, dynamicWidth } = toRefs(data)
</script>

<style lang="scss" scoped>
.boat-inspect {
    position: relative;
    z-index: 99;
    width: 1280px;
    height: 778px;
    margin: 8% auto;
    color: #fff;
    border-radius: 20px;

    .common-bg {
        position: absolute;
        width: 100%;
        height: 778px;
        border-top: 30px solid;
        border-right: 70px solid;
        border-bottom: 30px solid;
        border-left: 70px solid;
        border-image-source: url(@/assets/images/panel/panel-1.png);
        border-image-slice: 30 70 30 70 fill;
    }

    .panel-content {
        position: absolute;
        z-index: 9;
        width: 100%;
        height: 100%;

        .inspect-content {
            display: flex;
            height: calc(100% - 40px);
            padding: 0 16px;

            .left-select {
                flex-shrink: 0;
                width: 160px;
                padding-top: 16px;
                padding-right: 16px;
                border-right: 1px solid #194269;

                .one {
                    padding: 8px 10px;
                    margin-bottom: 8px;
                    font-family: TRENDS;
                    font-size: 14px;
                    cursor: pointer;
                    background: #002950;
                    border: 1px solid #194269;
                    border-radius: 4px;
                }

                .active {
                    background: #008dce;
                    border: 1px solid #00e5ff;
                }
            }

            .history-list {
                flex-shrink: 0;
                width: 250px;
                padding: 0 10px;
                border-right: 1px solid #194269;

                .head-top {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: 44px;

                    .text {
                        font-family: TRENDS;
                        font-size: 14px;
                        color: #0df;
                    }

                    .begin {
                        box-sizing: border-box;
                        width: 76px;
                        height: 24px;
                        font-family: TRENDS;
                        font-size: 14px;
                        line-height: 24px;
                        text-align: center;
                        background: #2ac94f;
                        border: 1px solid #62fa85;
                        border-radius: 4px;
                    }
                }

                .one {
                    padding: 6px 4px;
                    margin-bottom: 4px;
                    font-family: TRENDS;
                    font-size: 12px;
                    cursor: pointer;
                    background: #002950;
                    border: 1px solid #194269;
                    border-radius: 4px;
                }

                .active {
                    background: #008dce;
                    border: 1px solid #00e5ff;
                }
            }

            .main-content {
                flex: 1;
                flex-shrink: 0;
                padding: 28px 16px 12px 12px;

                .video {
                    width: 824px;
                    height: 460px;

                    img {
                        width: 824px;
                        height: 460px;
                    }
                }

                .map-content {
                    position: relative;
                    width: 824px;
                    height: 460px;

                    #inspectMapContent {
                        position: absolute;
                        width: 824px;
                        height: 460px;
                    }

                    .map-video {
                        position: absolute;
                        right: 16px;
                        bottom: 16px;
                        z-index: 9;
                        width: 240px;
                        height: 128px;

                        img {
                            width: 240px;
                            height: 128px;
                        }
                    }
                }

                .water-quality {
                    .tools {
                        display: flex;
                        justify-content: space-between;
                        margin: 16px 0;
                    }

                    .chart {
                        width: 100%;
                        height: 180px;
                    }

                    .playLine {
                        position: relative;
                        width: calc(100% - 80px);
                        height: 5px;
                        margin: 0 40px;
                        margin-top: -30px;
                        /* stylelint-disable-next-line color-function-notation */
                        background: rgb(255 255 255 / 0.1);

                        .pos {
                            position: absolute;
                            width: 30px;
                            height: 100%;
                            /* stylelint-disable-next-line color-function-notation */
                            background: rgb(3 213 251 / 1);
                            border-radius: 2px;
                        }
                    }

                    .left {
                        display: flex;
                        align-items: center;

                        .factor {
                            padding: 5px 10px;
                            margin-right: 4px;
                            font-family: TRENDS;
                            font-size: 14px;
                            color: #0df;
                            cursor: pointer;
                            background: #002950;
                            border: 1px solid #194269;
                            border-radius: 4px;
                        }

                        .active {
                            color: #fff;
                            background: #008dce;
                            border: 1px solid #00e5ff;
                        }
                    }

                    .right {
                        display: flex;
                        align-items: center;

                        img {
                            width: 24px;
                            height: 24px;
                            margin-right: 6px;
                            cursor: pointer;
                        }
                    }
                }
            }
        }

        .panel-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 40px;
            padding: 0 16px;
            /* stylelint-disable-next-line color-function-notation */
            border-bottom: 1px solid rgb(7 131 250 / 0.5);

            .text {
                font-family: TRENDS;
                font-size: 16px;
            }

            .center {
                display: flex;
                padding-top: 6px;

                .btn {
                    box-sizing: border-box;
                    padding: 4px 10px;
                    margin-right: 4px;
                    font-family: TRENDS;
                    font-size: 14px;
                    color: #0df;
                    cursor: pointer;
                    background: #002950;
                    border: 1px solid #194269;
                    border-radius: 4px;
                }

                .active {
                    color: #fff;
                    background: #008dce;
                    border: 1px solid #00e5ff;
                }
            }

            .close {
                width: 20px;
                height: 20px;
            }
        }
    }
}
</style>
