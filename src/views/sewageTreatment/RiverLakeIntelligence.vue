<!--
 * @Author: mjh
 * @Date: 2022-09-07 20:39:30
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-11 16:52:09
 * @Description:
-->
<template lang="pug">
.riverLakeIntelligence
    RiverLakeIntelligenceLeft.tran05( :class="[getPopCom.isPanelAnimation ?  'fold-panel-left' : '']" style="z-index: 10;")
    RiverLakeIntelligenceRight.tran05( :class="[getPopCom.isPanelAnimation ?  'fold-panel-right' : '']" style="z-index: 10;")
    RuleByRiver(v-if='showInspect' :popData="popData")
    UnmannedBoatInspection(v-if="isShowUnmannedBoatInspection")
    transition(:name="getPopCom.transition")
        component(:is='RiverLakeIntelligencePopCmp[getPopCom.name]' :popData="popData" style="z-index: 9;")
</template>

<script lang="ts" setup>
import { usePopStore } from '@/store/popControl'

import RiverLakeIntelligencePopCmp from '@/components/sewageTreatment/riverLakeIntelligence/popup'
import type { mapPointNewLayerTs } from '@/types/common'
import { layerDictionaries } from '@/utils/map/layerSource'
import MapUtil from '@/utils/map/mapUtils'
import { useMapStore } from '@/store/map'
const mapStore = useMapStore()
const popStore = usePopStore()
popStore.initPop() // 初始化面板弹框数据

const data = reactive({
    showInspect: false,
    isShowUnmannedBoatInspection: false,
    layerData: null as null | mapPointNewLayerTs,
    popData: ''
})
/**
 * @desc: 监听面板点击事件
 */
watch(() => popStore.getPop, (val) => {
    detailPopChange(val)
})

onUnmounted(() => {
    hideAllLayer()
})
/**
 * @name: 面板弹框显示控制
 * @computed
 * @return {
 *      name: 当前显示的弹框的名称
 *      transition: 当前显示动画名称
 * }
 */
const getPopCom = computed(() => {
    const name = popStore.getCurrentPop === 'showRuleByRiver' ? '' : popStore.getCurrentPop
    const transition = 'opacity-right'
    const isPanelAnimation = popStore.getCurrentPop === 'ProCodePop'
    return {
        name,
        transition,
        isPanelAnimation
    }
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
    data.showInspect = false
    data.isShowUnmannedBoatInspection = false
    mapStore.controlMapLayerHandle = ''
    switch (currentPop) {
    case 'showRuleByRiver': // left劣V类河道
        if (!popData) data.showInspect = true
        else data.isShowUnmannedBoatInspection = true
        data.popData = popData
        break
    case 'ProCodePop':
        break
    default:
        nextTick(() => {
            mapStore.controlMapLayerHandle = '水环境'
        })
        break
    }
}
/**
 * @name: 隐藏全部图层
 */
const hideAllLayer = () => {
    MapUtil._showOrHideMapLayerById([layerDictionaries.MAP_COMMON_POINT], 'hide')
}

const {
    showInspect,
    popData,
    isShowUnmannedBoatInspection
} = toRefs(data)
</script>

<style lang="scss" scoped>

</style>
