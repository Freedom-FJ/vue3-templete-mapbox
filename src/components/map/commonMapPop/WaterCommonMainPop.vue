<!--
 * @Author: mjh
 * @Date: 2022-09-19 16:01:43
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-29 16:30:49
 * @Description:
-->
<template lang="pug">
component(:is='WaterCommonMapComp[getCurrPopName]' style="z-index: 9;" :properties="properties")
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import WaterCommonMapComp from './module'
import type { StationCode, returnDataTs } from '@/utils/map/mapPoint'
const props = defineProps({
    properties: {
        type: Object as PropType<returnDataTs[0]>,
        default: () => {
            return {}
        }
    },
})
interface typeListTs extends Partial<Record<StationCode, string>> {}
const typeList: typeListTs = {
    '1': 'SurfaceStationDetail',
    '58': 'SurfaceStationDetail',
    '40': 'SurfaceStationDetail',
    '12': 'PomsStationDetail',
    '8': 'PomsStationDetail',
    '1,40': 'SurfaceStationDetail',
    '54': 'WaterPumpStationDetail',
    '3': 'RainStationDetail',
    '5': 'RainStationDetail',
    '10': 'RiverChiefDetail'
}
console.log(props.properties, 'properties')
const getCurrPopName = computed(() => {
    return props.properties.typeCode ? typeList[props.properties.typeCode] || '' : ''
})
</script>

<style scoped lang="scss">

</style>
