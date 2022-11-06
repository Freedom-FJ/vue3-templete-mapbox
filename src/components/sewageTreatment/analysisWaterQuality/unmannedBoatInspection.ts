/*
 * @Author: Tian
 * @Date: 2022-09-13 16:31:42
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-14 08:52:50
 * @Description: 无人船轨迹绘制
 */
import { createApp } from 'vue'
import { getAssetsFile } from '@/utils/tools'
import InspectMapPop from '@/components/map/sewageTreatment/mapPop/InspectMapPop.vue'
import boatImg from '@/assets/images/map/boat/boat-1.png'
import type { JSONDataTs } from '@/types/common'
const colorLevel = [
    { down: 0, up: 1, color: '#03A9F4' },
    { down: 1, up: 2, color: '#1976D2' },
    { down: 2, up: 3, color: '#85C940' },
    { down: 3, up: 4, color: '#D9CD4C' },
    { down: 4, up: 5, color: '#EF8E00' },
    { down: 5, up: 6, color: '#E12214' }
]
const colors = [
    '#35bccb', '#12cfe8', '#07f6e3', '#0adbee',
    '#079ee3', '#11b2e3', '#0bbbe7', '#10f5e1',
    '#0eefc2', '#1be39e', '#2ee38e', '#36d281',
    '#4dd070', '#57cf67', '#6ecc56', '#8ccd44',
    '#9bcf3a', '#9bcf3a', '#c3d325', '#c3d325',
    '#ffb700', '#ffa700', '#ff8a01', '#ff7901',
    '#ff5c01', '#ff5c01', '#fc4f05', '#f5350c',
    '#e7001a', '#cc0030', '#ba013f', '#f50428'
]
export class DynamicLineBoatClass {
    id: string
    levelJsonData: JSONDataTs // 插值json
    riverLineJsonData: JSONDataTs | null// 河流json
    inspectMapObj: any // 地图对象
    animationTimer: null | NodeJS.Timer // 定时器
    routeMarkers: record // 最终排口点位
    runIndex: recordt<number>
    endCoordinates: number[]
    isShowAll: boolean
    allTime: number // 整个动画完成时间
    animateTimes: number // 刷新动画时间
    constructor(id: string, levelJsonData: JSONDataTs, inspectMapObj: any, option: { isShowAll?: boolean; time?: number } = {}) {
        this.id = id
        this.levelJsonData = levelJsonData
        this.inspectMapObj = inspectMapObj
        this.animationTimer = null
        this.routeMarkers = {}
        this.runIndex = {}
        this.isShowAll = option.isShowAll || true
        this.allTime = option.time || 1000 * 20
        this.animateTimes = 0
        this.endCoordinates = []
        this.riverLineJsonData = null
        this.init()
    }

    init() {
        this.initRiverLineJsonData()
        if (!this.riverLineJsonData) return
        this.addAllLayerSource()
        this.addBoatIcon()
        if (!this.isShowAll) { this.animationTimer = setInterval(this.animateLine.bind(this), this.animateTimes) }
        else {
            if (this.inspectMapObj.getLayer('boat-layer')) this.inspectMapObj.setLayoutProperty('boat-layer', 'visibility', 'none')
            // 结束时绘制排污口点位index
            this.drawPointer([{
                longitude: this.endCoordinates[0],
                latitude: this.endCoordinates[1],
                name: '排口',
                code: 'port'
            }])
        }
    }

    destroyed() {
        this.animationTimer && clearInterval(this.animationTimer)
        this.inspectMapObj && this.inspectMapObj.remove()
    }

