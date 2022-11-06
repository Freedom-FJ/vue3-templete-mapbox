<template lang="pug">
.mask
    .boat-inspect.bf-blur
        .common-bg
        .panel-content
            .panel-title
                .text 云上巡航
                //- .center
                //-     .btn(v-for='item, index in titleList' :class="index === activeIndex ? 'active' : ''" @click="changeNav(index)") {{ item }}
                img.close(src='@/assets/images/map/close.png' @click='closePop')
            .inspect-content
                .left-select(style="width: 216px;" v-show="!activeIndex")
                    .control-time
                        span.text-14.mgr8 轮播间隔
                        .select-box
                            select-panel(:option="timeOption" :defaultSelect="0" @change="checkTimeType" :boxStyle="{ width: '60px', height: '28px'}" :isShowBack="true" :labelStyle="{ fontSize: '12px', color: '#60A2E1'}" arrow="line")
                    .left-top-control.mgb16.cur
                        img(:src="getAssetsFile(timer ? 'common/play.png' : 'common/stop.png')" @click="startPlay")
                        span {{timer ? '暂停轮播' : '开始轮播' }}
                    .one-tree(v-for='item in treeDataStatics' style="padding-left: 0;"  @click.stop="item.showChild = !item.showChild")
                        .label-box
                            .arrow-line.tran05( :class="!item.showChild ? 'arrow-line-ro' : ''")
                            img(src="@/assets/images/common/file.png")
                            span.text-14 {{ item.label }}
                        .one-tree(v-for='itemChild in item.children || []' v-show="item.showChild" @click.stop="itemChild.showChild = !itemChild.showChild")
                            .label-box
                                .arrow-line.tran05( :class="!itemChild.showChild ? 'arrow-line-ro' : ''")
                                img(src="@/assets/images/common/file.png")
                                span.text-14  {{ itemChild.label }}
                            .one-tree(v-for='itemChildSon in itemChild.children || []' v-show="itemChild.showChild" :class='[itemChildSon.url, itemChildSon.deviceId].includes(currVideoUrl) ? "active" : ""' @click.stop="clickPlayer(itemChildSon)")
                                .label-box.cur
                                    img(src="@/assets/images/common/see.png")
                                    span.text-14  {{ itemChildSon.label }}
                .left-select(v-show="activeIndex")
                    .one(v-for='item, index in inspectList' :class='leftIndex === index ? "active" : ""' @click="changeLeft(index)") {{ item }}
                .history-list(v-show="activeIndex")
                    .head-top
                        .text 历史巡查
                        .begin 发起巡查
                    .one(v-for='item, index in historyList' :class='historyIndex === index ? "active" : ""' @click='changeHistory(index)') {{ item }}
                .main-content(:style="{ width: !activeIndex ? 'calc(100% - 160px)' : 'calc(100% - 160px - 250px)'}")
                    .video-box(v-if='activeIndex === 0')
                        live-player(v-if="!isShowIframe" :video-url='currVideoUrl', live='true', muted='true', stretch='false' width)
                        iframe(v-else :src='`/bmp-video-control-web/#/videoPlayer?id=${currVideoUrl}&hideMenus=true`' frameBorder="0" width="100%" height="100%")
                        //- video(width="320" height="240" controls autoplay :src="getAssetsFile(`video/${leftIndex}.mp4`)" type="video/mp4")
                    .video-box(v-if='activeIndex === 1')
                        video( width="842" height="420" controls loop autoplay :src="getAssetsFile(`video/boat0926.mp4`)" type="video/mp4")
                    .water-quality(v-show="activeIndex")
                        .tools
                            .left
                                .factor(v-for='item, index in factorList' :class='factorIndex === index ? "active" : ""' @click='changeFactor(index)') {{item}}
                        .chart(ref='waterChart')
                    .river-table(v-show="!activeIndex")
                        popup-table(:option="option" ref="popupTableDom"  :data="tableData" :height="160" :lineStyle="{ height: '32px'}"  :headerLineStyle="{ height: '28px', background: 'transparent', borderBottom: '1px solid rgba(96, 162, 225, 0.5)'}")
