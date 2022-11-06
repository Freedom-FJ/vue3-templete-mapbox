<template lang="pug">
.layout-header
    .layout-nav.flex-between-center
        .back(v-if="curPath==='/waterControlCab'")
            img(src='@/assets/images/layouts/back.png')
            .text 返回主页
        .back.cur(v-else @click="goBack")
            img(src='@/assets/images/layouts/back-1.png')
            .text 返回上一级
        .menus(v-show="navTitle")
            img.top-bgc(src="@/assets/images/layouts/top.png")
            .top-title {{navTitle}}
        //-五水指数界面
        .five-water(v-if='curPath.includes("FiveWaterIndexEvaluationResults")')
            .top
                .select
                    select-panel(:option="keySelectList" :labelStyle='labelStyle' :selectItemStyle="selectItemStyle" @change="countryChange")
                .text 五水指数评价结果
            .dec 更新时间：2022年10月12日 09:09
        .user-info
            img(src='@/assets/images/layouts/PPT.svg' style="margin-right: 30px;cursor: pointer;" @click='pptView')
            img(src='@/assets/images/layouts/user.png')
        .info(v-if='false')
                p Root管理员
                p 你好，欢迎登入！
    div(v-if="['/waterControlCab'].includes(curPath)")
        transition(name="opacity")
            water-control-center-panel(v-show="!popStore.getCurrentPop" @change="changeType" :list="list")
    .five-water-num(v-if="currTypeData")
        img.mgr8(src="@/assets/images/sewageTreatment/five-num.svg")
        .right-box
            .top-title-sub.text-20.mgb8(:class='`color-${currTypeData.level}`') {{currTypeData.name}}
            .top-value.num-28(:class='`num-color-${currTypeData.level}`') {{currTypeData.value}}
    .sub-menus(v-if="isShowSubList")
        .map-toggle.bf-blur
            .map-bg
            .toggle
                .item(v-for='item, index in leftNavList[activeIndex].sub' v-show="item.isShow" :class='subActiveIndex === index ? "active" : ""' @click="changeSubMenus(item)" :key="item.src") {{item.name}}
.ppt-view.bf-blur(v-show='showPPT')
    .common-bg
    .panel-content
        .panel-title
            .text {{pptName}}
            .btn
                img.hidden(src='@/assets/images/map/tools/tools-1.svg' @click='closePPT("hide")')
                img.close(src='@/assets/images/map/close.png' @click='closePPT("close")')
        .iframe-wrap
            iframe(frameborder='no' border="0" :src='iframeSrc')
.ppt-hidden(v-show='showPPTMiniSize && !showPPT' @click='() => showPPT = true')
    img(src='@/assets/images/layouts/ppt.png')
</template>

