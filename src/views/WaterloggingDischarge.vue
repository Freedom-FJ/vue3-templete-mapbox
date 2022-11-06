<!--
 * @Author: mjh
 * @Date: 2022-09-18 15:01:57
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-09 19:22:12
 * @Description:
-->
<template lang="pug">
.waterloggingDischarge
    waterlogging-discharge-left
    waterlogging-discharge-right
</template>

<script lang="ts" setup>
import MapUtil from '@/utils/map/mapUtils'
import { drawCommonPoint } from '@/utils/map/mapPoint'
import { layerDictionaries } from '@/utils/map/layerSource'
const point: any = [
    {
        longitude: '119.94028',
        latitude: '30.348333',
        id: 'JMSZSY0007',
        name: '北苕溪（落塘埠下）',
        level: '3',
    },
    {
        longitude: '119.9681',
        latitude: '30.3992',
        level: '4',
        id: 'JMSZSY0008',
        name: '东苕溪（瓶窑大桥）',
    }
]
onMounted(() => {
    drawCommonPoint([{
        code: 'lao',
        name: '洪涝点位',
        data: point
    }], layerDictionaries.MAP_FLOOD_POINT, undefined, true)
})
onUnmounted(() => {
    MapUtil._showOrHideMapLayerById([layerDictionaries.MAP_FLOOD_POINT], 'hide')
})
</script>