</template>

<script setup lang="ts">
import type { videoItemTs } from './types'
import { usePopStore } from '@/store/popControl'
import type { popTableOptionAllTs, popTableOptionTs } from '@/types/common'
import { getAssetsFile } from '@/utils/tools'
import { RiverRuleLineOptions } from '@/utils/echarts/echartsOptions'
import { globalKey } from '@/symbols'
const popStore = usePopStore()
const dataJson = [
    ['09.26 10:00', 0.15],
    ['09.26 10:20', 2],
    ['09.26 10:40', 0.5],
    ['09.26 11:00', 1],
    ['09.26 11:20', 0.8],
    ['09.26 11:40', 1.2],
    ['09.26 12:00', 1.6],
    ['09.26 12:20', 0.2],
    ['09.26 12:40', 1.5],
    ['09.26 13:00', 0.8],
    ['09.26 13:20', 1.2],
    ['09.26 13:40', 2],
    ['09.26 14:00', 0.7],
    ['09.26 14:20', 0.2],
    ['09.26 14:40', 1.2],
    ['09.26 15:00', 0.9],
    ['09.26 15:20', 1.8],
    ['09.26 15:40', 0.4],
    ['09.26 16:00', 1],
    ['09.26 16:20', 2.9],
    ['09.26 16:40', 1.8],
    ['09.26 17:00', 0.4],
    ['09.26 17:20', 1],
]
const treeDataStatic: videoItemTs[] = [
    {
        label: '流域',
        showChild: true,
        children: [
            {
                label: '京杭运河',
                showChild: true,
                children: [
                    {
                        label: '省直属粮库枪2西岸',
                        url: 'https://117.lives9.top:8899/sms/34020000002020000001/flv/hls/33010107072000151141_33010300581314000103.flv'
                    },
                    {
                        label: '钱潮码头枪机2西岸',
                        url: 'https://117.lives9.top:8899/sms/34020000002020000001/flv/hls/33010107072000151141_33010300581314000095.flv'

                    },
                    {
                        label: '义桥所码头枪2西岸',
                        url: 'https://117.lives9.top:8899/sms/34020000002020000001/flv/hls/33010107072000151141_33010300581314000021.flv'

                    },
                    {
                        label: '武林头楼顶球机4',
                        url: 'https://117.lives9.top:8899/sms/34020000002020000001/flv/hls/33010107072000151141_33011000581314000161.flv'

                    }
                ]
            },
            {
                label: '余杭塘河',
                showChild: true,
                children: [
                    {
                        label: '001-道-石化大道-岛内-东-7#',
                        deviceId: '09d9406ae93744d0afddeb66580c9c02'
                    },
                    {
                        label: '18号水站_1',
                        deviceId: '9564d0ec2153412e8e085ead0fe83bde'

                    },
                    {
                        label: '19号水质监测点_1',
                        deviceId: '20dc9744587d48e78ca9b7e2ea01b2c8'

                    }
                ]
            }
        ]
    }
]
const timeOption = [
    { value: 5, label: '5秒' },
    { value: 10, label: '10秒' },
    { value: 15, label: '15秒' },
    { value: 20, label: '20秒' },
]
const global = inject(globalKey)
const waterChart = ref('')
let waterChartObj: any = {}
const data = reactive({
    titleList: ['云上巡航', '无人船巡查'],
    activeIndex: 0,
    treeDataStatics: treeDataStatic,
    inspectList: ['余杭塘河无人船1号', '余杭塘河无人船2号'],
    historyList: ['2022.09.26 10:00 - 2022.09.26 17:00'],
    factorList: ['总体水质', '氨氮', '总磷', '总氮'],
    leftIndex: 0,
    currTimeTypeNum: 5,
    historyIndex: 0,
    currVideoUrl: '',
    factorIndex: 1,
    timer: null as null | NodeJS.Timeout,
    treeData: [] as any[],
    isShowIframe: false,
    tableData: [
        { time: '2022-08-03  17', level: '吴介洋港', factor: '140', nd: '42', detail: 2 },
        { time: '2022-08-03  17', level: '朱家塘港', factor: '140', nd: '42', detail: 2 },
        { time: '2022-08-03', level: '张家桥港', factor: '140', nd: '42', detail: 2 },
        { time: '2022-08-03  17', level: '张家桥港', factor: '140', nd: '42', detail: 2 },
        { time: '2022-08-03  17', level: '张家桥港', factor: '140', nd: '42', detail: 2 },
        { time: '2022-08-03  17', level: '张家桥港', factor: '140', nd: '42', detail: 2 },
    ],
    option: [
        {
            label: '时间',
            key: 'time',
        },
        {
            label: '事件类型',
            key: 'level',
            type: 'select',
            list: [
                { label: '事件类型', value: '', selectLabel: '全 部' },
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
            label: '事件级别',
            key: 'level',
            type: 'select',
            list: [
                { label: '事件级别', value: '', selectLabel: '全部' },
                { label: '周报警', value: '周报警' },
                { label: '月报警', value: '月报警' },
                { label: '年报警', value: '年报警' }
            ],
            defaultSelect: 0,
            renderStyle: (item: record, option: popTableOptionTs) => {
                return {
                    color: '#F7C706' // #36F097
                }
            },
            click: (item: record, optionItem: popTableOptionAllTs) => {
                //
            }
        },
        {
            label: '因子',
            key: 'factor',
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
            key: 'nd',
        },
        {
            label: '处理状态',
            key: 'detail',
            renderStyle: (item: record, option: popTableOptionTs) => {
                return {
                    color: '#36F097' //  F7C706
                }
            },
            type: 'select',
            list: [
                { label: '处理状态', value: '', selectLabel: '全部' },
                { label: '未处置', value: '未处置' },
                { label: '处置中', value: '处置中' },
                { label: '已处置', value: '已处置' }
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
                        // analysis.startAnalysis({
                        //     type: 'AnalysisWaterQuality',
                        //     data: item
                        // })
                        // window.glPopup && window.glPopup.remove()
                    }
                },
                {
                    label: '查看',
                    click: () => {
                        popStore.upDatePopup({ currentPop: 'WarningCheckPop' })
                    }
                }
            ]
        }
    ] as popTableOptionTs[]
})
onMounted(() => {
    if (data.activeIndex) drawBar()
    clickPlayer()
})
onUnmounted(() => {
    data.timer && clearInterval(data.timer)
})

