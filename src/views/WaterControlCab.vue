<!--
 * @Author: mjh
 * @Date: 2022-08-29 09:17:57
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-04 15:54:18
 * @Description:
-->
<template>
    <div class="water-control">
        <water-control-left-panel class="tran05" :class="[popStore.getCurrentPop ? 'fold-panel-left' : '']" style="z-index: 10;" />
        <water-control-right-panel class="tran05" :class="[popStore.getCurrentPop ? 'fold-panel-right' : '']" style="z-index: 10;" :waring-data-list="waringDataList" />
        <MapToggle v-model="currPointType" />
        <early-warning-statistics v-if="showPanel" @change-type="changeType" /><transition :name="getPopCom.transition">
            <component :is="WaterControlCabPopCmp[getPopCom.name]" style="z-index: 9;" />
        </transition>
    </div>
</template>

<script lang="ts" setup name="water-control">
import dayjs from 'dayjs'
import dataJson from '@static/json/data.json'
import { useMapStore } from '@/store/map'
import type { returnDataTs } from '@/utils/map/mapPoint'
import { addCountryMarker, showMapPop } from '@/utils/map/mapInit'
import { drawCommonPoint, getAllPoint, setMapPointDomToImage } from '@/utils/map/mapPoint'
import MapUtil from '@/utils/map/mapUtils'
import type { waterQualityPointTs } from '@/types/waterQuality'
import { addPondingPointer, addRiverMarker, addWaterSystem } from '@/components/waterControlCab/waterControlCab'
import WaterControlCabPopCmp from '@/components/waterControlCab/popup'
import { usePopStore, } from '@/store/popControl'
import { getFactorGroupList } from '@/utils/commonMethods/factor'
import { getSetTreeCode } from '@/utils/treeDataUtils'
import type { mapPointNewLayerTs } from '@/types/common'
import service from '@/service/api'
import { layerDictionaries } from '@/utils/map/layerSource'
import { globalKey } from '@/symbols'
import { useAnalysisStore } from '@/store/analysis'
const global = inject(globalKey)
const analysisStore = useAnalysisStore()
const popStore = usePopStore()
const mapStore = useMapStore()

popStore.initPop() // 初始化面板弹框数据
const data = reactive({
    layerData: null as null | mapPointNewLayerTs,
    currPointType: 2, // 当前点位类型
    waringDataList: [] as waterQualityPointTs[],
    levelPointList: [] as any[],
    currLevelPopType: '',
    showPanel: false
})

watch(() => data.currPointType, (val) => {
    change(val)
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
        popPoint: val.data,
        type: data.currPointType
    })
}, { deep: true })

/**
 * 添加乡镇街道点位
 */
onMounted(() => {
    if (analysisStore.analysisRemember) {
        detailRemeberAnalysis()
        return
    }
    window.glMap.on('load', () => {
        change(data.currPointType)
    })
    change(data.currPointType)

    // getSitePointData()
})
onUnmounted(() => {
    MapUtil._removeMapboxPopup()
    hideAllLayer()
})
const change = async (index: number) => {
    mapStore.controlMapLayerHandle = ''
    MapUtil._removeMapboxPopup()
    hideAllLayer()
    data.showPanel = false
    !index && addCountryMarker(window.glMap, dataJson)
    if (index === 1) {
        nextTick(() => {
            mapStore.controlMapLayerHandle = '水环境'
            initLayer()
        })
    }
    if (index === 2) {
        data.showPanel = true
        await getSitePointData([dayjs().startOf('year').valueOf(), dayjs().endOf('year').valueOf()])
        renderEarlyWarningMarker(data.waringDataList)
    }

    // 手工、自动图例点位模式下才显示
    global?.emitter.emit('showOrHideMonitorMethods', index)
}
// 预警面板点击
const changeType = async (val: {
    endTime: number
    startTime: number
    type: string
}) => {
    hideAllLayer()
    MapUtil._removeMapboxPopup()
    await getSitePointData([val.startTime, val.endTime])
    renderEarlyWarningMarker(data.waringDataList)
}
const initLayer = async () => {
    if (!data.layerData) return
    const mapData = await getAllPoint(data.layerData)
    drawCommonPoint(mapData, layerDictionaries.ANALYSIS_EVEN_POINT, undefined, true)
}
/**
 * @name: 面板点击事件处理
 * @param {*} val
 * @param {*} popData
 * @return {*}
 */
