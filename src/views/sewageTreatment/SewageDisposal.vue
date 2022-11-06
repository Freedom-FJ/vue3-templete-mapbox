<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:10:52
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-08 11:25:55
 * @Description:
-->
<template lang="pug">
.water-quality
    sewage-disposal-left-panel.tran05( :class="[getPopCom.isPanelAnimation ?  'fold-panel-left' : '']" style="z-index: 10;")
    sewage-disposal-right-panel.tran05(:class="[getPopCom.isPanelAnimation ?  'fold-panel-right' : '']" style="z-index: 10;")
    pipe-network-legend
    //- transition(:name="getPopCom.transition")
    //-     component(:is='WaterQualityPopCmp[getPopCom.name]' style="z-index: 9;")
</template>

<script setup lang="ts" name="SewageDisposal">
import dataJson from '@static/json/data.json'
import { setMapPoint } from './map'
import type { JSONDataTs } from '@/types/common'
import { useRouterControlStore } from '@/store/routerControl'
import { useMapStore } from '@/store/map'
import { usePopStore } from '@/store/popControl'
// import SewageDisposalPopCmp from '@/components/sewageTreatment/sewageDisposal/popup'
import MapUtil from '@/utils/map/mapUtils'
import { layerDictionaries } from '@/utils/map/layerSource'

const mapStore = useMapStore()
const popStore = usePopStore()
popStore.initPop() // 初始化面板弹框数据

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
    hidePoint()
    if (currentPop) MapUtil._removeMapboxPopup()
    mapStore.controlMapLayerHandle = ''
    switch (currentPop) {
    case 'BenchmarkingParkLayer': // 标杆生活小区
        addMapParkPoint()
        break
    default:
        // addMapPoint()
        nextTick(() => {
            mapStore.controlMapLayerHandle = ['重点源', '非重点源']
        })
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
    const name = popStore.getCurrentPop
    const transition = popStore.getCurrentPop === 'WarningCheckPop' ? 'opacity' : 'opacity-left'
    const isPanelAnimation = !((popStore.getCurrentPop === 'WarningCheckPop' || !popStore.getCurrentPop))
    return {
        name,
        transition,
        isPanelAnimation
    }
})
/**
 * 添加地图点位
 */
const addMapPoint = () => {
    hidePoint()
    const list = (dataJson as JSONDataTs).features.map((item) => {
        const radom = Math.floor(Math.random() * 6)
        const coor = turf.centroid(item).geometry.coordinates
        return {
            name: item.properties?.Name,
            longitude: coor[0],
            latitude: coor[1] + 0.02,
            symbolImgName: `SewageDisposal-${radom}`
        }
    })
    setMapPoint(list, 'map/waterQuality', ['0', '1', '2', '3', '4', '5', '6'], 'SewageDisposal', 'SewageDisposal-point', 'MapPointWarningPop')
}
const goToDetail = (e: any) => {
    const routerControl = useRouterControlStore()
    routerControl.push({ path: '/sewageTreatment/ParkDetail', data: e.features[0].properties })
}
/**
 * 园区
 */
const addMapParkPoint = () => {
    const list = (dataJson as JSONDataTs).features.map((item) => {
        const coor = turf.centroid(item).geometry.coordinates
        return {
            name: item.properties?.Name,
            longitude: coor[0],
            latitude: coor[1] + 0.02,
            symbolImgName: 'park'
        }
    })
    setMapPoint(list, 'map', ['park'], '', layerDictionaries.PARK_POINT, goToDetail)
}

const hidePoint = () => {
    MapUtil._showOrHideMapLayerById([layerDictionaries.PARK_POINT, layerDictionaries.MAP_COMMON_POINT], 'hide')
}

onUnmounted(() => {
    // 清除点位
    MapUtil._removeLayerById(layerDictionaries.PARK_POINT)
    MapUtil._removeMapboxPopup()
    hidePoint()
})
</script>

<style lang="scss" scoped>
.water-quality {
    font-size: 14px;
}
</style>
