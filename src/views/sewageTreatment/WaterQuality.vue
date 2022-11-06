<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:10:52
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-11 18:33:02
 * @Description:
-->
<template lang="pug">
.water-quality
    water-quality-left-panel.tran05( :class="[getPopCom.isPanelAnimation ?  'fold-panel-left' : '']" style="z-index: 10;")
    water-quality-right-panel.tran05(:class="[getPopCom.isPanelAnimation ?  'fold-panel-right' : '']" style="z-index: 10;" :yearWaringData="waringPointList")
    transition(:name="getPopCom.transition")
        component(:is='WaterQualityPopCmp[getPopCom.name]' style="z-index: 9;")
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { drawCommonPoint, getAllPoint, setMapPointDomToImage } from '@/utils/map/mapPoint'
import { usePopStore } from '@/store/popControl'
import { useMapStore } from '@/store/map'
import MapUtil from '@/utils/map/mapUtils'
import type { waterQualityPointTs } from '@/types/waterQuality'
import type { mapPointNewLayerTs } from '@/types/common'
import { getSetTreeCode } from '@/utils/treeDataUtils'
import type { MainParams } from '@/utils/map/mapPoint'
import { showMapPop } from '@/utils/map/mapInit'
import { layerDictionaries } from '@/utils/map/layerSource'
import WaterQualityPopCmp from '@/components/sewageTreatment/waterQuality/popup'
import { useAnalysisStore } from '@/store/analysis'
import service from '@/service/api'
import { useAxiosStore } from '@/store/axios'
const mapStore = useMapStore()
const analysisStore = useAnalysisStore()
const popStore = usePopStore()
popStore.initPop() // 初始化面板弹框数据
const data = reactive({
    layerData: null as null | mapPointNewLayerTs,
    monitoringMethods: '',
    waringPointList: [] as waterQualityPointTs[]
})
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

onMounted(async () => {
    await getSiteWarningPointData()

    if (analysisStore.analysisRemember)
        detailRemeberAnalysis()
})
onUnmounted(() => {
    MapUtil._removeMapboxPopup()
    // 清除点位
    hideAllLayer()
})

/**
 * @name: 面板点击事件处理
 * @desc:
 * @param {*} val
 * @param {*} popData
 * @return {*}
 */
const detailPopChange = async (val: { currentPop: string; popData?: any }) => {
    const { popData, currentPop } = val
    MapUtil._removeMapboxPopup()
    data.monitoringMethods = ''
    mapStore.controlMapLayerHandle = ''
    hideAllLayer()
    switch (currentPop) {
    case 'EarlyWarningEventPop': // right 预警事件
        useAxiosStore().clearIntercept()
        renderEarlyWarningMarker(data.waringPointList, layerDictionaries.ANALYSIS_EVEN_POINT)
        break
    case 'StatusDistributionPop': // right 布点现状
        nextTick(() => {
            detailCurrLayerType(popData)
        })
        break
    default:
        nextTick(() => {
            mapStore.controlMapLayerHandle = '水环境'
        })
        break
    }
}

const detailCurrLayerType = async (popData: { type: number; isHandle: boolean }) => {
    const { type, isHandle } = popData
    data.monitoringMethods = isHandle ? '1' : '0'
    if (!type) {
        nextTick(() => {
            initLayer()
        })
    }
    else if (type === 1) {
        mapStore.controlMapLayerHandle = {
            重点源: ['废水排污口'],
            非重点源: ['废水排污口']
        }
    }
    else {
        mapStore.controlMapLayerHandle = {
            重点源: ['入河排污口'],
            非重点源: ['入河排污口'],
        }
    }
}
/**
 * @name: 绘制初始化点位
 */
const initLayer = async () => {
    const treeData = await getSetTreeCode()
    const params: MainParams = {
        monitoringMethods: data.monitoringMethods,
        treeType: 1,
        treeId: treeData.slice(0, 6),
        factorFlag: true,
        exceptionFlag: false
    }
    const mapData = await getAllPoint(mapStore.getMapLayerSelectedSites, params)
    drawCommonPoint(mapData, layerDictionaries.MAP_COMMON_POINT, undefined, true)
}

/**
 * @name: 获取地图水质预警点位
 */
const getSiteWarningPointData = async () => {
    const startTime = dayjs().startOf('year').valueOf()
    const endTime = dayjs().valueOf()
    const params = {
        startTime,
        endTime,
        envTypeCodeList: [
            'water'
        ],
        siteTypeCodeList: [],
        // siteTypeCodeList: [
        //     '001',
        //     '002',
        //     '003',
        //     '004',
        //     '005'
        // ],
        regionCode: '330110000000'
    }
    const res = await service<waterQualityPointTs[]>('waterQuality/queryAlarmIdsAggregatedPC', params)
    const resData = res.data || []
    data.waringPointList = resData
}

// // 研判预警动态Marker(点击事件)
const renderEarlyWarningMarker = (dataList: waterQualityPointTs[], layer: string) => {
    if (!window.glMap.isMoving()) window.glMap.jumpTo({ center: window.glMap.getCenter() }) // 此句看似无用，但解决一个奇怪的问题
    // 过滤掉为null的经纬度
    dataList = dataList.filter((o) => {
        return o.longitude && o.latitude
    })
    const checkPointList: number[][] = []
    dataList.forEach((item) => {
        const coordinates = [+item.longitude, +item.latitude]
        item.longitude = coordinates[0]
        item.latitude = coordinates[1]
        item.name = item.siteName || ''
        // 判断是否是国控和省控
        let base = ''
        let level = ''
        let flag = ''
        switch (item.siteTypeCode) {
        case '001':
        case '002':
        case '003':
        case '004':
        case '005':
            level = item.siteTypeCode
            break
        // case 'WuYiAI':
        //     flag = 'AI'
        //     break
        // case '009':
        //     flag = 'Mp'
        //     break
        // case '005':
        //     flag = '其他'
        //     break
        default:
            if (item.borderSituation !== '001') {
                flag = '交'
                level = '008'
            }
        }

        base = getPointColor(item.notDisposedCount, item.inDisposalCount, item.disposalCount)
        if (base === 'base6') checkPointList.push(coordinates)
        item.symbolImgName = `${base}-${level}`
    })
    MapUtil.addCheckMarker(checkPointList)
    setMapPointDomToImage(dataList, layer, 'MapPointWarningPop')
}
// 根据预警数量判断点位颜色
const getPointColor = (notDisposedCount: number, inDisposalCount: number, disposalCount: number) => {
    let base = ''
    if (notDisposedCount > 0)
        base = 'base6'
    else if (notDisposedCount === 0 && inDisposalCount === 0)
        base = 'base3'
    else
        base = 'base4'
    return base
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
            showMapPop('MapPointWarningPop', analysisRemember.popPoint, [+analysisRemember.popPoint.longitude, +analysisRemember.popPoint.latitude])
        })
        analysisStore.clearRemenber()
    }, 600)
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
 * @name: 隐藏全部图层
 */
const hideAllLayer = () => {
    MapUtil.clearAllCheckMarker()
    MapUtil._removeHtmlMarker(window.countryMarker)
    MapUtil._showOrHideMapLayerById([layerDictionaries.MAP_COMMON_POINT, layerDictionaries.ANALYSIS_EVEN_POINT], 'hide')
}
const { waringPointList } = toRefs(data)
</script>

<style lang="scss" scoped>
.water-quality {
    font-size: 14px;
}
</style>
