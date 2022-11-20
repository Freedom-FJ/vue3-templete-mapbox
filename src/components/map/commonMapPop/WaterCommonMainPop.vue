<!--
 * @Author: mjh
 * @Date: 2022-09-19 16:01:43
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-20 23:38:42
 * @Description:
-->
<template lang="pug">
component(:is='WaterCommonMapComp[getCurrPopName]' style="z-index: 9;" :properties="properties")
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import WaterCommonMapComp from './module'
import type { LayerCodeTs, PointTs } from '@/types/map'
const props = defineProps({
    properties: {
        type: Object as PropType<PointTs>,
        default: () => {
            return {}
        }
    },
})
interface typeListTs extends Partial<Record<LayerCodeTs, string>> {}
const typeList: typeListTs = {
    1: 'SurfaceStationDetail',
    40: 'SurfaceStationDetail',
    38: 'SurfaceStationDetail'
}
console.log(props.properties, 'properties')
const getCurrPopName = computed(() => {
    return props.properties.typeCode ? typeList[props.properties.typeCode as LayerCodeTs] || '' : ''
})
</script>

<style scoped lang="scss">

</style>