<script lang="ts" setup name="layout-header">
import { useRouter } from 'vue-router'
import type { NavDataType } from './type'
import { useAnalysisStore } from '@/store/analysis'
import { usePopStore, } from '@/store/popControl'
import service from '@/service/api'
const popStore = usePopStore()
const router = useRouter()
const analysisStore = useAnalysisStore()
const navData: NavDataType = reactive({
    leftNavList: [
        { name: '余杭五水智治·多维联动治水', headTitle: '余杭五水智治·多维联动治水', src: '/waterControlCab', index: 0 },
        {
            name: '污水智治',
            headTitle: '污水智治',
            src: '/sewageTreatment',
            index: 1,
            sub: [
                { name: '河湖智管', src: '/RiverLakeIntelligence', index: 0, isShow: true, isShowSubList: true, coutTypeIndex: 1 },
                { name: '水环境质量', src: '/WaterQuality', index: 1, isShow: true, isShowSubList: true, coutTypeIndex: 1 },
                { name: '饮用水源', src: '/DrinkingWaterSource', index: 2, isShow: true, isShowSubList: true, coutTypeIndex: 1 },
                { name: '污水零直排', src: '/SewageDisposal', index: 3, isShow: true, isShowSubList: true, coutTypeIndex: 1 },
                { name: '水质研判分析', src: '/AnalysisWaterQuality', index: 7, isShow: false, headTitle: '水质研判分析', isShowSubList: false },
                { name: '藻类研判分析', src: '/AnalysisOfAlgae', index: 8, isShow: false, headTitle: '藻类研判分析', isShowSubList: false },
                { name: '排污口溯源', src: '/OutletAnalysis', index: 9, isShow: false, headTitle: '排污口溯源', isShowSubList: false },
            ]
        },
        { name: '洪水智防', headTitle: '洪水智防', src: '/FloodIntelligence', index: 2, coutTypeIndex: 2 },
        { name: '涝水智排', headTitle: '涝水智排', src: '/WaterloggingDischarge', index: 3, coutTypeIndex: 3 },
        { name: '供水智保', headTitle: '供水智保', src: '/WaterSupply', index: 4, coutTypeIndex: 4 },
        { name: '节水智抓', headTitle: '节水智抓', src: '/WaterSaving', index: 5, coutTypeIndex: 5 },
        {
            name: '闭环管理',
            headTitle: '闭环管理',
            src: '/closedLoop',
            index: 6,
            sub: [
                { name: '闭环管理主页', src: '/ClosedLoopManagement', index: 0, headTitle: '闭环管理', isShowSubList: false },
                { name: '水环境质量', src: '/ClosedLoopWaterQuality', index: 1, headTitle: '闭环管理·水环境质量', isShowSubList: false },
                { name: '饮用水源地', src: '/ClosedLoopDrink', index: 2, headTitle: '闭环管理·饮用水源地', isShowSubList: false },
                { name: '污水零直排', src: '/ClosedLoopSewage', index: 3, headTitle: '闭环管理·污水零直排', isShowSubList: false },
                { name: '督查在线', src: '/ClosedLoopSupervision', index: 7, headTitle: '闭环管理·督查在线', isShowSubList: false },
            ]
        },
        { name: '五水指数评价结果', headTitle: '', src: '/FiveWaterIndexEvaluationResults', index: 7 },

    ],
    activeIndex: -1,
    subActiveIndex: 0,
    isShowSubList: false,
    curPath: '',
    keySelectList: [
        { label: '余杭区', value: '001' },
        { label: '仁和街道', value: '002' }
    ],
    labelStyle: {
        fontSize: '40px',
        lineHeight: '40px',
        fontFamily: 'PangMenZhengDao'
    },
    selectItemStyle: {
        fontSize: '24px',
        lineHeight: '24px',
        fontFamily: 'PangMenZhengDao'
    },
    list: [
        {
            name: '综合指数',
            value: '90.2',
            key: 'zhzs',
            path: '/FiveWaterIndexEvaluationResults',
            level: 0
        },

        {
            name: '碧水指数',
            value: '89',
            key: 'bszs',
            path: '/sewageTreatment/WaterQuality',
            level: 2
        },
        {
            name: '洪水指数',
            value: '93',
            key: 'hszs',
            path: '/FloodIntelligence',
            level: 1
        },
        {
            name: '涝水指数',
            value: '92',
            key: 'cszs',
            path: '/WaterloggingDischarge',
            level: 1
        },
        {
            name: '供水指数',
            value: '85',
            key: 'gszs',
            path: '/WaterSupply',
            level: 2
        },
        {
            name: '节水指数',
            value: '92',
            key: 'jszs',
            path: '/WaterSaving',
            level: 1
        },

    ],
    showPPT: false,
    pptName: '',
    iframeSrc: '',
    showPPTMiniSize: false,
    navTitle: '余杭五水智治·多维联动治水',
    currTypeData: {
        name: '',
        value: '',
        key: '',
        path: '',
        level: 0
    }
})

/**
 *
 * @param index 索引
 * @desc 切换菜单
 */
const changeNav = (item: typeof navData.leftNavList[0]) => {
    navData.activeIndex = item.index
    // 添加判断，如果有子菜单，跳转至第一个
    if (item.sub?.length)
        router.push(`/${item.src}/${item.sub[item.src === 'sewageTreatment' ? 1 : 0].src}`)
    else
        router.push(`/${item.src}`)
}
/**
 * @name: 二级菜单点击
 * @param {*} item
 */