const changeNav = (index: number) => {
    if (index) drawBar()
    data.timer && clearTimeout(data.timer)
    data.activeIndex = index
}
const changeLeft = (index: number) => {
    data.leftIndex = index
}
const changeHistory = (index: number) => {
    data.historyIndex = index
}
const changeFactor = (index: number) => {
    data.factorIndex = index
}

/**
 * @name: 开始云上巡航轮博
 */
const startPlay = () => {
    let activeIndex = 0
    const allChildUrl = getTreeUrl(data.treeDataStatics)
    data.currVideoUrl = allChildUrl[0]
    if (data.timer) {
        clearInterval(data.timer)
        data.timer = null
        return
    }
    data.timer = setInterval(() => {
        if (activeIndex === allChildUrl.length - 1) {
            data.timer && clearInterval(data.timer)
            data.timer = null
        }
        else {
            activeIndex++
            const currUrl = allChildUrl[activeIndex]
            if (currUrl.includes('-deviceId')) {
                data.isShowIframe = true
                data.currVideoUrl = currUrl.split('-')[0]
            }
            else {
                data.isShowIframe = false
                data.currVideoUrl = currUrl
            }
        }
    }, data.currTimeTypeNum * 1000)
}
/**
 * @name: 获得全部的视频点位地址
 * @param {*} treeData
 */
