/*
 * @Author: Tian
 * @Date: 2022-09-05 19:48:57
 * @LastEditors: Tian
 * @LastEditTime: 2022-10-08 10:12:17
 * @Description:
 */
import MapUtil from '@/utils/map/mapUtils'
import { registerMapboxClickEvent } from '@/utils/map/mapPoint'
import type { mapPopName } from '@/types/map'
import { useMapStore } from '@/store/map'
// const mapStore = useMapStore()
// console.log(mapStore, 'dddddd')
/**
 * @name: 传统绘制地图点位方法
 * @param {Record} data 点位数据
 * @param {string} imgPath 图片地址
 * @param {string[]} imgList 需要载入的图片类型
 * @param {string} type 所属模块
 * @param {string} layerId 图层名称
 * @param {string} popName 弹框名称
 * @param {number} size 图标大小
 */
export const setMapPoint = (data: Record<string, any>[], imgPath: string, imgList: string[], type: string, layerId: string, popName?: mapPopName | Function, size?: number) => {
    // 构造GeoJson数据
    const dataJson = MapUtil._getCommonGeoJson()
    data.forEach((point: Record<string, any>) => {
        // 视频点位需要判断是否在余杭区域内
        // if (type === 'camera') {
        //     const inHZ = MapUtil._booleanPointInPolygon([parseFloat(point.longitude), parseFloat(point.latitude)])
        //     if (!inHZ) return
        // }

        const feature = {
            type: 'Feature',
            properties: {
                ...point,
            },
            geometry: {
                type: 'Point',
                coordinates: [parseFloat(point.longitude), parseFloat(point.latitude)],
            },
        }
        dataJson.features.push(feature)
    })
    // 图标（symbol）资源加载
    MapUtil._addImageToMap(imgPath, imgList, 'png', type)
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
                    'icon-size': size || 0.65,
                    'icon-ignore-placement': true, // 忽略碰撞检测
                },
            },
            ''
        )
        MapUtil._addHoverEventToLayer(layerId, 'name')
        if (popName)
            registerMapboxClickEvent(layerId, popName)

        if (type === 'camera')
            addClickEventToCamara(layerId)
    }
}
/**
 * 添加视频点击播放事件
 */
const addClickEventToCamara = (layerName: string) => {
    window.glMap.on('click', layerName, (e: Record<string, any>) => {
        const feature = e.features[0]
        const mapStore = useMapStore()
        const properties = feature.properties // 点的数据
        mapStore.setMapVideoParams({
            deviceId: properties.deviceId,
            channelId: properties.channelId,
            skip: properties.address,
            url: properties.url,
            cameraCode: properties.cameraInfoVo ? JSON.parse(properties.cameraInfoVo).cameraCode : ''
        })
    })
}