const changeSubMenus = (item: typeof navData.leftNavList[0]) => {
    navData.subActiveIndex = item.index
    const path = `${navData.leftNavList[navData.activeIndex].src}${item.src}`
    router.push({ path })
}
const countryChange = (item: { value: string; label: string }, index: number) => {
    //
}

const changeType = (val: {
    name: string
    value: string
    key: string
    path: string
    level: number
}) => {
    navData.currTypeData = val
}
// 动态获取ppt name
const getPPTName = async () => {
    //
    const { ppt } = await service<{
        ppt: {
            name: string
        }
    }, true>('common/getPPtName', {
        dataId: 'app',
        group: 'yuhang-screen-web'
    })
    navData.pptName = ppt.name
    navData.iframeSrc = `https://view.officeapps.live.com/op/view.aspx?src=http://yhwszz.fpi-inc.site/file-base-server/api/v1/sys/download/${ppt.name}`
}
getPPTName()
// 显示ppt弹框
const pptView = () => {
    navData.showPPT = true
}
// ppt隐藏和最小化
const closePPT = (type: string) => {
    navData.showPPT = false
    type === 'hide' && (navData.showPPTMiniSize = true)
    type === 'close' && (navData.showPPTMiniSize = false)
}
/**
 * 监听路由变化
 */
watch(
    () => router.currentRoute.value,
    (val) => {
        navData.curPath = val.path
        navData.currTypeData = null
        const navList = [...navData.leftNavList]
        navData.isShowSubList = false
        navList.forEach((item) => {
            if (val.path.includes(item.src)) {
                navData.activeIndex = item.index
                if ('headTitle' in item) navData.navTitle = item.headTitle || ''
                if ('coutTypeIndex' in item) navData.currTypeData = navData.list[item.coutTypeIndex as number]
            }
            if (item.sub?.length) {
                item.sub.forEach((sub) => {
                    if (val.path.includes(item.src + sub.src)) {
                        navData.subActiveIndex = sub.index
                        if (sub.headTitle) navData.navTitle = sub.headTitle
                        navData.isShowSubList = sub.isShowSubList || false
                        if ('coutTypeIndex' in sub) navData.currTypeData = navData.list[sub.coutTypeIndex as number]
                    }
                })
            }
        })
    }
)
/**
 * 监听研判
 */
watch(() => analysisStore.getAnalysisData, (val) => {
    if (val.type) {
        const path = router.currentRoute.value.path
        if (path.includes('OutletAnalysis') && analysisStore.traceability.type) return
        !path.includes(val.type)
        && router.push({
            path: `/sewageTreatment/${val.type}`,
            // query: val.data
        })
    }
    else {
        router.go(-1)
    }
}, { deep: true })
/**
 * 分析溯源
 */
watch(() => analysisStore.traceability, (val) => {
    if (val.type) {
        const path = router.currentRoute.value.path
        !path.includes(val.type)
        && router.push({
            path: `/sewageTreatment/${val.type}`,
            // query: val.data
        })
    }
    else {
        router.go(-1)
    }
}, { deep: true })

/**
 * 返回上一级
 */
const goBack = () => {
    const path = router.currentRoute.value.path
    if (['/sewageTreatment/RiverLakeIntelligence', '/sewageTreatment/WaterQuality', '/sewageTreatment/DrinkingWaterSource', '/sewageTreatment/SewageDisposal'].includes(path)) {
        router.push({ path: '/waterControlCab' })
        return
    }
    if (path.includes('OutletAnalysis')) analysisStore.endTraceability()
    else analysisStore.endAnalysis()
}
const {
    leftNavList,
    list,
    selectItemStyle,
    activeIndex,
    subActiveIndex,
    isShowSubList,
    curPath,
    keySelectList,
    labelStyle,
    iframeSrc,
    showPPT,
    showPPTMiniSize,
    pptName,
    navTitle,
    currTypeData
} = toRefs(navData)
</script>

