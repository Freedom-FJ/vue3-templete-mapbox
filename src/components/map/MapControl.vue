<!--
 * @Author: mjh
 * @Date: 2022-09-26 18:38:55
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-20 23:29:28
 * @Description:
-->
<template lang="pug">
MapLegend(@monitoringMethodsChange="monitoringMethodsChange" @controlLevelChange="controlLevelChange" v-show="isShowLegend")
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { LayerCodeTs, LayerSelectDataTs } from '@/types/map'
import { drawLayerStaticByDom } from '@/utils/map/mapPoint'
import { useMapStore } from '@/store/map'
import { staticDataPoint } from '@/views/staticData'
import { layerDictionaries } from '@/utils/map/layerSource'
import { useAxiosStore } from '@/store/axios'
import { useCommonStore } from '@/store/common'
import MapUtil from '@/utils/map/mapUtils'
const router = useRouter()
const mapStore = useMapStore()
const data = reactive({
    layerData: null,
    monitoringMethods: [] as string[],
    controlLevelList: [1, 2, 3, 4, 5, 6] as number[],
    isShowLegend: true, // 是否显示图例
    routerPath: ''
})

watch(() => mapStore.getMapLayer, (layer) => {
    const layerRaw = toRaw(layer)
    detailLayerChange(layerRaw)
}, { deep: true })

/**
 * @name: 监听路由切换默认选择不同图层
 */
watch(() => router.currentRoute.value, (val) => {
    mapStore.setCheckMapLayer()
    hiddenAllPointLayer()
    // 拦截地图请求 防止点位无法清除
    useAxiosStore().clearIntercept()
    nextTick(() => {
        data.routerPath = val.path
        detailRouterPathToLayer()
    })
})
// 地图模式切换刷新点位
watch(() => useCommonStore().getMapStyle, () => {
    mapStore.setCheckMapLayer() // 清除图层选中效果
    hiddenAllPointLayer()
    // 拦截地图请求 防止点位无法清除
    useAxiosStore().clearIntercept()
    nextTick(() => {
        detailRouterPathToLayer()
    })
})
/**
 * @name: 处理路由对应图层
 * @param {*} path 路由地址
 */
const detailRouterPathToLayer = () => {
    switch (data.routerPath) {
    case '/sewageTreatment/WaterQuality':
    case '/sewageTreatment/DrinkingWaterSource':
    case '/sewageTreatment/SewageDisposal':
        mapStore.setCheckMapLayer('40')
        break
    default:
        break
    }
}

const detailLayerChange = (layer: LayerSelectDataTs) => {
    const currLayerCodeObj = currCheckLayer(layer)
    console.log('这是选中的图层code可以全局控制并绘制点位：', currLayerCodeObj)
    currLayerCodeObj[1].length && drawLayerStaticByDom(layerDictionaries.MAP_COMMON_POINT, staticDataPoint) // 示例代码 请删除
}
const currCheckLayer = (layer: LayerSelectDataTs) => {
    const checkLayerCode: Partial<Record<LayerCodeTs, string[]>> = {}
    for (const key in layer)
        checkLayerCode[key as LayerCodeTs] = mapStore.getMapLayer[key as LayerCodeTs].checkedList
    return checkLayerCode as Record<LayerCodeTs, string[]>
}

/**
 * @name: 手工自动筛选
 * @param {*} monitoringList
 * @return {*}
 */
const monitoringMethodsChange = (monitoringList: string[]) => {
    console.log(monitoringList, 'monitoringMethodsChange')
}

/**
 * @name: 筛选点位等级
 * @param {*} val 等级选择项
 */
const controlLevelChange = (val: number[]) => {
    console.log(val, 'controlLevelChange')
}

const hiddenAllPointLayer = () => {
    MapUtil._showOrHideMapLayerById([layerDictionaries.MAP_COMMON_POINT, layerDictionaries.ANALYSIS_DISTANCE_POINT, layerDictionaries.CAMERA_UN_CLUSTER], 'hide')
}

const { isShowLegend } = toRefs(data)
</script>
