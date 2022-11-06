<!--
 * @Author: Tian
 * @Date: 2022-09-02 10:22:55
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-04 15:47:51
 * @Description:
-->
<template lang="pug">
.fpi-map(v-if='loadMap')
    #mapContent
    .mapMask(v-if='currentMapStyle === "img"')
    .map-tools-content(v-if="showMapTools" :class="[route.path === '/sewageTreatment/AnalysisWaterQuality' ? 'short-screen-tool' : '']")
        map-tools
        map-control

    //- water-flow
    //- water-interpolation
</template>

<script lang="ts" setup name="layout-map">
import dataJson from '@static/json/data.json'
import lineJson from '@static/json/line.json'
import jsonStyle from '@static/json/jsonStyle.json'
import imgStyle from '@static/json/imgStyle.json'
import { useRoute } from 'vue-router'
import { addMapLayer, glPopup, glTooltip, initMap } from '@/utils/map/mapInit'
import { useCommonStore, } from '@/store/common'
import { useMapStore } from '@/store/map'
import MapUtil from '@/utils/map/mapUtils'
const route = useRoute()
const commonStore = useCommonStore()
const router = useRouter()
const { currentMapStyle } = storeToRefs(useCommonStore())
const data: {
    loadMap: boolean
    timer1: any
    timer2: any
    showMapTools: boolean
} = reactive ({
    loadMap: true,
    timer1: null,
    timer2: null,
    showMapTools: true
})
watch(() => commonStore.getMapStyle, (val) => {
    emitChangeMapStyle(val.toString())
})
onMounted(() => {
    mapOnload(jsonStyle)
})
const mapOnload = (style: Record<string, any>) => {
    window.glMap = initMap('mapContent', style)
    window.glPopup = glPopup
    window.glTooltip = glTooltip
    window.glMap.on('load', () => {
        const mapStore = useMapStore()
        mapStore.setMapLoaded(true)
        addMapLayer(window.glMap, dataJson, lineJson)
        MapUtil.showThematicTooltip('river-main', ['name'])
        MapUtil.showThematicTooltip('river-town', ['name'])
    })
}

/**
 * 地图模式切换，默认<->卫星影像图
 */
const emitChangeMapStyle = (val: string) => {
    data.loadMap = false
    data.timer1 = setTimeout(() => {
        data.loadMap = true
    })
    data.timer2 = setTimeout(() => {
        const mapStyle = val === 'default' ? jsonStyle : imgStyle
        mapOnload(mapStyle)
    }, 15)
}

onUnmounted(() => {
    clearTimeout(data.timer1)
    clearTimeout(data.timer2)
})
/**
 * 监听路由变化
 */

watch(
    () => router.currentRoute.value,
    (val) => {
        // 五水指数页面不显示地图工具栏
        data.showMapTools = !val.path.includes('FiveWaterIndexEvaluationResults')
    }
)
const { loadMap, showMapTools } = toRefs(data)
</script>

<style lang="scss" scoped>
.fpi-map {
    position: relative;
    width: 100%;
    height: 100%;

    #mapContent {
        position: absolute;
        z-index: 1;
        width: 100%;
        height: 100%;
    }

    .mapMask {
        position: absolute;
        z-index: 2;
        width: 100%;
        height: 100%;
        pointer-events: none;
        background: url(@/assets/images/map/mask.png) no-repeat;
        background-size: 100% 100%;
    }

    @media screen and (max-width: 2200px) {
        .short-screen-tool {
            ::v-deep() .map-tools {
                bottom: 32%;
            }

            ::v-deep() .map-layer {
                bottom: 32%;
            }

            ::v-deep() .map-style {
                bottom: 32%;
            }
        }
    }
}
</style>