const detailPopChange = async (val: { currentPop: string; popData?: any }) => {
    const { popData, currentPop } = val
    if (currentPop !== 'BadVRiverPopup')
        data.currLevelPopType = ''
    switch (currentPop) {
    case 'BadVRiverPopup': // left劣V类河道
        MapUtil._removeMapboxPopup()
        hideAllLayer()
        if (data.currLevelPopType === popData.level) return
        getLevelData(popData.level)
        // addRiverMarker()
        // addWaterSystem()
        break
    case 'FloodProtectionPopup': // left 雨量超警
        MapUtil._removeMapboxPopup()
        hideAllLayer()
        addRiverMarker()
        break
    case 'PondingPopup': // right 积水
        MapUtil._removeMapboxPopup()
        hideAllLayer()
        addPondingPointer('map/point', ['0', '1'], 'cub')
        break
    case 'FloodPopup': // right 洪水
        hideAllLayer()
        MapUtil._removeMapboxPopup()
        addPondingPointer('map/hanqing', ['0', '1', '2'], 'hanqing')
        break
    case 'waterQualityPop': // 水质站
        if (popData) { return }
        else {
            hideAllLayer()
            MapUtil._removeMapboxPopup()
        }
        await getSitePointData([dayjs().startOf('year').valueOf(), dayjs().endOf('year').valueOf()])
        renderEarlyWarningMarker(data.waringDataList)
        popStore.upDatePopup({
            currentPop: 'waterQualityPop',
            popData: {
                pointList: data.waringDataList
            }
        })
        break
    default:
        MapUtil._removeMapboxPopup()
        hideAllLayer()
        change(data.currPointType)
        break
    }
}

/**
 * @name: 获取河湖等级对应点位
 */
const getLevelData = async (level: string) => {
    data.currLevelPopType = level
    const treeData = await getSetTreeCode()
    const factorObj = await getFactorGroupList('surfaceSection')
    if (!data.levelPointList.length) {
        const params = {
            treeType: 1,
            treeId: treeData.slice(0, 6),
            factor: factorObj?.id ?? '',
            factorFlag: true,
            beginTime: dayjs().startOf('year').valueOf(),
            endTime: dayjs().add(1, 'years').startOf('year').valueOf(),
            dataTimeType: 1440,
            controlLevel: '004',
            queryTimeType: 'year'
        }
        data.levelPointList = await service<any[], true>('publicMap/getSiteRanking', params)
    }
    const showPointList: returnDataTs = data.levelPointList.filter(item => item.grade === Number(level))
    popStore.upDatePopup({
        currentPop: 'BadVRiverPopup',
        popData: {
            ...popStore.popData,
            pointData: showPointList,
        }
    })
    drawCommonPoint([
        {
            code: '1',
            name: '地表水等级筛选点位',
            data: showPointList.map((item) => {
                return {
                    ...item,
                    isRiverCourse: true // 是否是河道显示类型
                }
            })
        }
    ], layerDictionaries.MAP_COMMON_POINT, undefined, true)
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
    const name = popStore.getCurrentPop ? 'WaterControlCabPopMain' : ''
    const transition = 'opacity-left'
    return {
        name,
        transition
    }
})
/**
 * @name: 获取地图点位
 */