<style lang="scss" scoped>
.layout-header {
    width: 100%;

    // height: 100%;
}

.top-title-sub {
    color: #27cfff;
}

.top-title {
    position: absolute;
    left: 50%;
    font-family: PangMenZhengDao;
    font-size: 40px;
    font-weight: normal;
    line-height: 60px;
    color: #f0fcff;
    text-align: center;
    text-shadow: 0 4px 8px 0 #00101d;
    letter-spacing: 0.1em;
    transform: translateX(-50%);
}

.ppt-hidden {
    position: absolute;
    bottom: 32px;
    left: 456px;
    z-index: 99;

    img {
        width: 64px;
        height: 64px;
        cursor: pointer;
    }
}

.top-bgc {
    width: 100%;
    height: 74px;
}

.ppt-view {
    position: relative;
    top: 0;
    z-index: 99;
    width: 100%;
    height: 100%;
    margin: 0 auto;

    // border-radius: 20px;
    overflow: hidden;
    color: #fff;

    .common-bg {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
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

            .btn {
                .close {
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                }

                .hidden {
                    width: 20px;
                    height: 20px;
                    margin-right: 12px;
                    cursor: pointer;
                }
            }
        }

        .iframe-wrap {
            position: relative;
            width: 100%;
            height: 100%;
            margin: 0 10px;
            overflow: hidden;

            iframe {
                position: absolute !important;
                top: 43% !important;
                left: 50% !important;
                width: 115% !important;
                height: 110% !important;
                transform: translate(-50%, -50%) !important;
            }
        }
    }
}

.layout-nav {
    position: absolute;
    z-index: 9;
    width: 100%;
    height: 96px;
    padding: 0 32px;
    background: linear-gradient(180deg, rgba(1, 25, 43, 0.8) 0%, rgba(1, 25, 43, 0.6) 53%, rgba(1, 25, 43, 0) 100%);

    .five-water {
        display: flex;
        flex-direction: column;
        align-items: center;

        .top {
            display: flex;
            align-items: center;
            font-family: PangMenZhengDao;
            font-size: 40px;

            .text {
                margin-left: 32px;
            }
        }

        .dec {
            margin-top: 4px;
            font-family: TRENDS;
            font-size: 20px;
            color: #a9e1ff;
        }
    }

    .back {
        display: flex;
        align-items: center;
        width: 200px;

        // flex-shrink: 0;
        cursor: pointer;

        img {
            width: 32px;
            height: 32px;
            margin-right: 12px;
        }

        .text {
            font-family: TRENDS;
            font-size: 14px;
            color: #a9e1ff;
            /* stylelint-disable-next-line color-function-notation */
            text-shadow: 0 2px 2px 0 rgb(2 20 41 / 0.6);
        }
    }

    .analysis-text {
        font-family: PangMenZhengDao;
        font-size: 40px;
    }

    .menus {
        position: absolute;
        left: 6%;
        z-index: -1;
        display: flex;
        align-items: center;
        width: 88%;

        .logo {
            // width: 400px;
            // height: 64px;
            position: relative;

            iframe {
                // position: absolute;
                // left: -190px;
                // top: -32px;
                // width: 800px;
                // height: 128px;
                border: none;
                transform: scale(0.5);
            }
        }

        .menus-list {
            display: flex;

            .menu-item {
                box-sizing: border-box;
                width: 104px;
                height: 40px;
                margin-right: 8px;
                font-family: TRENDS;
                font-size: 18px;
                line-height: 40px;
                color: #a9e1ff;
                text-align: center;
                /* stylelint-disable-next-line color-function-notation */
                text-shadow: 0 2px 2px 0 rgb(4 21 41 / 0.6);
                cursor: pointer;
                /* stylelint-disable-next-line color-function-notation */
                background: linear-gradient(180deg, rgba(54, 144, 240, 0.1) 0%, rgba(0, 212, 255, 0.2) 100%);
                border-color: #008dc5;
                border-style: solid;
                border-width: 1px 0 0;
            }

            .menu-item:last-child {
                margin-right: 24px;
            }

            .active {
                color: #fff;
                /* stylelint-disable-next-line color-function-notation */
                text-shadow: 0 2px 2px 0 rgb(0 11 46 / 0.8);
                /* stylelint-disable-next-line color-function-notation */
                background: linear-gradient(180deg, rgb(0 123 255 / 0) 0%, rgb(29 183 255 / 0.63) 100%);
                border-color: #36bbf0;
                border-style: solid;
                border-width: 1px 0 2px;
            }
        }

        .right {
            .menus-list {
                .menu-item {
                    margin-right: 0;
                    margin-left: 8px;
                }

                .menu-item:first-child {
                    margin-right: 0;
                    margin-left: 24px;
                }
            }
        }
    }

    .user-info {
        display: flex;
        justify-content: flex-end;
        width: 200px;

        img {
            width: 32px;
            height: 32px;
            margin-right: 12px;
            cursor: pointer;
        }

        .info {
            font-family: TRENDS;

            p:nth-child(1) {
                font-size: 14px;
                color: #a9e1ff;
                /* stylelint-disable-next-line color-function-notation */
                text-shadow: 0 2px 2px 0 rgb(2 20 41 / 0.6);
            }

            p:nth-child(2) {
                font-size: 12px;
                /* stylelint-disable-next-line color-function-notation */
                color: rgb(255 255 255 / 0.9);
            }
        }
    }
}

