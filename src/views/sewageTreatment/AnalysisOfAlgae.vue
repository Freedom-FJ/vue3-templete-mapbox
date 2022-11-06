<!--
 * @Author: Tian
 * @Date: 2022-09-06 08:57:18
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-27 17:47:37
 * @Description:
-->

<template lang="pug">
.analysis-algae
    AnalysisOfAlgaeLeft
    AnalysisOfAlgaeRight
    AnalysisOfAlgaeCenter
</template>

<script setup lang="ts">
import Nearby from '@/utils/map/mapBox-circle'
import MapUtil from '@/utils/map/mapUtils'
import { useAnalysisStore } from '@/store/analysis'
import { layerDictionaries } from '@/utils/map/layerSource'
const analysisStore = useAnalysisStore()
const data = reactive({
    circleObject: {} as any
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
            console.log(val, 'vvv')
        },
        radius
    })
    return pollutantNearby
}
watch(() => {
    return {
        dataTime: analysisStore.analysis.dateTime,
        distance: analysisStore.analysis.distance
    }
}, () => {
    if (!analysisStore.analysis.data.latitude) return
    data.circleObject = drawCircle([Number(analysisStore.analysis.data.longitude), Number(analysisStore.analysis.data.latitude)], analysisStore.analysis.distance)
}, { immediate: true })
// 组件销毁
onUnmounted(() => {
    // 移除圆圈
    data.circleObject && data.circleObject.hide()
    // 返回主视图
    MapUtil._initHomeView()
    if (window.glMap.getLayer(layerDictionaries.ANALYSIS_DISTANCE_POINT)) window.glMap.removeLayer(layerDictionaries.ANALYSIS_DISTANCE_POINT)
})
</script>

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
