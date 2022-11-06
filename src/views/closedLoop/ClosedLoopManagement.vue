<!--
 * @Author: mjh
 * @Date: 2022-09-07 20:39:30
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-04 15:37:26
 * @Description:
-->
<template>
    <div class="ClosedLoopManagement">
        <ClosedLoopManagementLeft />
        <ClosedLoopManagementRight />
        <ClosedLoopManagementBottom />
        <ClosedLoopCountLegend />
        <ClosedLoopSelectLegend v-model:type="type" />
        <MapTools style="transform: translateY(-250px);" />
    </div>
</template>

<script lang="ts" setup>
import dataJson from '@static/json/data.json'
import { addCountryMarker } from './closeMap'
import { layerDictionaries } from '@/utils/map/layerSource'
import MapUtil from '@/utils/map/mapUtils'
import type { waterQualityPointTs } from '@/types/waterQuality'
import { showMapPop } from '@/utils/map/mapInit'
import { setMapPointDomToImage } from '@/utils/map/mapPoint'
import service from '@/service/api'
import { useAnalysisStore } from '@/store/analysis'
import { changeHangZhouKey, defaultChangeHangZhouKey, globalKey, hangZhouKey } from '@/symbols'
import type { UserInfoTs } from '@/types/common'
const analysisStore = useAnalysisStore()
const global = inject(globalKey)
const data = reactive({
    type: 0,
    waringDataList: [] as waterQualityPointTs[],
})

// 引入杭州的信息
const changeHangZhou = inject(changeHangZhouKey, defaultChangeHangZhouKey)
const hangZhouInfo = inject(hangZhouKey)

watch(() => data.type, (index) => {
    detailPointType(index)
})
watch(() => analysisStore.analysis, (val) => {
    analysisStore.setRemember({
        pop: {
            currentPop: '', // 当前显示的面板
            popData: null
        },
        popPoint: val.data,
        type: data.type
    })
}, { deep: true })
/**
 * 添加乡镇街道点位
 */
onMounted(() => {
    !hangZhouInfo?.authorization && getHangZhouLogin() // 模拟登陆杭州
    getSitePointData([global?.dayjs().startOf('year').valueOf(), global?.dayjs().endOf('year').valueOf()])
    if (analysisStore.analysisRemember) {
        detailRemeberAnalysis()
        return
    }
    window.glMap.on('load', () => {
        detailPointType(data.type)
    })
    detailPointType(data.type)
})
onUnmounted(() => {
    // 移除marker
    MapUtil._removeMapboxPopup()
    removeAllLayer()
})

const getHangZhouLogin = async () => {
    const res = await service<UserInfoTs>('close/loginHZ')
    const resData = res.data
    if (!resData) return
    const resAuth = await service<any>('close/getAuth')
    changeHangZhou({ token: resData.token, authorization: resAuth.data.token })
}
/**
 * @name: 处理地图点位渲染类型
 * @param {*} typeIndex
 * @return {*}
 */
const detailPointType = (typeIndex: number) => {
    MapUtil._removeMapboxPopup()
    removeAllLayer()
    if (!typeIndex) addCountryMarker(window.glMap, dataJson)
    else renderEarlyWarningMarker(data.waringDataList)
}
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
    data.type = Number(analysisRemember.type) || 0
    setTimeout(() => {
        detailPointType(data.type)
        // analysisRemember.pop.currentPop && popStore.upDatePopup({
        //     currentPop: analysisRemember.pop.currentPop,
        //     popData: analysisRemember.pop.currentPop === 'waterQualityPop' ? null : analysisRemember.pop
        // })
        nextTick(() => {
            showMapPop('MapPointWarningPop', analysisRemember.popPoint, [+analysisRemember.popPoint.longitude, +analysisRemember.popPoint.latitude])
        })
        analysisStore.clearRemenber()
    }, 600)
}
const removeAllLayer = () => {
    MapUtil.clearAllCheckMarker()
    MapUtil._removeHtmlMarker(window.countryMarker)
    MapUtil._showOrHideMapLayerById([layerDictionaries.ANALYSIS_EVEN_POINT, 'cab-pointer'], 'hide')
}

const { type } = toRefs(data)
</script>

