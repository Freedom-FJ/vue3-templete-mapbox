<!--
 * @Author: Tian
 * @Date: 2022-09-16 13:53:27
 * @LastEditors: Tian
 * @LastEditTime: 2022-10-11 21:02:55
 * @Description:
-->
<template lang="pug">
.waterSupply
    water-supply-left.tran05(:class="[popStore.getCurrentPop ?  'fold-panel-left' : '']" style="z-index: 10;")
    water-supply-right.tran05(:class="[popStore.getCurrentPop ?  'fold-panel-right' : '']" style="z-index: 10;")
    transition(:name="getPopCom.transition")
        component(:is='drinkingWaterSourcePopCmp[getPopCom.name]' style="z-index: 9;" :propsData='popStore.getPop')
</template>

<script lang="ts" setup>
import MapUtil from '@/utils/map/mapUtils'
import { useMapStore } from '@/store/map'
import { usePopStore } from '@/store/popControl'
import drinkingWaterSourcePopCmp from '@/components/sewageTreatment/drinkingWaterSource/popup'
import { layerDictionaries } from '@/utils/map/layerSource'
import { getFactorGroupList } from '@/utils/commonMethods/factor'
import type { AlgaeFactorGroupRes } from '@/components/sewageTreatment/analysisOfAlgae/type'
import service from '@/service/api'
import { setMapPoint } from '@/views/sewageTreatment/map'
const popStore = usePopStore()
popStore.initPop() // 初始化面板弹框数据
const mapStore = useMapStore()
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
// 移除多个图层
const hideMapLayers = () => {
    MapUtil._showOrHideMapLayerById([layerDictionaries.MAP_COMMON_POINT, layerDictionaries.ALGAE_MONITORING_POINT], 'hide')
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
</script>

