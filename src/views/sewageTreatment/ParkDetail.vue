<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:10:52
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-31 17:28:55
 * @Description:
-->
<template lang="pug">
.water-quality
    park-detail-left-panel.tran05( :class="[getPopCom.isPanelAnimation ?  'fold-panel-left' : '']" style="z-index: 10;")
    park-detail-right-panel.tran05(:class="[getPopCom.isPanelAnimation ?  'fold-panel-right' : '']" style="z-index: 10;")
    //- transition(:name="getPopCom.transition")
    //-     component(:is='WaterQualityPopCmp[getPopCom.name]' style="z-index: 9;")
</template>

<script setup lang="ts" name="park-detail">
import { parkData } from './staticData'
import { drawCommonPoint } from '@/utils/map/mapPoint'
import { initHomeView } from '@/components/map/rightTools/tools'
import { usePopStore } from '@/store/popControl'
import { getAssetsFile } from '@/utils/tools'
import MapUtil from '@/utils/map/mapUtils'
import { layerDictionaries } from '@/utils/map/layerSource'
import { useCommonStore } from '@/store/common'
const commonStore = useCommonStore()
const popStore = usePopStore()
popStore.initPop() // 初始化面板弹框数据
const remenberMapStyle = commonStore.getMapStyle
/**
 * @desc: 监听面板点击事件
 */
watch(() => popStore.getPop, (val) => {
    detailPopChange(val)
})
onMounted(() => {
    commonStore.changeMapStyle('img')
    setTimeout(() => {
        addMapParkPoint()
        addCountryMarker(window.glMap)
    }, 1000)
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
    switch (currentPop) {
    case 'BenchmarkingParkLayer': // 标杆生活小区
        addMapParkPoint()
        break
    default:
        addMapParkPoint()
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
const addMapParkPoint = () => {
    const list = parkData.features.map((item) => {
        const radom = Math.floor(Math.random() * 5) + 1
        const coor = item.geometry.coordinates
        return {
            name: item.properties.Name,
            longitude: coor[0],
            latitude: coor[1] + 0.02,
            controlLevel: `00${radom}`,
            level: radom
        }
    })
    drawCommonPoint([{
        code: 1,
        name: '园区详情点位',
        data: list as any
    }], layerDictionaries.PARK_DETAIL_POINT, undefined, true)

    // setMapPoint(list, 'map/waterQuality', ['0', '1', '2', '3', '4', '5', '6'], 'parkWaterQuality', 'parkWaterQuality-point', 'MapPointWarningPop')
}

/**
 * 绘制园区管网
 */
const addCountryMarker = (map: any) => {
    flyTo()
    MapUtil._showOrHideMapLayerById([layerDictionaries.MAP_BOUNDARY_FILL, layerDictionaries.MAP_BOUNDARY_LINE, layerDictionaries.MAP_BOUNDARY_SHADOW], 'hide')
    const el = document.createElement('div')
    el.className = 'country-marker-content'
    el.innerHTML = `<div style="position: relative;">
        <img src="${getAssetsFile('park/pie.png')}" style="position: absolute;top:70px;left:0;transform: scale(1);"/>
        <img src="${getAssetsFile('park/round.png')}" />
        </div>`
    const coor = [119.969159547273, 30.2411609482]
    if (!window.countryMarker) window.countryMarker = {}
    let marker = window.countryMarker['park-road']
    if (marker) {
        marker.remove()
        marker = null
    }
    window.countryMarker['park-road'] = new mapboxgl.Marker(el)
        .setLngLat([coor[0], coor[1] + 0.02])
        .addTo(map)
}

const flyTo = () => {
    window.glMap.flyTo({
        center: [119.969159547273492, 30.260760948238307],
        zoom: 16.2,
        bearing: 0,
        pitch: 0,
    })
}
onUnmounted(() => {
    // 清除点位
    MapUtil._showOrHideMapLayerById([layerDictionaries.MAP_BOUNDARY_FILL, layerDictionaries.MAP_BOUNDARY_LINE, layerDictionaries.MAP_BOUNDARY_SHADOW], 'show')
    MapUtil._removeHtmlMarker(window.countryMarker)
    MapUtil._removeLayerById(layerDictionaries.PARK_DETAIL_POINT)
    initHomeView()
    // 用于触发mapcontrol的监听重新绘制点位
    setTimeout(() => {
        commonStore.changeMapStyle(remenberMapStyle)
    })
})
</script>

<style lang="scss" scoped>
.water-quality {
    font-size: 14px;
}
</style>
