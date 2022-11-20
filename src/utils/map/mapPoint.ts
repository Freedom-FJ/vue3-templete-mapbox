/*
 * @Author: mjh
 * @Date: 2022-10-16 15:39:05
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-20 23:20:04
 * @Description:
 */
import MapUtil from '@/utils/map/mapUtils'
import { showMapPop } from '@/utils/map/mapInit'
import type { PointTs, mapPopName } from '@/types/map'
import { getAssetsFile } from '@/utils/tools'

export const drawLayerStaticByDom = async (layerId: string, pointData: PointTs[]) => {
    // 构造GeoJson数据
    const dataJson = MapUtil._getCommonGeoJson()
    for (const point of pointData) {
        const feature = {
            type: 'Feature',
            properties: {
                ...point,
            },
            geometry: {
                type: 'Point',
                coordinates: [parseFloat(point.longitude as string), parseFloat(point.latitude as string)],
            },
        }
        dataJson.features.push(feature)
        if (!point.symbolImgName)
            point.symbolImgName = `base${point.runState}-${point.controlLevel}`
        // 图标（symbol）资源加载
        await drawDomLayer(point.symbolImgName)
    }
    MapUtil._addSourceToMap(layerId, dataJson)
    MapUtil._showOrHideMapLayer([layerId], 'show')
    if (!window.glMap.getLayer(layerId)) {
        window.glMap.addLayer(
            {
                id: layerId,
                type: 'symbol',
                source: layerId,
                layout: {
                    'icon-image': '{symbolImgName}', // 图片的source
                    'icon-size': 0.65,
                    'icon-ignore-placement': true, // 忽略碰撞检测
                },
            },
            ''
        )
        MapUtil._addHoverEventToLayer(layerId, 'name')
        registerMapboxClickEvent(layerId, 'WaterCommonMainPop')
    }
}

export const drawDomLayer = async (imgName: Arrayable<string>) => {
    if (typeof imgName === 'string') imgName = [imgName]
    for (const img of imgName) {
        const [name1, name2] = img.split('-')
        const el = document.createElement('div')
        el.className = 'location-layer-marker'
        el.innerHTML = `<div style="position: relative;width: 35px;height: 60px;">
        <img src="${getAssetsFile(`map/point/${name2}.png`)}" style="position: absolute;top:5.1px;left:50%;transform: scale(1) translateX(-60%);width: 25px;"/>
        <img src="${getAssetsFile(`map/point/${name1}.png`)}" />
        </div>`
        await MapUtil.handleDomConversionImage(el, { name: img, height: 60, width: 37 })
    }
}
/**
 * @name: 注册图层要素点击事件弹出地图弹窗
 * @param {string} layername 图层名称
 * @param {any} popName 弹框名称
 */
export const registerMapboxClickEvent = (layerNameOrComp: string, popName: mapPopName | Function) => {
    window.glMap.on('click', layerNameOrComp, (e: any) => {
        const coordinates = e.features[0].geometry.coordinates.slice() // 图片的经纬度
        // 在点击处增加动态效果
        // MapUtil._addPointClickedMarker(e.features[0].properties.symbolImgName, coordinates, layerType)
        if (typeof popName === 'string')
            showMapPop(popName, e.features[0].properties, coordinates)
        else
            popName(e)
    })
}

/**
 * 添加marker点位
 */
export const addCountryMarker = (map: any, dataJson: Record<string, any>) => {
    dataJson.features.forEach((feature: Record<string, any>, index: number) => {
        const el = document.createElement('div')
        el.className = 'country-marker-content'
        el.innerHTML = `
        <div class='country-marker'>
            <div class="country-marker-left" style="background: ${dataJson.features.length - index > 3 ? 'linear-gradient(180deg, #0AD4CD 0%, #00B0E1 100%)' : 'linear-gradient(180deg, #F17594 0%, #FF3737 100%)'}"></div>
            <div class='country-left-inner'>${index + 1}</div>
            <div class="country-marker-right"></div>
            <div class='country-right-inner'>${feature.properties.Name}</div>
        </div>
        <img style='margin-top: 2px;' src="${getAssetsFile('map/point_.svg')}" />`
        const coor = turf.centroid(feature).geometry.coordinates
        if (!window.countryMarker) window.countryMarker = {}
        let marker = window.countryMarker[feature.properties.Code]
        if (marker) {
            marker.remove()
            marker = null
        }
        window.countryMarker[feature.properties.Code] = new mapboxgl.Marker(el)
            .setLngLat([coor[0], coor[1] + 0.02])
            .addTo(map)
        el.addEventListener('click', (e) => {
            e.stopPropagation()
            showMapPop('MapPointWarningPop', feature.properties, coor)
        })
    })
}
