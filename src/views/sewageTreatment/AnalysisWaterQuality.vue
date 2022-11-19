<!--
 * @Author: Tian
 * @Date: 2022-09-06 08:57:18
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-09 20:21:39
 * @Description:
-->

<template lang="pug">
.analysis-algae
    AnalysisPanel(@showDetail="showDetail")
    AnalysisWaterQualityLeft.tran05( :class="[getPopCom.name ?  'fold-panel-left' : '']" style="z-index: 10;")
    AnalysisWaterQualityRight.tran05( :class="[getPopCom.name ?  'fold-panel-right' : '']" style="z-index: 10;")
    AnalysisWaterQualityCenter.tran05( :class="[getPopCom.name ?  'fold-panel-bottom' : '']" style="z-index: 10;")
    UnmannedBoatInspection(v-if='showInspect === 0')
    RuleByRiver(v-if='showInspect === 1')
    transition(:name="getPopCom.transition")
        component(:is='WaterQualityPopCmp[getPopCom.name]' style="z-index: 9;")
    WarningCheckPop.bf-blur( v-model="WaringDetailData" v-if="WaringDetailData" style="right: 20%;top: 10%;z-index:9;")
</template>

<script setup lang="ts">
import Nearby from '@/utils/map/mapBox-circle'
import WaterQualityPopCmp from '@/components/sewageTreatment/analysisWaterQuality/popup'
import MapUtil from '@/utils/map/mapUtils'
import { usePopStore } from '@/store/popControl'
import { useAnalysisStore } from '@/store/analysis'

const analysisStore = useAnalysisStore()
const popStore = usePopStore()
popStore.initPop() // 初始化面板弹框数据

const data = reactive({
    circleObject: {} as any,
    showInspect: -1,
    WaringDetailData: null as record | null
})

/**
 * @desc: 监听面板点击事件
 */
watch(() => popStore.getPop, (val) => {
    detailPopChange(val)
})

/**
 * @name: 面板点击事件处理
 * @desc:
 * @param {*} val
 * @param {*} popData
 * @return {*}
 */
const detailPopChange = (val: { currentPop: string; popData?: any }) => {
    const { popData, currentPop } = val
    if (currentPop) MapUtil._removeMapboxPopup()
    data.showInspect = -1

    switch (currentPop) {
    case 'ProblemQuartersPop': // 异常入河排污口, 问题小区，问题园区
        break
    case 'showOrHideInspectPop': // 巡查服务
        data.showInspect = popData
        break
    default:
        break
    }
}
/**
 * @name: 面板弹框显示控制
 * @computed
 * @return {
 *      name: 当前显示的弹框的名称
 *      transition: 当前显示动画名称
 * }
 */
const getPopCom = computed(() => {
    const name = popStore.getCurrentPop === 'showOrHideInspectPop' ? '' : popStore.getCurrentPop
    const transition = popStore.getCurrentPop === 'showOrHideInspectPop' ? '' : 'opacity-right'
    return {
        name,
        transition
    }
})
/**
 * 绘制圆圈
 * @param lnglat 经纬度
 * @param radius 半径 米
 */
const drawCircle = (lnglat: number[], radius: number) => {
    const pollutantNearby = new Nearby('', {
        name: 'pollutantNearby',
        contaniereId: 'app',
        lnglat,
        analyse: (val: Record<string, any>) => {
            analysisStore.analysis.distance = val.radius
        },
        radius
    })
    return pollutantNearby
}
const showDetail = () => {
    data.WaringDetailData = analysisStore.analysis.data
}
watch(() => {
    return {
        dataTime: analysisStore.analysis.dateTime,
        distance: analysisStore.analysis.distance
    }
}, () => {
    if (!analysisStore.analysis.data.latitude) return
    setTimeout(() => {
        data.circleObject = drawCircle([Number(analysisStore.analysis.data.longitude), Number(analysisStore.analysis.data.latitude)], analysisStore.analysis.distance)
    })
}, { immediate: true })

onUnmounted(() => {
    // 移除圆圈
    data.circleObject && data.circleObject.hide()
    // 返回主视图
    MapUtil._initHomeView()
})
const { showInspect, WaringDetailData } = toRefs(data)
</script>

<style lang="scss" scoped>
.inspect {
    position: absolute;
    top: 140px;
    left: 50%;
    z-index: 999;
    width: 1280px;
    margin-left: -640px;
}
</style>

<style lang="scss">
.nearby-search-control {
    position: absolute;
    z-index: 990;
    width: 24px;
    height: 20px;
    font-size: 12px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    cursor: move;
    background: #000;
    border-radius: 10px;

    .pop-box {
        position: absolute;
        top: 0;
        left: 50%;
    }

    &::before {
        position: absolute;
        top: 4px;
        left: 0;
        width: 12px;
        height: 12px;
        content: "";
        background-image: url("@/assets/images/left2.svg");
        background-repeat: no-repeat;
        background-size: 12px 12px;
    }

    &::after {
        position: absolute;
        top: 4px;
        right: 0;
        width: 12px;
        height: 12px;
        content: "";
        background-image: url("@/assets/images/right2.svg");
        background-repeat: no-repeat;
        background-size: 12px 12px;
    }

    .inner {
        position: absolute;
        top: 50%;
        left: 25px;
        height: 24px;
        padding: 0 6px;
        overflow: hidden;
        line-height: 24px;
        text-align: center;
        white-space: nowrap;
        background: #000;
        border: 0;
        border-radius: 100px;
        /* stylelint-disable-next-line color-function-notation */
        box-shadow: 0 0 4px 0 rgb(0 0 0 / 0.2);
        transform: translateY(-50%);
    }

    .inner-new {
        position: relative;
        width: 76px;
        height: 24px;
        overflow: visible;
        cursor: pointer;
        background-color: #000;
        border-radius: 12px;

        .el-dropdown {
            position: relative;
            width: 76px;
            cursor: pointer;
        }
    }
}
</style>

