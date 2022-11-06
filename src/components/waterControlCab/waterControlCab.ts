/*
 * @Author: Tian
 * @Date: 2022-09-08 16:36:07
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-27 17:51:02
 * @Description:
 */
import dataJson from '@static/json/data.json'
import type { JSONDataTs } from '@/types/common'
import { getAssetsFile } from '@/utils/tools'
import MapUtil from '@/utils/map/mapUtils'
import { setMapPoint } from '@/views/sewageTreatment/map'
// 劣V类河道点位绘制
export const addRiverMarker = () => {
    dataJson.features.forEach((feature: Record<string, any>, index: number) => {
        if (index > 5) return
        const el = document.createElement('div')
        el.className = 'country-marker-content'
        el.innerHTML = `
        <div class='country-marker'>
            <div class="country-marker-left" style="background: linear-gradient(180deg, #F17594 0%, #FF3737 100%);"></div>
            <div class='country-left-inner'>${index + 1}</div>
            <div class="country-marker-right"></div>
            <div class='country-right-inner'>${feature.properties.Name}</div>
        </div>
        <img style='margin-top: 6px;' src="${getAssetsFile('map/badPoint.png')}" />`
        const coor = turf.centroid(feature).geometry.coordinates
        if (!window.countryMarker) window.countryMarker = {}
        let marker = window.countryMarker[feature.properties.Code]
        if (marker) {
            marker.remove()
            marker = null
        }
        window.countryMarker[feature.properties.Code] = new mapboxgl.Marker(el)
            .setLngLat([coor[0], coor[1] + 0.02])
            .addTo(window.glMap)
    })
}
export const addWaterSystem = () => {
    if (window.glMap.getLayer('water-system-layer')) {
        MapUtil._showOrHideMapLayer('water-system-layer', 'show')
        return
    }

    window.glMap.addSource('water-system-source', {
        type: 'image',
        url: getAssetsFile('map/waterSystem.png'),
        coordinates: [
            [119.77802854793552, 30.465269876618],
            [120.11625554779640, 30.465269876618],
            [120.11625554779640, 30.26198055309494],
            [119.77802854793552, 30.26198055309494]
        ]
    })

    window.glMap.addLayer({
        id: 'water-system-layer',
        type: 'raster',
        source: 'water-system-source'
    })
}
/**
 * 添加地图点位
 */
export const addPondingPointer = (path: string, imgList: string[], type: string) => {
    const list = (dataJson as JSONDataTs).features.map((item) => {
        // 判断如果是水质站，区间修改waterquality
        let radom
        if (type === 'waterquality')
            radom = Math.floor(Math.random() * (12 - 7 + 1)) + 7

        else
            radom = Math.floor(Math.random() * imgList.length)

        const coor = turf.centroid(item).geometry.coordinates
        return {
            name: item.properties?.Name ?? '',
            longitude: coor[0],
            latitude: coor[1] + 0.02,
            symbolImgName: `${type}-${radom}`
        }
    })
    setMapPoint(list, path, imgList, type, 'cab-pointer', undefined)
}