.five-water-num {
    position: absolute;
    top: 104px;
    right: 470px;
    z-index: 9;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 96px;
    background-image: url(../assets/images/panel/panel-1.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;

    img {
        width: 64px;
        height: 64px;
    }

    .top-value {
        color: transparent;
        letter-spacing: 0;
        -webkit-background-clip: text;
        background-clip: text;
    }
}

.sub-menus {
    position: absolute;
    top: 104px;
    left: 50%;
    z-index: 9;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateX(-50%);

    // width: 55%;
}

.map-toggle {
    width: 404px;
    height: 36px;

    .map-bg {
        position: absolute;
        width: 100%;
        height: 36px;
        border-top: 18px solid;
        border-right: 20px solid;
        border-bottom: 18px solid;
        border-left: 20px solid;
        border-image-source: url(@assets/images/map/menu.png);
        border-image-slice: 18 20 18 20 fill;
    }

    .toggle {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 100%;
        height: 100%;
        padding: 0 16px;

        .item {
            flex: 1;
            height: 100%;
            font-family: TRENDS;
            font-size: 16px;
            line-height: 36px;
            text-align: center;
            cursor: pointer;
        }

        .active {
            /* stylelint-disable-next-line color-function-notation */
            background: radial-gradient(49% 49% at 50% 0%, rgb(0 126 255 / 0.7) 0%, rgb(0 126 255 / 0.19) 47%, rgb(0 126 255 / 0) 84%), radial-gradient(50% 50% at 50% 100%, #007eff 0%, rgb(0 48 97 / 0) 100%), linear-gradient(90deg, rgb(0 48 97 / 0) 0%, #003061 50%, rgb(0 48 97 / 0) 99%);
        }
    }
}

.color-1 {
    color: #27cfff;
}

.color-2 {
    color: #36f097;
}

.color-3 {
    color: #f7c706;
}

.color-4 {
    color: #ff8000;
}

.color-5 {
    color: #f84439;
}

.num {
    font-family: Furore;
    font-size: 28px;
    color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
}

.num-color-0 {
    color: #eafbff;
}

.num-color-1 {
    background-image: linear-gradient(to bottom, #eafbff, #00b7ff);
}

.num-color-2 {
    background-image: linear-gradient(to bottom, #fff, #36f097);
}

.num-color-3 {
    background-image: linear-gradient(to bottom, #fff, #f7c706);
}

.num-color-4 {
    background-image: linear-gradient(to bottom, #fff, #ff8000);
}

.num-color-5 {
    background-image: linear-gradient(to bottom, #fff, #f84439);
}
</style>