    /**
     * @name: 添加所有插值点位图层以及资源
     */
    addAllLayerSource() {
        if (!this.riverLineJsonData) return
        const fitModel = this.train()
        for (let i = 0; i < this.riverLineJsonData.features.length; i++) {
            const feature = this.riverLineJsonData.features[i]
            // 计算起点颜色
            const startPoint = feature.geometry.coordinates[0] as number[]
            const startValue = kriging.predict(startPoint[0], startPoint[1], fitModel)
            const startColor = this.getColor(startValue)
            // 计算终点颜色
            const endPoint = feature.geometry.coordinates[1] as number[]
            const endValue = kriging.predict(endPoint[0], endPoint[1], fitModel)
            const endColor = this.getColor(endValue)
            const currLayerID = `line-layer-${this.id}-${i}`
            const currSourceId = `line-source-${this.id}-${i}`
            // 添加数据源

            this._addSourceToMap(currSourceId, turf.featureCollection([feature]))
            this._addLinerLayer(currLayerID, currSourceId, [startColor, endColor])
        }
    }

    initRiverLineJsonData() {
        const staticLineJson = {
            type: 'FeatureCollection',
            name: 'wrcgj',
            crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:EPSG::4490' } },
            features: [
                { type: 'Feature', properties: { id: 1 }, geometry: { type: 'LineString', coordinates: this.levelJsonData.features.map(item => item.geometry.coordinates) as number[][] } }
            ]
        }
        this.endCoordinates = staticLineJson.features[0].geometry.coordinates.slice(-1)[0]
        const bbox = turf.bbox(staticLineJson)
        this.inspectMapObj.fitBounds(bbox, {
            padding: { top: 120, bottom: 60, left: 60, right: 100 }
        })
        this.riverLineJsonData = turf.lineChunk(staticLineJson, 0.01, { units: 'kilometers' })
        if (this.riverLineJsonData) this.animateTimes = this.allTime / this.riverLineJsonData.features.length
    }

    /**
     * @name: 重新播放
     * @param {any} inspectMapObj 地图dom对象
     */
    replay(inspectMapObj?: any, levelJsonData?: JSONDataTs, option: { isShowAll?: boolean; time?: number } = {}) {
        // 初始化
        this.stopAnimate()
        this.clearMark()
        this.hideAllLayer()
        if (window.inspectPopup) window.inspectPopup.remove() // 关闭弹窗
        if (levelJsonData) this.levelJsonData = levelJsonData
        if (inspectMapObj) this.inspectMapObj = inspectMapObj
        if (!this.riverLineJsonData) return

        this.runIndex[this.id] = 0
        this.isShowAll = option.isShowAll || false
        // 开始绘制
        levelJsonData && this.initRiverLineJsonData()
        const bbox = turf.bbox(this.riverLineJsonData)
        this.inspectMapObj.fitBounds(bbox, {
            padding: { top: 120, bottom: 60, left: 60, right: 100 }
        })
        this.addAllLayerSource()
        this.addBoatIcon()
        if (!this.isShowAll) { this.animationTimer = setInterval(this.animateLine.bind(this), this.animateTimes) }
        else {
            if (this.inspectMapObj.getLayer('boat-layer')) this.inspectMapObj.setLayoutProperty('boat-layer', 'visibility', 'none')
            // 结束时绘制排污口点位index
            this.drawPointer([{
                longitude: this.endCoordinates[0],
                latitude: this.endCoordinates[1],
                name: '排口',
                code: 'port'
            }])
        }
    }

    /**
     * @name: 清除最终mark点位图标
     */
    clearMark() {
        Object.keys(this.routeMarkers).forEach((key) => {
            let marker = this.routeMarkers[key]
            if (marker) {
                marker.remove()
                marker = null
            }
        })
    }

    /**
     * @name: 暂停动画
     */
    stopAnimate() {
        this.animationTimer && clearInterval(this.animationTimer)
    }

    /**
     * @name: 继续动画效果
     * @desc:
     * @return {*}
     */
    continueAnimate() {
        this.animationTimer = setInterval(this.animateLine.bind(this), this.animateTimes)
    }

