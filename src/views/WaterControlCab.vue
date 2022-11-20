<!--
 * @Author: mjh
 * @Date: 2022-08-29 09:17:57
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-20 23:31:22
 * @Description:
-->
<template>
    <div class="water-control">
        <water-control-left-panel class="tran05" :class="[popStore.getCurrentPop ? 'fold-panel-left' : '']" style="z-index: 10;" />
        <water-control-right-panel class="tran05" :class="[popStore.getCurrentPop ? 'fold-panel-right' : '']" style="z-index: 10;" :waring-data-list="waringDataList" />
        <MapToggle v-model="currPointType" />
        <transition :name="getPopCom.transition">
            <component :is="WaterControlCabPopCmp[getPopCom.name]" style="z-index: 9;" />
        </transition>
    </div>
</template>

<script lang="ts" setup name="water-control">
import dataJson from '@static/json/data.json'
import { useMapStore } from '@/store/map'
import { addCountryMarker, drawLayerStaticByDom } from '@/utils/map/mapPoint'
import MapUtil from '@/utils/map/mapUtils'
import type { waterQualityPointTs } from '@/types/waterQuality'
import { staticData1, staticDataPoint } from '@/views/staticData'
import WaterControlCabPopCmp from '@/components/waterControlCab/popup'
import { usePopStore, } from '@/store/popControl'
import { layerDictionaries } from '@/utils/map/layerSource'
import { globalKey } from '@/symbols'
const global = inject(globalKey)
const popStore = usePopStore()
const mapStore = useMapStore()

popStore.initPop() // 初始化面板弹框数据
const data = reactive({
    layerData: null as null,
    currPointType: 2, // 当前点位类型
    waringDataList: [] as waterQualityPointTs[],
})

/**
 * @desc: 监听面板点击事件
 */
watch(() => popStore.getPop, (val) => {
    detailPopChange(val)
})

onUnmounted(() => {
    MapUtil._removeMapboxPopup()
    hideAllLayer()
})

/**
 * @name: 顶部点位类型切换
 * @param {*} index
 */
const change = async (index: number) => {
    console.log(index, 'index')
    mapStore.setCheckMapLayer()
    MapUtil._removeMapboxPopup()
    hideAllLayer()
    switch (index) {
    case 0:
        addCountryMarker(window.glMap, dataJson)
        break
    case 1:
        nextTick(() => {
            mapStore.setCheckMapLayer('1')
            initLayer()
        })
        break
    case 2:
        await getSitePointData()
        renderEarlyWarningMarker(data.waringDataList)
        break
    default:
        break
    }
}

const initLayer = async () => {
    if (!data.layerData) return
    const mapData = {
        data: staticDataPoint,
        name: '点位',
        code: '1'
    }
}
/**
 * @name: 面板点击事件处理
 * @param {*} val
 * @param {*} popData
 * @return {*}
 */
const detailPopChange = async (val: { currentPop: string; popData?: any }) => {
    const { popData, currentPop } = val
    if (currentPop !== 'BadVRiverPopup') {
        switch (currentPop) {
        case 'waterQualityPop': // 水质站
            if (popData) { return }
            else {
                hideAllLayer()
                MapUtil._removeMapboxPopup()
            }
            await getSitePointData()
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
const getSitePointData = async () => {
    const resData = staticData1.map(item => ({ ...item, name: item.siteName }))
    data.waringDataList = resData as any
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
        switch (item.siteTypeCode) {
        case '001':
        case '002':
        case '003':
        case '009':
        case '004':
            level = item.siteTypeCode
            break
        default:
            if (item.borderSituation !== '001')
                level = '008'
        }
        const { base, type } = getPointColor(item.notDisposedCount, item.inDisposalCount)
        if (base === 'base6') checkPointList.push(coordinates)
        item.symbolImgName = `${base}-${level}`
        item.disposeType = type
    })
    MapUtil.addCheckMarker(checkPointList)
    drawLayerStaticByDom(layerDictionaries.ANALYSIS_EVEN_POINT, dataList as any)
}
// 根据预警数量判断点位颜色
const getPointColor = (notDisposedCount: number, inDisposalCount: number) => {
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
 * @name: 隐藏全部图层
 */
const hideAllLayer = () => {
    MapUtil._removeHtmlMarker(window.countryMarker)
    MapUtil.clearAllCheckMarker()
    MapUtil._showOrHideMapLayerById([layerDictionaries.MAP_COMMON_POINT, layerDictionaries.ANALYSIS_EVEN_POINT], 'hide')
}

watch(() => data.currPointType, (val) => {
    change(val)
}, { immediate: true })

const { waringDataList, currPointType } = toRefs(data)
</script>

<style lang="scss" scoped>
.water-control {
    font-size: 14px;
}
</style>
