<!--
 * @Author: mjh
 * @Date: 2022-09-26 18:38:55
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-04 15:48:35
 * @Description:
-->
<template lang="pug">
MapLegend(@monitoringMethodsChange="monitoringMethodsChange" @controlLevelChange="controlLevelChange" v-show="isShowLegend")
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { cloneDeep } from 'lodash-es'
import type { mapPointNewLayerTs } from '@/types/common'
import { drawCommonPoint, getAllPoint, preloadImageAnalysis } from '@/utils/map/mapPoint'
import { useMapStore } from '@/store/map'
import { getAllWarningPoint } from '@/views/sewageTreatment/analysisMap'
import { getSetTreeCode } from '@/utils/treeDataUtils'
import type { MainParams, returnPointTypeDataTs } from '@/utils/map/mapPoint'
import { layerDictionaries } from '@/utils/map/layerSource'
import { useAxiosStore } from '@/store/axios'
import { useAnalysisStore } from '@/store/analysis'
import { useCommonStore } from '@/store/common'
import MapUtil from '@/utils/map/mapUtils'

// 控制流程 ：
// 1. 监听路由切换 ==> 处理对应地址 ==> 修改controlMapLayerHandle值 ==>
// MapLayerVue.vue 监听到值改变改变图层树选中效果，并修改全局图层选中数据mapStore.getMapLayerSelectedSites ==> MapControl.vue监听到图层树变化调用接口获取点位并绘制
// 2. 页面手动修改controlMapLayerHandle值 逻辑同上一致

// MapControl.vue： 处理地图点位渲染
// MapLayerVue.vue： 处理地图点位的图层树工具，选中与不选中，以及生成mapStore.getMapLayerSelectedSites 数据

const router = useRouter()
const mapStore = useMapStore()
const analysisStore = useAnalysisStore()
const data = reactive({
    layerData: null as null | mapPointNewLayerTs,
    monitoringMethods: [] as string[],
    rememberLayerData: [] as returnPointTypeDataTs,
    controlLevelList: [1, 2, 3, 4, 5, 6] as number[],
    isAnalysis: false, // 是否是研判分析页面（不同点绘制点位研判分析需要绘制圆圈点位，其他的绘制锥形点位）
    isShowLegend: true, // 是否显示图例
    routerPath: ''
})

/**
 * @name: 监听地图选择图层
 */
watch(() => mapStore.getMapLayerSelectedSites, (val) => {
    data.layerData = val
    MapUtil._removeMapboxPopup()
    if (!data.isAnalysis) initLayer()
    else getAnalysisData()
}, { deep: true })
/**
 * @name: 监听路由切换默认选择不同图层
 */
watch(() => router.currentRoute.value, (val) => {
    mapStore.controlMapLayerHandle = ''
    data.isAnalysis = false
    data.isShowLegend = true
    hiddenAllPointLayer()
    // 拦截地图请求 防止点位无法清除
    useAxiosStore().clearIntercept()
    nextTick(() => {
        data.routerPath = val.path
        detailRouterPathToLayer()
    })
})
// 地图模式切换刷新 点位
watch(() => useCommonStore().getMapStyle, () => {
    mapStore.controlMapLayerHandle = ''
    data.isAnalysis = false
    data.isShowLegend = true
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
    case '/sewageTreatment/AnalysisWaterQuality':
    case '/sewageTreatment/AnalysisOfAlgae':
        data.isAnalysis = true
        data.isShowLegend = false
        preloadImageAnalysis()
        mapStore.controlMapLayerHandle = '水环境'
        break
    case '/sewageTreatment/WaterQuality':
    case '/sewageTreatment/RiverLakeIntelligence':
    case '/RiverLakeIntelligence':
        mapStore.controlMapLayerHandle = '水环境'
        break
    case '/sewageTreatment/DrinkingWaterSource':
        mapStore.controlMapLayerHandle = '饮用水'
        break
    case '/sewageTreatment/SewageDisposal':
        mapStore.controlMapLayerHandle = ['重点源', '非重点源']
        break
    case '/closedLoop/ClosedLoopManagement':
        data.isShowLegend = false
        break
    default:
        break
    }
}
/**
 * @name: 绘制初始化点位
 */
const initLayer = async () => {
    const treeData = await getSetTreeCode()
    const params: MainParams = {
        monitoringMethods: data.monitoringMethods.join(','),
        treeType: 1,
        treeId: treeData.slice(0, 6),
        factorFlag: true,
        exceptionFlag: false
    }
    if (!data.layerData) return
    const mapData = await getAllPoint(data.layerData, params)
    data.rememberLayerData = mapData
    fiterMapData()
}

/**
 * @name: 处理研判分析页面的点位绘制
 * @desc: 绘制的图标是原点
 */
const getAnalysisData = async () => {
    if (!data.layerData) return
    const staticUse = {
        longitude: Number(analysisStore.analysis.data.longitude),
        latitude: Number(analysisStore.analysis.data.latitude),
        distance: analysisStore.analysis.distance,
        alarmTime: Number(analysisStore.analysis.data.dataTime),
        queryTimeType: analysisStore.analysis.data.timeType || '',
    }
    const layerData = await getAllWarningPoint(data.layerData, staticUse)
    // 当水质研判分析时需要使用地图点位数据的汇总
    if (data.routerPath === '/sewageTreatment/AnalysisWaterQuality') {
        const pointData = layerData.map((item) => {
            return item.data.map(deepItem => deepItem.id)
        }).flat(1).join(',')
        const accessCodeList = layerData.map((item) => {
            return item.data.map(deepItem => deepItem.accessCode)
        }).flat(1).join(',')
        analysisStore.upDataDetail({ pointData, accessCodeList })
    }
    drawCommonPoint(layerData, layerDictionaries.ANALYSIS_DISTANCE_POINT, undefined, false)
}
/**
 * @name: 手工自动筛选
 * @param {*} monitoringList
 * @return {*}
 */
const monitoringMethodsChange = (monitoringList: string[]) => {
    data.monitoringMethods = monitoringList
    initLayer()
}
/**
 * @name: 过滤地表水水质类别方法
 */
const fiterMapData = () => {
    const layerData: returnPointTypeDataTs = cloneDeep(data.rememberLayerData)
    data.controlLevelList.length !== 6 && layerData.forEach((item) => {
        if (['1', '40', 'border', '58'].includes(item.code.toString()))
            item.data = item.data.filter(layer => layer.level ? data.controlLevelList.includes(layer.level) : false)
    })
    drawCommonPoint(layerData, layerDictionaries.MAP_COMMON_POINT, undefined, true)
}
/**
 * @name: 筛选点位水质等级
 * @param {*} val 水质登记选择项
 */
const controlLevelChange = (val: number[]) => {
    data.controlLevelList = val
    fiterMapData()
}
const hiddenAllPointLayer = () => {
    MapUtil._showOrHideMapLayerById([layerDictionaries.MAP_COMMON_POINT, layerDictionaries.ANALYSIS_DISTANCE_POINT, layerDictionaries.CAMERA_UN_CLUSTER], 'hide')
}
/**
 * @name: 监听研判分析
 */
watch(() => {
    return {
        dataTime: analysisStore.analysis.dateTime,
        distance: analysisStore.analysis.distance
    }
}, () => {
    if (!analysisStore.analysis.data.latitude) return
    getAnalysisData()
}, { immediate: true })
const { isShowLegend } = toRefs(data)
</script>