    /**
     * 轨迹动画绘制
     */
    animateLine() {
        if (!this.riverLineJsonData) {
            this.animationTimer && clearInterval(this.animationTimer)
            return
        }
        if (!this.runIndex[this.id])
            this.runIndex[this.id] = 0
        this.runIndex[this.id] = this.runIndex[this.id] + 1
        if (this.runIndex[this.id] > this.riverLineJsonData.features.length) {
            this.animationTimer && clearInterval(this.animationTimer)
            console.log('end--------')
            if (this.inspectMapObj.getLayer('boat-layer')) this.inspectMapObj.setLayoutProperty('boat-layer', 'visibility', 'none')
            // 结束时绘制排污口点位index
            this.drawPointer([{
                longitude: this.endCoordinates[0],
                latitude: this.endCoordinates[1],
                name: '排口',
                code: 'port'
            }])
            return
        }
        const currLayerID = `line-layer-${this.id}-${this.runIndex[this.id]}`
        if (this.inspectMapObj.getLayer(currLayerID)) {
            this.inspectMapObj.setLayoutProperty((currLayerID), 'visibility', 'visible')
            if (window.glMap.getLayer('boat-layer')) {
                console.log('object')
                window.glMap.moveLayer(currLayerID, 'boat-layer')
            }
        }
        // 更新无人船位置
        this.updateBoatIcon(this.inspectMapObj.getSource(`line-source-${this.id}-${this.runIndex[this.id]}`)._data.features[0])
    }

    /**
     * marker绘制
     */
    drawPointer(dataList: {
        longitude: number
        latitude: number
        name: string
        code: string
    }[]) {
        dataList.forEach((item) => {
            const icon = getAssetsFile('map/boat/point.png')
            const el = document.createElement('div')
            el.className = 'route-marker'
            const resStr = `<img src=${icon} style='width: 56px; height: 68px;'></img>`
            el.innerHTML = resStr
            const coordinates = [item.longitude, item.latitude]
            el.addEventListener('click', (e) => {
                e.stopPropagation()
                const subPopup = createApp(InspectMapPop, {
                    properties: { ...item, mapObj: this.inspectMapObj },
                })
                this._showPopupOnMap(this.inspectMapObj, coordinates, subPopup)
            })
            if (!this.routeMarkers) this.routeMarkers = {}
            let marker = this.routeMarkers[item.code]
            if (marker) {
                marker.remove()
                marker = null
            }
            this.routeMarkers[item.code] = new mapboxgl.Marker(el).setOffset([0, -26]).setLngLat(coordinates).addTo(this.inspectMapObj)
        })
    }

    /**
     * 地图弹框弹出
     * @param coordinates 经纬度信息
     * @param popContent 弹框名称
     */
    _showPopupOnMap(inspectMapObj: any, coordinates: number[], popContent: any) {
        if (window.inspectPopup) window.inspectPopup.remove()
        const parent = document.createElement('div')
        window.inspectPopup = new mapboxgl.Popup({
            className: 'blue-popup',
            closeOnClick: true,
            closeButton: false,
            offset: [0, 5],
        })
            .setLngLat(coordinates)
            .setDOMContent(popContent.mount(parent).$el)
            .setMaxWidth('none')
            .addTo(inspectMapObj)
    }

    /**
     * 更新无人船位置
     * @param feature 当前所处线段
     */
    updateBoatIcon(feature: JSONDataTs['features'][0]) {
        const boatData = this.inspectMapObj.getSource('boat-source')._data
        // 更新位置
        boatData.features[0].geometry.coordinates = feature.geometry.coordinates[0]
        // 计算角度
        let bearing = turf.bearing(feature.geometry.coordinates[0], feature.geometry.coordinates[1])
        bearing = bearing + 180
        boatData.features[0].properties.bearing = bearing
        this.inspectMapObj.getSource('boat-source').setData(boatData)
    }