const getSitePointData = async (timeList: number[]) => {
    const startTime = timeList[0]
    const endTime = timeList[1]
    const params = {
        startTime,
        endTime,
        envTypeCodeList: [
            'water'
        ],
        siteTypeCodeList: [
            // '001',
            // '002',
            // '003',
            // '004',
            // '005'
        ],
        regionCode: '330110000000'
    }
    const res = await service<waterQualityPointTs[]>('waterQuality/queryAlarmIdsAggregatedPC', params)
    const resData = res.data || []
    data.waringDataList = resData
    // renderEarlyWarningMarker(resData)
}
// // 研判预警动态Marker(点击事件)
const renderEarlyWarningMarker = (dataList: waterQualityPointTs[]) => {
    if (!window.glMap.isMoving()) window.glMap.jumpTo({ center: window.glMap.getCenter() }) // 此句看似无用，但解决一个奇怪的问题
    const checkPointList: number[][] = []
    dataList.forEach((item) => {
        const coordinates = [+item.longitude, +item.latitude]
        item.longitude = coordinates[0]
        item.latitude = coordinates[1]
        item.name = item.siteName || ''
        // 判断是否是国控和省控
        let level = ''
        let flag = ''
        switch (item.siteTypeCode) {
        case '001':
        case '002':
        case '003':
        case '009':
        case '004':
            level = item.siteTypeCode
            break
            // case '002':
            //     flag = '省'
            //     break
            // case '003':
            //     flag = '市'
            //     break
            // case '004':
            //     flag = '县'
            //     break
        // case 'WuYiAI':
        //     flag = 'AI'
        //     break
        // case '009':
        //     flag = 'Mp'
            // break
        // case '005':
        //     flag = '其他'
        //     break
        default:
            if (item.borderSituation !== '001') {
                flag = '交'
                level = '008'
            }
        }

        const { base, type } = getPointColor(item.notDisposedCount, item.inDisposalCount, item.disposalCount)
        if (base === 'base6') checkPointList.push(coordinates)
        item.symbolImgName = `${base}-${level}`
        item.disposeType = type
    })
    MapUtil.addCheckMarker(checkPointList)
    setMapPointDomToImage(dataList, layerDictionaries.ANALYSIS_EVEN_POINT, 'MapPointWarningPop')
}
// 根据预警数量判断点位颜色
const getPointColor = (notDisposedCount: number, inDisposalCount: number, disposalCount: number) => {
    let base = ''; let type = 0
    if (notDisposedCount > 0) {
        base = 'base6'
        type = 0
    }
    else if (notDisposedCount === 0 && inDisposalCount === 0) {
        base = 'base3'
        type = 2
    }
    else {
        base = 'base4'
        type = 1
    }
    return { base, type }
}
/**
 * @name: 处理研判分析记住的退回状态
 * @return {*}
 */
const detailRemeberAnalysis = () => {
    MapUtil._initHomeView()
    const { analysisRemember } = analysisStore
    if (!analysisRemember) return
    data.currPointType = Number(analysisRemember.type) || 2
    data.currPointType === 2 && change(data.currPointType)
    setTimeout(() => {
        analysisRemember.pop.currentPop && popStore.upDatePopup({
            currentPop: analysisRemember.pop.currentPop,
            popData: analysisRemember.pop.currentPop === 'waterQualityPop' ? null : analysisRemember.pop
        })
        nextTick(() => {
            showMapPop('MapPointWarningPop', analysisRemember.popPoint, [+analysisRemember.popPoint.longitude, +analysisRemember.popPoint.latitude])
        })
        analysisStore.clearRemenber()
    }, 600)
}
/**
 * @name: 隐藏全部图层
 */
const hideAllLayer = () => {
    MapUtil._removeHtmlMarker(window.countryMarker)
    MapUtil.clearAllCheckMarker()
    MapUtil._showOrHideMapLayerById([layerDictionaries.MAP_COMMON_POINT, layerDictionaries.ANALYSIS_EVEN_POINT, 'cab-pointer'], 'hide')
}
const { waringDataList, showPanel, currPointType } = toRefs(data)
</script>

<style lang="scss" scoped>
.water-control {
    font-size: 14px;
}
</style>
