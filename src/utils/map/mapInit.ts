import MapUtil from '@/utils/map/mapUtils'
import { useMapStore } from '@/store/map'
import type { LayerCodeTs, LayerSelectDataTs, LayerSelectItemTs, LayerStaticDataTs, mapPopName } from '@/types/map'
import { layerDictionaries } from '@/utils/map/layerSource'
import MapPointWarningPop from '@/components/map/sewageTreatment/mapPop/MapPointWarningPop.vue'
import AlgaeWarningPointPop from '@/components/map/sewageTreatment/mapPop/AlgaeWarningPointPop.vue'
import WaterCommonMainPop from '@/components/map/commonMapPop/WaterCommonMainPop.vue'
import { staticLayer } from '@/views/staticData'
export const popList = {
    MapPointWarningPop,
    AlgaeWarningPointPop,
    WaterCommonMainPop
}
export function initMap(container: string, jsonStyle: Record<string, any>) {
    const glMap = new mapboxgl.Map({
        container,
        minZoom: 4,
        maxZoom: 20,
        center: [119.91405, 30.41918],
        zoom: 10.2,
        pitch: 0,
        style: jsonStyle,
        hash: false,
        antialias: true
    })
    return glMap
}
/**
 * 公共弹框
 */
export const glPopup = new mapboxgl.Popup({
    className: 'blue-popup',
    closeOnClick: true,
    closeButton: false
})
/**
 * 公共tooltip
 */
export const glTooltip = new mapboxgl.Popup({
    className: 'mapbox-tooltip',
    closeOnClick: false,
    closeButton: false
})
/**
 * 添加卫星影像图蒙版，蒙版会随地图缩放，弃用
 */
const addMapMask = () => {
    window.glMap.addSource('mask-source', {
        type: 'image',
        url: '/src/assets/images/map/mask.png',
        // 119.6780285479355257,30.1619805530949456 : 120.1462555477964003,30.5652698766185438
        coordinates: [
            [119.6780285479355257, 30.5652698766185438],
            [120.1462555477964003, 30.5652698766185438],
            [120.1462555477964003, 30.1619805530949456],
            [119.6780285479355257, 30.1619805530949456]
        ]
    })
    window.glMap.addLayer({
        id: 'mask-layer',
        type: 'raster',
        source: 'mask-source'
    })
}
/**
 * 添加余杭区街道面以及黑色阴影
 */
export const addMapLayer = (map: any, dataJson: Record<string, any>, lineJson: Record<string, any>) => {
    // 填充面图层
    map.addLayer({
        id: layerDictionaries.MAP_BOUNDARY_FILL,
        type: 'fill',
        source: {
            type: 'geojson',
            data: dataJson
        },
        layout: {
            visibility: 'visible'
        },
        paint: {
            'fill-color': '#00eefe',
            'fill-opacity': 0.1
        },
        minzoom: 0,
        maxzoom: 14
    })
    // 边界发光图层
    map.addLayer({
        id: layerDictionaries.MAP_BOUNDARY_SHADOW,
        type: 'line',
        source: {
            type: 'geojson',
            data: dataJson
        },
        layout: {
            'line-join': 'round',
            'line-cap': 'round',
            'visibility': 'visible'
        },
        paint: {
            'line-color': '#00eefe',
            'line-width': 6,
            'line-opacity': 0.4,
            'line-blur': 3,
        },
        minzoom: 0,
        maxzoom: 14
    })
    map.addLayer({
        id: layerDictionaries.MAP_BOUNDARY_LINE,
        type: 'line',
        source: {
            type: 'geojson',
            data: dataJson
        },
        layout: {
            'line-join': 'round',
            'line-cap': 'round',
            'visibility': 'visible'
        },
        paint: {
            'line-color': '#00eefe',
            'line-width': 1,
            'line-opacity': 1.0
        },
        minzoom: 0,
        maxzoom: 14
    })

    // 将点位图层放在 区划边界之上
    if (window.glMap.getLayer(layerDictionaries.MAP_BOUNDARY_LINE) && window.glMap.getLayer(layerDictionaries.MAP_BOUNDARY_SHADOW)) {
        if (window.glMap.getLayer(layerDictionaries.MAP_COMMON_POINT)) {
            window.glMap.moveLayer(layerDictionaries.MAP_BOUNDARY_LINE, layerDictionaries.MAP_COMMON_POINT)
            window.glMap.moveLayer(layerDictionaries.MAP_BOUNDARY_SHADOW, layerDictionaries.MAP_COMMON_POINT)
        }
        if (window.glMap.getLayer(layerDictionaries.ANALYSIS_DISTANCE_POINT)) {
            window.glMap.moveLayer(layerDictionaries.MAP_BOUNDARY_LINE, layerDictionaries.ANALYSIS_DISTANCE_POINT)
            window.glMap.moveLayer(layerDictionaries.MAP_BOUNDARY_SHADOW, layerDictionaries.ANALYSIS_DISTANCE_POINT)
        }
    }
}

// 显示地图弹框
export const showMapPop = (popupName: mapPopName, properties: record, coordinates: number[], popId?: string) => {
    // 在点击处增加动态效果
    // MapUtil._addPointClickedMarker(e.features[0].properties.symbolImgName, coordinates, layerType)
    const popContent: any = createApp(popList[popupName], {
        properties,
    })
    MapUtil._showPopupOnMap(coordinates, popContent, 450, [0, -10], popId || popupName)
}

export const initLayer = async () => {
    const layerData: LayerStaticDataTs[] = await getLayerData()
    const layerDataObj = layerData.reduce((pre, cur) => {
        let currData = cur as LayerSelectItemTs
        currData = Object.assign(currData, {
            isCheckAll: false,
            isShowChild: true,
            indeterminate: false,
            checkedList: [],
        })
        pre[cur.stationCodes as LayerCodeTs] = currData
        return pre
    }, {} as LayerSelectDataTs)
    const mapStore = useMapStore()
    mapStore.setMapLayer(layerDataObj)
}

const getLayerData = async () => {
    const layerData = await new Promise((resolve) => {
        resolve(staticLayer)
    })
    return layerData as LayerStaticDataTs[]
}
