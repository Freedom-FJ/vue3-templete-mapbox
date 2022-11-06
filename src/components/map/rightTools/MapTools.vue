<!--
 * @Author: Tian
 * @Date: 2022-09-08 16:36:07
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-30 09:51:02
 * @Description:
-->
<template lang="pug">
.map-tools.bf-blur(:style='{right: popStore.getCurrentPop ? pxToRem(360) : pxToRem(480)}')
    .icon-list
        img(v-for='item in 7' :src='getAssetsFile(`map/tools/tools-${item === 4 ? mapStyle : item - 1}.svg`)' @click="toolClick(item)")
set-map-style(v-show='showStylePop' @close-pop='closePop' @change-map-style='changeMapStyle')
map-layer(v-show='showMapLayer' @close-layer-pop='closeLayerPop')
camera-layer(v-if='showCameraLayer' @close-video-pop='closeCameraLayerPop')
</template>

<script lang="ts" setup name="map-tools">
import { initHomeView, zoom2Big, zoom2Small } from './tools'
import { usePopStore } from '@/store/popControl'
import { getAssetsFile, pxToRem } from '@/utils/tools'
const emit = defineEmits(['emitChangeMapStyle', 'emitCameraChange'])
const popStore = usePopStore()
const router = useRouter()
const data = reactive({
    mapStyle: '2d',
    showStylePop: false,
    showMapLayer: false,
    showCameraLayer: false
})
watch(() => router.currentRoute.value, () => {
    data.showMapLayer = false
})
const toolClick = (index: number) => {
    switch (index) {
    case 1:
        zoom2Big()
        break
    case 2:
        zoom2Small()
        break
    case 3:
        initHomeView()
        break
    case 4:
        if (data.mapStyle === '2d') {
            data.mapStyle = '3d'
            window.glMap.flyTo({ pitch: 45, zoom: window.glMap.getZoom(), speed: 0.2, curve: 1 })
        }
        else {
            data.mapStyle = '2d'
            window.glMap.flyTo({ pitch: 0, zoom: window.glMap.getZoom(), speed: 0.2, curve: 1 })
        }
        break
    case 5:
        data.showStylePop = !data.showStylePop
        data.showMapLayer = false
        data.showCameraLayer = false
        break
    case 6:
        data.showCameraLayer = !data.showCameraLayer
        data.showMapLayer = false
        data.showStylePop = false
        emit('emitCameraChange', data.showCameraLayer)
        break
    case 7:
        data.showMapLayer = !data.showMapLayer
        data.showCameraLayer = false
        data.showStylePop = false
        break
    default:
        break
    }
}
const closePop = (flag: boolean) => {
    data.showStylePop = flag
}
const closeLayerPop = (flag: boolean) => {
    data.showMapLayer = flag
}
const closeCameraLayerPop = (flag: boolean) => {
    data.showCameraLayer = flag
}
const changeMapStyle = (val: string) => {
    emit('emitChangeMapStyle', val)
}
const { mapStyle, showStylePop, showMapLayer, showCameraLayer } = toRefs(data)
</script>

<style lang="scss" scoped>
.map-tools {
    position: absolute;
    bottom: 32px;
    z-index: 9;
    box-sizing: border-box;
    width: 32px;
    height: 256px;
    padding-top: 16px;
    background: url(@/assets/images/map/tools.png) no-repeat;
    background-size: 100% 100%;
    transition: all 0.5s;

    .icon-list {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        height: 228px;
        padding: 8px 0;

        img {
            width: 20px;
            height: 20px;
            cursor: pointer;
        }
    }
}
</style>