const getTreeUrl = (treeData: any[]) => {
    let urlList: string[] = []
    treeData.forEach((item) => {
        (item.url || item.deviceId) && urlList.push(item.url ? item.url : `${item.deviceId}-deviceId`)
        if (item.children)
            urlList = [...urlList, ...getTreeUrl(item.children)]
    })
    return urlList
}
/**
 * @name: 切换时间间隔
 * @param {*} val
 */
const checkTimeType = (val: { value: number; label: string }) => {
    data.currTimeTypeNum = val.value
    data.timer && clearInterval(data.timer)
    data.timer = null
}
/**
 * @name: 云上巡航点击左侧视频列表
 * @param {*} item 点击的视频对象
 */
const clickPlayer = (item?: any) => {
    data.timer && clearInterval(data.timer)
    data.timer = null
    if (!item) { data.currVideoUrl = data.treeDataStatics[0].children[0].children[0].url ?? '' }
    else if (item.deviceId) {
        data.isShowIframe = true
        data.currVideoUrl = item.deviceId
    }
    else {
        data.isShowIframe = false
        data.currVideoUrl = item.url
    }
}
const drawBar = async () => {
    setTimeout(() => {
        waterChartObj = global?.echarts.init(waterChart.value)
        const lineOptions = RiverRuleLineOptions(dataJson)
        waterChartObj.setOption(lineOptions)
    }, 100)
}
const closePop = () => {
    popStore.initPop()
}
const {
    treeDataStatics,
    titleList,
    activeIndex,
    inspectList,
    historyList,
    factorList,
    option,
    tableData,
    leftIndex,
    historyIndex,
    factorIndex,
    timer,
    currVideoUrl,
    isShowIframe
} = toRefs(data)
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
            height: calc(100% - 45px);
            padding: 0 16px;

            .left-select {
                flex-shrink: 0;
                width: 160px;
                height: 100%;
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
                    border-radius: 4px;
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
                padding: 16px 10px 12px 12px;

                .video {
                    width: 100%;
                    height: 510px;
                    margin-bottom: 10px;

                    video {
                        width: 100%;
                        height: 510px;
                    }

                    img {
                        width: 100%;
                        height: 510px;
                    }
                }

                .water-quality {
                    .tools {
                        display: flex;
                        justify-content: space-between;
                    }

                    .chart {
                        width: 100%;
                        height: 175px;
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
            width: calc(100% - 17px);
            height: 40px;
            padding: 0 16px;
            /* stylelint-disable-next-line color-function-notation */
            border-bottom: 1px solid rgb(7 131 250 / 0.5);
            transform: translateX(8px);

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
                    border-radius: 4px;
                }
            }

            .close {
                width: 20px;
                height: 20px;
            }
        }
    }
}

.control-time {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}

.one-tree {
    padding-left: 24px;
    line-height: 32px;

    & > img {
        width: 16px;
        height: 16px;
        margin-right: 4px;
    }

    & > .label-box {
        display: flex;
        align-items: center;
        height: 32px;
        cursor: pointer;
    }
}

.left-top-control {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    width: fit-content;
    height: 32px;
    padding: 8px;
    font-family: TRENDS;
    font-size: 14px;
    font-weight: normal;
    line-height: 14px;
    color: #0df;
    letter-spacing: 0;
    background: #002950;
    border: 1px solid #194269;
    border-radius: 4px;

    img {
        width: 16px;
        height: 16px;
        margin-left: 4px;
        cursor: pointer;
    }
}

.video-box {
    position: relative;
    width: 100%;
    height: 510px;
}

.arrow-line {
    width: 6px;
    height: 6px;
    margin-right: 10px;
    margin-left: 4px;
    border-right: 2px solid #fff;
    border-bottom: 2px solid #fff;
    transform: rotate(45deg) translateY(-50%);
    transform-origin: center;
}

.arrow-line-ro {
    transform: rotate(225deg) !important;
}
</style>
