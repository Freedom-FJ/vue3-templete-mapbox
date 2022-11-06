<!--
 * @Author: Tian
 * @Date: 2022-09-05 09:18:53
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-11 18:37:27
 * @Description: 饮用水
-->
<template lang="pug">
.drink-water-source
    drinking-water-source-left.tran05( :class="[popStore.getCurrentPop ?  'fold-panel-left' : '']" style="z-index: 10;")
    drinking-water-source-right.tran05(:class="[popStore.getCurrentPop ?  'fold-panel-right' : '']" style="z-index: 10;")
    transition(:name="getPopCom.transition")
        component(:is='drinkingWaterSourcePopCmp[getPopCom.name]' style="z-index: 9;" :propsData='popStore.getPop')
</template>

<script setup lang="ts">
import dataJson from '@static/json/data.json'
import { setMapPoint } from './map'
import { useAnalysisStore } from '@/store/analysis'
import type { JSONDataTs } from '@/types/common'
import MapUtil from '@/utils/map/mapUtils'
import type { AlgaeFactorGroupRes } from '@/components/sewageTreatment/analysisOfAlgae/type'
import service from '@/service/api'
import { useMapStore } from '@/store/map'
import { usePopStore } from '@/store/popControl'
import { showMapPop } from '@/utils/map/mapInit'
import { layerDictionaries } from '@/utils/map/layerSource'
import { getFactorGroupList } from '@/utils/commonMethods/factor'
import drinkingWaterSourcePopCmp from '@/components/sewageTreatment/drinkingWaterSource/popup'
const popStore = usePopStore()
popStore.initPop() // 初始化面板弹框数据
const analysisStore = useAnalysisStore()
const mapStore = useMapStore()

/**
 * @desc: 监听面板点击事件
 */
watch(() => popStore.getPop, (val) => {
    detailPopChange(val)
})
watch(() => analysisStore.analysis, (val) => {
    analysisStore.setRemember({
        pop: popStore.getPop,
        popPoint: val.data
    })
}, { deep: true })

onMounted(() => {
    if (analysisStore.analysisRemember)
        detailRemeberAnalysis()
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
    MapUtil._removeMapboxPopup()
    hideMapLayers()
    mapStore.controlMapLayerHandle = ''
    switch (currentPop) {
    case 'ReminderTodayPop': // 今日提醒
        // popData 1: 手工 0: 自动
        addAlgaePoint(popData)
        break
    case 'FloodProtectionPopup': // left 雨量超警
        break
    case 'PondingPopup': // right 积水
        break
    case 'FloodPopup': // right 洪水
        break
    default:
        mapStore.controlMapLayerHandle = '饮用水'
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
    const transition = 'opacity-left'
    return {
        name,
        transition
    }
})
/**
 * 添加地图点位
 */
const addMapPoint = () => {
    const list = (dataJson as JSONDataTs).features.map((item) => {
        const radom = Math.floor(Math.random() * 5)
        const coor = turf.centroid(item).geometry.coordinates
        return {
            name: item.properties?.Name ?? '',
            longitude: coor[0],
            latitude: coor[1] + 0.02,
            symbolImgName: `drinkWater-${radom}`
        }
    })
    setMapPoint(list, 'map/drinkWater', ['0', '1', '2', '3', '4', '5'], 'drinkWater', layerDictionaries.MAP_COMMON_POINT, 'AlgaeWarningPointPop')
}
/**
 * 在地图上添加藻类点位--自动or手工
 */
const addAlgaePoint = async (popData: number) => {
    const { id } = await getFactorGroupList('algae') as AlgaeFactorGroupRes
    const res = await service(popData === 0 ? 'drinkingWaterSource/algaeRealStat' : 'drinkingWaterSource/algaeRealStatHandle', {
        factorGroupId: popData === 0 ? '' : id
    })
    const resiltList: any = res?.data || []
    resiltList.forEach((item: Record<string, any>) => {
        // 根据叶绿素a因子值判断图标颜色
        item.symbolImgName = 'algaeMonitoring-zaolei'
        for (let i = 0; i < (item[popData ? 'pollutants' : 'factorDatas'] && item[popData ? 'pollutants' : 'factorDatas'].length); i++) {
            if (item[popData ? 'pollutants' : 'factorDatas'][i].code === 'w01016') {
                if (Number(item[popData ? 'pollutants' : 'factorDatas'][i].value) > 15)
                    item.symbolImgName = Number(item[popData ? 'pollutants' : 'factorDatas'][i].value) > 15 ? 'algaeMonitoring-zaolei_yellow' : 'algaeMonitoring-zaolei'
                break
            }
        }
    })
    setMapPoint(resiltList, 'map/algaeMonitoring', ['zaolei', 'zaolei_yellow'], 'algaeMonitoring', layerDictionaries.ALGAE_MONITORING_POINT, 'AlgaeWarningPointPop')
}

/**
 * @name: 处理研判分析记住的退回状态
 * @return {*}
 */
const detailRemeberAnalysis = () => {
    MapUtil._initHomeView()
    const { analysisRemember } = analysisStore
    if (!analysisRemember) return
    setTimeout(() => {
        analysisRemember.pop.currentPop && popStore.upDatePopup(analysisRemember.pop)
        nextTick(() => {
            showMapPop('AlgaeWarningPointPop', analysisRemember.popPoint, [+analysisRemember.popPoint.longitude, +analysisRemember.popPoint.latitude])
        })
        analysisStore.clearRemenber()
    }, 600)
}
// 移除多个图层
const hideMapLayers = () => {
    MapUtil._showOrHideMapLayerById([layerDictionaries.MAP_COMMON_POINT, layerDictionaries.ALGAE_MONITORING_POINT], 'hide')
}
const getVideoList = async () => {
    //
    const res = await service('common/getVideoList', {
        cameraType: '020,019,021',
        type: 'source'
    })
    console.log(res)
}

onUnmounted(() => {
    // 清除点位
    if (window.glMap.getLayer(layerDictionaries.MAP_COMMON_POINT)) window.glMap.removeLayer(layerDictionaries.MAP_COMMON_POINT)
    MapUtil._removeMapboxPopup()
    hideMapLayers()
})
</script>

<style lang="scss" scoped></style>