    /**
     * 根据数值范围获取颜色
     * @param value
     */
    getColor(value: number) {
        let color = null
        for (let i = 0; i < colorLevel.length; i++) {
            if (value >= colorLevel[colorLevel.length - 1].down) {
                color = colorLevel[colorLevel.length - 1].color
                break
            }
            if (colorLevel[i].up > value && colorLevel[i].down <= value) {
                color = colorLevel[i].color
                break
            }
        }
        return color || 'rgba(255,255,255,0.6)'
    }

    /**
     * 训练插值模型
     */
    train() {
        const t: number[] = []; const x: number[] = []; const y: number[] = []
        this.levelJsonData.features.forEach((data) => {
            if (!data.properties) return
            t.push(data.properties.value)
            x.push(data.geometry.coordinates[0] as number)
            y.push(data.geometry.coordinates[1] as number)
        })
        const fitModel = kriging.train(t, x, y, 'exponential', 0, 226)
        return fitModel
    }

    /**
     * 添加无人船图标
     */
    addBoatIcon(img?: HTMLImageElement) {
        !this.inspectMapObj.hasImage('boat')
        && this.inspectMapObj.loadImage(img || boatImg, (_error: any, image: any) => {
            this.inspectMapObj.addImage('boat', image)
        })
        if (!this.inspectMapObj.getSource('boat-source')) {
            this.inspectMapObj.addSource('boat-source', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: [
                        {
                            type: 'Feature',
                            properties: {

                            },
                            geometry: {
                                type: 'Point',
                                coordinates: [120.016309, 30.28009]
                            }
                        }
                    ]
                }
            })
        }
        if (!this.inspectMapObj.getLayer('boat-layer')) {
            this.inspectMapObj.addLayer({
                id: 'boat-layer',
                type: 'symbol',
                source: 'boat-source',
                layout: {
                    'icon-image': 'boat',
                    'icon-size': 0.5,
                    'icon-rotate': ['get', 'bearing'],
                    'icon-rotation-alignment': 'map',
                    'icon-allow-overlap': true,
                    'icon-ignore-placement': true
                }
            })
        }
        else { this.inspectMapObj.setLayoutProperty('boat-layer', 'visibility', 'visible') }
    }

    hideAllLayer() {
        if (!this.riverLineJsonData) return
        for (let i = 0; i < this.riverLineJsonData.features.length; i++) {
            const currLayerID = `line-layer-${this.id}-${i}`
            if (this.inspectMapObj.getLayer(currLayerID)) this.inspectMapObj.setLayoutProperty((currLayerID), 'visibility', 'none')
        }
    }

    /**
     * 添加数据资源（更新数据资源）
     * @param sourceName<string> 资源名称
     * @param jsonData<GeoJson> 地理数据
     * @param options<Object> （可选参数）
     */
    _addSourceToMap(sourceName: string, jsonData: any) {
        if (!this.inspectMapObj.getSource(sourceName)) {
            this.inspectMapObj.addSource(sourceName, {
                type: 'geojson',
                data: jsonData,
                lineMetrics: true
            })
        }
        else {
            this.inspectMapObj.getSource(sourceName).setData(jsonData)
        }
    }

    /**
     * 添加数据资源（更新数据资源）
     * @param sourceName<string> 资源名称
     * @param jsonData<GeoJson> 地理数据
     * @param options<Object> （可选参数）
     */
    _addLinerLayer(currLayerID: string, currSourceId: string, colorArr: string[]) {
        if (this.inspectMapObj.getLayer(currLayerID))
            this.inspectMapObj.removeLayer(currLayerID)
        this.inspectMapObj.addLayer({
            id: currLayerID,
            type: 'line',
            source: currSourceId,
            paint: {
                'line-gradient': [
                    'interpolate',
                    ['linear'],
                    ['line-progress'],
                    0, colorArr[0],
                    1, colorArr[1]
                ],
                'line-width': 8
            },
            layout: {
                'visibility': this.isShowAll ? 'visible' : 'none',
                'line-cap': 'round',
                'line-join': 'round'
            }
        })
    }
}
