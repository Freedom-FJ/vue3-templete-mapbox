/**
 * 与 地图操作、点位图层（图标点位、圆形点位、聚合点位）...相关的公共方法
 * 方法：
 *      _addImageToMap              添加图片资源
 *      _addSourceToMap             添加数据资源
 *      _renderMapLayer             渲染点位图层
 *
 *      _addHoverEventToLayer       添加鼠标悬浮事件
 *      _showPopupOnMap             在地图上展示弹窗
 *      _zoomToCenterWhenShowPopup  移动地图使弹窗点位居中
 *      _initHomeView               还原主视图
 *
 *      _removeMapLayer             移除图层
 *      _showOrHideMapLayer         显示或隐藏图层
 *      _hideAllMapLayers           隐藏地图所有图层
 *      _hideClusterByName          隐藏指定聚合图层
 *      _hideAllClusterLayer        隐藏所有聚合图层
 *      _removeAllHtmlMarker        移除所有Marker
 *      _removeHtmlMarker           移除指定Marker
 *      _removeMapboxPopup          关闭地图弹窗
 *
 *      _booleanPointInPolygon      判断点是否在杭州区域
 *      _addLocationMarker          添加定位标记（研判分析中心点）
 *      _addPointClickedMarker      添加地图点位选中状态
 *      _getCommonGeoJson           组织GeoJson数据
 */

import HZ_polygon from '@static/json/yh-boundary.json'
import { useMapStore } from '@/store/map'
import { getAssetsFile } from '@/utils/tools'
// 图标资源
const imgList: Record<string, any> = {
    water: import.meta.globEager('../../assets/map/water/*.png'),
}
const MapUtil = {
    /**
     * 添加图片资源（图片需存放在 assets 目录下）
     * @param imgPath 图片路径
     * @param imgNameArr 图片文件名
     * @param format 图片文件后缀
     * @param type<String> 类型（例：gas(气) | water(水) | earth(土) | ...）
     *
     * 例：图片路径为 'assets/path/myPng.png'，
     * 调用：_addImageToMap('path/', ['myPng'], '.png', 'myType')
     * 执行结果：在地图中添加名为 'myType-myPng' 的图片资源。
     */
    async _addImageToMap(imgPath: string, imgNameArr: string[], format: string, type: string) {
        const imageLoadPromise: any[] = []
        imgNameArr.forEach((imageName: string) => {
            const imgSource = type === '' ? imageName : `${type}-${imageName}`
            // window._imgSourcePath 记录图片资源对应的存储路径
            if (!window._imgSourcePath) window._imgSourcePath = {}
            if (!Object.prototype.hasOwnProperty.call(window._imgSourcePath, imgSource)) window._imgSourcePath[imgSource] = imgPath + imageName + format
            if (!window.glMap.hasImage(imgSource)) {
                let imageData
                try {
                    imageData = getAssetsFile(`${imgPath}/${imageName}.${format}`)
                }

                catch (e) {
                    throw new Error(` (_addImageToMap:) 图标文件@assets/${imgPath + imageName + format}不存在。\n${e}`)
                }
                const img = new Image()
                img.src = imageData
                imageLoadPromise.push(
                    new Promise((resolve) => {
                        img.onload = (e) => {
                            // 避免重复加载
                            if (!window.glMap.hasImage(imgSource))
                                window.glMap.addImage(imgSource, img)

                            resolve(e)
                        }
                    }),
                )
            }
        })
        // 判断是否有图标资源需要加载
        if (imageLoadPromise.length !== 0)
            await Promise.all(imageLoadPromise)
    },

    /**
     * @name: 添加点位选中或者未处置样式
     * @param {number} checkPointList  坐标数组
     */
    addCheckMarker(checkPointList: number[][]) {
        checkPointList.forEach((item) => {
            const el = document.createElement('div')
            el.className = 'map-check-box'
            el.innerHTML = `
            <div class="map-check-point" >
                <b></b>
            </div>`
            const coor = item
            if (!window.checkMarker) window.checkMarker = {}
            let marker = window.checkMarker[item.toString()]
            if (marker) {
                marker.remove()
                marker = null
            }
            window.checkMarker[item.toString()] = new mapboxgl.Marker(el)
                .setLngLat([coor[0], coor[1]])
                .addTo(window.glMap)
        })
    },
    /**
     * @name: 清除所有选中点位样式
     */
    clearAllCheckMarker() {
        MapUtil._removeHtmlMarker(window.checkMarker)
    },
    /**
     * 处理将DOM元素转换为图片
     * @param {string} imgName       需要处理的DOM元素上绑定的id
     * */
    async handleDomConversionImage(dom: HTMLDivElement, option: { name: string; height: number; width: number }) {
        const { name, height, width } = option
        const imgSource = name
        if (window.glMap.hasImage(imgSource)) return
        // 获取需要下载成图片的DOM元素
        if (!dom) return
        // 获取dom下面所有的img标签
        const imgDomArray = dom.querySelectorAll('img')
        await this.handleImageUrlConversionBase64(imgDomArray)
        // 将DOM元素转换svg
        const svgUrl = `
            data:image/svg+xml;charset=utf-8,
            <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
                <foreignObject x="0" y="0" width="100%" height="100%">
                    ${new XMLSerializer().serializeToString(dom)}
                </foreignObject>
            </svg>
        `
        svgUrl.replace(/\n/g, '').replace(/\t/g, '').replace(/#/g, '%23')

        // 将svg转换为base64
        const base64 = await this.getUrlBase64(svgUrl)
        window.glMap.loadImage(base64, (error: Error, image: HTMLImageElement) => {
            if (error) throw error
            !window.glMap.hasImage(imgSource) && window.glMap.addImage(imgSource, image)
        })
    },
    /**
     * 将节点内的所有img标签的src转成base64
     * @param {array} domArray      imgDOM的数组
     * */
    handleImageUrlConversionBase64(domArray: NodeListOf<HTMLImageElement>) {
        return new Promise((resolve) => {
            // 创建promise数组
            const promiseArray = []

            // 循环设置promiseAll所需要的promise数组
            for (let i = 0; i < domArray.length; i++) {
                promiseArray.push(new Promise((resolve) => {
                    // 调用方法将图片转换为base64
                    this.getUrlBase64(domArray[i].src).then((base64Url: any) => {
                        domArray[i].src = base64Url
                        resolve('')
                    })
                }))
            }

            Promise.all(promiseArray).then(() => {
                resolve('')
            })
        })
    },
    /**
     * 下载图片
     * @param {string} url          图片路径 必须是base64
     * @param {string} name         下载后的图片名称
     * */
    downloadImage(url: string, name: string) {
        // 创建a标签
        const a = document.createElement('a')
        // 设置下载后的名称
        a.download = name
        // 设置href
        a.href = url
        // 向body中添加a标签
        document.body.appendChild(a)
        // 触发a标签的点击事件
        a.click()
        // 移除a标签
        document.body.removeChild(a)
    },
    /**
     * 判断点位是否在杭州区域
     * @param coordinates<Array> [lng, lat]
     */
    _booleanPointInPolygon(coordinates: number[]) {
        // 判断参数是否合法
        const lng = coordinates[0]
        const lat = coordinates[1]
        if (!lng && !lat) return false

        const pt = turf.point(coordinates)
        const polygonPoints = HZ_polygon.features[0].geometry.coordinates[0]
        const poly = turf.polygon([polygonPoints])
        return turf.booleanPointInPolygon(pt, poly)
    },
    /**
     * 将网络图片转化为base64
     * @param {string} url          网络图片地址
     * @param {number} width        图片的宽度
     * @param {number} height       图片的宽度
     * */
    getUrlBase64(url: string, width = -1, height = -1) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const image = new Image()
            image.setAttribute('crossOrigin', 'Anonymous')
            image.src = url
            image.onload = () => {
                canvas.width = width === -1 ? image.width : width
                canvas.height = height === -1 ? image.height : height;
                (ctx as any).drawImage(image, 0, 0, width === -1 ? image.width : width, height === -1 ? image.height : height)
                const dataURL = canvas.toDataURL()
                resolve(dataURL)
            }
        })
    },
    /**
     * 添加数据资源（更新数据资源）
     * @param sourceName<string> 资源名称
     * @param jsonData<GeoJson> 地理数据
     * @param options<Object> （可选参数）
     */
    _addSourceToMap(sourceName: string, jsonData: any, options = {}) {
        if (!window.glMap.getSource(sourceName)) {
            window.glMap.addSource(sourceName, {
                type: 'geojson',
                data: jsonData,
                ...options,
            })
        }
        else {
            window.glMap.getSource(sourceName).setData(jsonData)
        }
    },
    /**
     * 渲染点位图层（通过该方法添加的图层，id会存入window._mapLayerIdArr，可以通过_hideAllMapLayers方法统一隐藏）
     * @param layerOption<Object> 参数
     * @param beforeLayerId<String> 置于指定图层下面 （JN1为style文件中的第一个点图层）
     * @param andShow 如果图层已存在，是否直接显示（兼顾水、气的图层加载方式）
     * @returns {string|null} 图层的名称（可在业务组件中对图层做处理。如：添加鼠标事件）
     */
    _renderMapLayer(layerOption: any, beforeLayerId = '', andShow = true) {
        // 判断图层引用的source是否存在
        const layerId = layerOption.id
        const tempSource = layerOption.source
        if (!tempSource || (Object.prototype.toString.call(tempSource) === '[object String]' && !window.glMap.getSource(tempSource)))
            throw new Error(` (_renderMapLayer:) 图层${layerId}指向的资源${tempSource}不存在`)

        // window._mapLayerIdArr 记录加载的图层id
        if (!window._mapLayerIdArr.includes(layerId) && !layerId.includes('Cluster'))
            window._mapLayerIdArr.push(layerId)

        // 加载图层
        if (!window.glMap.getLayer(layerId)) {
            if (!window.glMap.getLayer(beforeLayerId))
                beforeLayerId = ''

            window.glMap.addLayer(layerOption, beforeLayerId)

            return layerId
        }
        else {
            // 地图中已经存在该图层
            if (andShow) this._showOrHideMapLayerById(layerId, 'show')
            // 此时不再返回图层名字。（并且无需再次绑定事件）
            return null
        }
    },
    /**
     * 添加鼠标悬浮事件
     * @param layerId<String> 图层名称
     * @param nameField<String> 悬浮显示的字段名称
     */
    _addHoverEventToLayer(layerId: string, nameField = 'name') {
        window.glMap.on('mouseenter', layerId, (e: any) => {
            window.glMap.getCanvas().style.cursor = 'pointer'
            let coordinates = e.features[0].geometry.coordinates.slice()
            if (Object.prototype.toString.call(coordinates[0]) === '[object Array]') {
                let long = 0; let lat = 0
                coordinates.forEach((item: number[]) => {
                    long += item[0]
                    lat += item[1]
                })
                const length = coordinates.length
                coordinates = [long / length, lat / length]
            }
            const description = e.features[0].properties[nameField]
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180)
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360

            if (window.glTooltip) window.glTooltip.remove()
            window.glTooltip = new mapboxgl.Popup({
                className: 'mapbox-tooltip',
                closeOnClick: false,
                closeButton: false,
            })
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(window.glMap)
            window.glMap.triggerRepaint()
        })

        window.glMap.on('mouseleave', layerId, () => {
            window.glMap.getCanvas().style.cursor = ''
            window.glTooltip.remove()
        })
    },
    /**
     * 添加鼠标进入样式
     * @param layerId
     * @param cursor
     * @private
     */
    _addHoverCursorToLayer(layerId: string, cursor = '') {
        // 鼠标移入样式
        window.glMap.on('mouseenter', layerId, () => {
            window.glMap.getCanvas().style.cursor = cursor
        })
        // 鼠标移出清除样式
        window.glMap.on('mouseleave', layerId, () => {
            window.glMap.getCanvas().style.cursor = ''
        })
    },
    /**
     * 添加定位标记（研判分析中心点）
     * @param coordinates<Array>
     */
    _addLocationMarker(coordinates: number[]) {
        if (window.locationMarkerWithCircle) window.locationMarkerWithCircle.remove()
        const el = document.createElement('div')
        el.className = 'location-marker'
        const img = '@assets/images/map-location.png'
        const circleImg = '@assets/map/gas/alarm-animate.svg'
        el.innerHTML = `<div class="location-marker-img">
                            <img src=${img} style="width: 20px">
                            <img style="width:100px;display:block;height:100px;position:absolute;top:-12px;left:-40px;z-index: 900;" src=${circleImg}>
                          </div>`
        // 创建Marker
        if (window.locationMarkerWithCircle) window.locationMarkerWithCircle.remove()
        window.locationMarkerWithCircle = new mapboxgl.Marker({
            element: el,
            anchor: 'bottom',
            offset: [0, 8],
        })
            .setLngLat(coordinates)
            .addTo(window.glMap)
    },
    /**
     * 添加动态圆图标
     */
    _addPointClickedMarker(imgSourceName: string, coordinates: number[], type: string, DynamicCircle: any, width?: number) {
        const fileList = imgList[type]
        if (window.clickPointMarker) window.clickPointMarker.remove()
        const el = document.createElement('div')
        el.className = 'location-marker'
        const img = fileList[`../../assets/${window._imgSourcePath[imgSourceName]}`].default
        el.innerHTML = `<div class="location-marker-img">                         
                            <img src=${DynamicCircle} style="display:block;position:absolute;transform:translate(-50%, -50%);z-index: 900;width:${width ? (width + 34) : 60}px;">
                            <img src=${img} style="position:absolute;transform:translate(-50%, -50%);width:${width || 26}px;z-index: 900;">
                          </div>`
        // 创建Marker
        if (window.clickPointMarker) window.clickPointMarker.remove()
        window.clickPointMarker = new mapboxgl.Marker({
            element: el,
            anchor: 'bottom',
            // offset: [0, 8],
        })
            .setLngLat(coordinates)
            .addTo(window.glMap)
    },
    /**
     * 在地图上展示弹窗
     * @param coordinates 弹窗位置
     * @param popContent 弹窗实例
     * @param popHeight<Number> （可选参数）如果需要将弹窗移至屏幕中央，此参数设置为弹窗高度
     * @param offset<Array> （可选参数）[x,y] 向右平移 x，向下平移 y
     */
    _showPopupOnMap(coordinates: number[], popContent: any, popHeight: any = null, offset = [0, 5], popId?: string) {
        const mapStore = useMapStore()
        if (popHeight) this._zoomToCenterWhenShowPopup(coordinates, popHeight)
        // 打开弹窗
        if (window.glPopup) window.glPopup.remove()
        const parent = document.createElement('div')
        window.glPopup = new mapboxgl.Popup({
            className: 'blue-popup',
            closeOnClick: true,
            closeButton: false,
            offset,
        })
            .setLngLat(coordinates)
            .setDOMContent(popContent.mount(parent).$el)
            .setMaxWidth('none')
            .addTo(window.glMap)

        mapStore.setMapPop({
            coordinates,
            id: popId || ''
        })
        // 窗口关闭时：取消点位动态效果
        window.glPopup.once('close', () => {
            // window.glMap.scrollZoom.enable() // 缩放
            // window.glMap.dragRotate.enable() // 旋转
            // window.glMap.dragPan.enable() // 拖到
            if (window.clickPointMarker) {
                setTimeout(() => {
                    if (!window.glPopup.isOpen()) {
                        window.clickPointMarker.remove()
                        mapStore.closeMapPop()
                    }
                }, 500)
            }
            else {
                setTimeout(() => {
                    if (!window.glPopup.isOpen())
                        mapStore.closeMapPop()
                }, 100)
            }
        })
    },
    /**
     * 移动地图使弹窗点位居中
     * @param coordinates 弹窗坐标
     * @param popupHeight 弹窗高度
     */
    _zoomToCenterWhenShowPopup(coordinates: number[], popupHeight = 450) {
        if (window.glMap.getPitch() === 0) {
            // 二维模式
            const screenLocation = window.glMap.project(coordinates) // lnglat -> xy
            screenLocation.y = screenLocation.y - popupHeight / 2
            const newCoordinates = window.glMap.unproject(screenLocation) // xy -> lnglat
            const latDeviation = newCoordinates.lat - coordinates[1]
            window.glMap.easeTo({
                center: [coordinates[0], coordinates[1] + latDeviation],
                speed: 0.6,
                curve: 1.0,
            })
        }
        else {
            window.glMap.easeTo({
                center: [coordinates[0], coordinates[1] + 0.01],
                speed: 0.6,
                curve: 1.0,
            })
        }
    },
    /**
     * 隐藏地图所有点位图层 (只隐藏 window._mapLayerIdArr 中记录的 ID)
     */
    _hideAllMapLayers() {
        // this._logErrMessage('MapUtil: 隐藏地图所有点位图层', 'log')
        const tempLayerIdArr = [...window._mapLayerIdArr]
        tempLayerIdArr.forEach((layerId) => {
            this._showOrHideMapLayerById(layerId, 'hide')
        })
    },
    /**
     * 显示或隐藏单个、多个图层
     * @param layerIds<String|Array> 图层名字。String:隐藏单个图层；Array：隐藏多个图层
     * @param showOrHide<String> 显示或隐藏。'show' | 'hide'
     * @private
     */
    _showOrHideMapLayer(layerIds: string | string[], showOrHide: string) {
        // 传参为字符串：隐藏单个
        if (Object.prototype.toString.call(layerIds) === '[object String]') {
            const layerId = layerIds
            this._showOrHideMapLayerById(layerId, showOrHide)
        }
        // 传参为数组：隐藏多个
        if (Object.prototype.toString.call(layerIds) === '[object Array]') {
            const tempLayerIdArr = [...layerIds]
            tempLayerIdArr.forEach((layerId) => {
                this._showOrHideMapLayerById(layerId, showOrHide)
            })
        }
    },
    /**
     * 移除图层 （支持移除一个或多个图层）
     * @param layerIds<String|Array> 图层名字。String:单个图层；Array：多个图层
     * @private
     */
    _removeMapLayer(layerIds: string | string[]) {
        // 传参为字符串
        if (Object.prototype.toString.call(layerIds) === '[object String]') {
            const layerId = layerIds
            this._removeLayerById(layerId as string)
        }
        // 传参为数组
        if (Object.prototype.toString.call(layerIds) === '[object Array]') {
            const tempLayerIdArr = [...layerIds]
            tempLayerIdArr.forEach((layerId) => {
                this._removeLayerById(layerId)
            })
        }
    },
    /**
     * 移除指定图层
     * @param layerId
     */
    _removeLayerById(layerId: string) {
        if (window.glMap.getLayer(layerId)) window.glMap.removeLayer(layerId)
    },
    /**
     * 显示或隐藏指定图层
     * @param layerId<string> 图层名称
     * @param showOrHide<String> 显示或隐藏。'show' | 'hide'
     */
    _showOrHideMapLayerById(layerId: string | string[], showOrHide: string) {
        // 传参错误
        if (!['show', 'hide'].includes(showOrHide))
            throw new Error(` (_showOrHideMapLayerById:) 参数showOrHide不合法：${showOrHide}`)

        const isVisible = showOrHide === 'show' ? 'visible' : 'none'
        if (typeof layerId === 'object') {
            layerId.forEach((item) => {
                if (window.glMap.getLayer(item))
                    window.glMap.setLayoutProperty(item, 'visibility', isVisible)
            })
        }
        else
        if (window.glMap.getLayer(layerId)) { window.glMap.setLayoutProperty(layerId, 'visibility', isVisible) }
    },
    /**
     * 关闭地图弹窗
     */
    _removeMapboxPopup() {
        if (window.glPopup) window.glPopup.remove() // 关闭弹窗
        if (window.glTooltip) window.glTooltip.remove() // 关闭提示
        if (window.clickPointMarker) window.clickPointMarker.remove() // 关闭点动态
    },
    /**
     * 移除所有的htmlMarker(保存到全局变量 _mapMarkerObjArr 中的 marker)
     */
    _removeAllHtmlMarker() {
        if (window._mapMarkerObjArr && window._mapMarkerObjArr.length > 0) {
            const tempArr = [...window._mapMarkerObjArr]
            tempArr.forEach((markerItem) => {
                markerItem.remove()
            })
        }
        window._mapMarkerObjArr = []
    },
    /**
     * 移除指定的htmlMarker
     * @param markers
     */
    _removeHtmlMarker(markers: any) {
        if (Object.prototype.toString.call(markers) === '[object Array]') {
            markers.forEach((markerItem: any) => {
                markerItem.remove()
            })
        }
        else if (Object.prototype.toString.call(markers) === '[object Object]') {
            Object.keys(markers).forEach((key) => {
                let mk = markers[key]
                if (mk) {
                    mk.remove()
                    mk = null
                    delete markers[key]
                }
            })
        }
        else {
            console.log('markers不是数组也不是对象')
        }
    },
    /**
     * 还原主视图
     */
    _initHomeView() {
        window.glMap.flyTo({
            center: [119.91405, 30.41918],
            zoom: 10.2,
            bearing: 0,
            pitch: 0,
        })
    },
    /**
     * 组织GeoJson数据（要素列表套壳）
     * @param features<Array> 要素列表
     */
    _getCommonGeoJson(features: any = []) {
        return {
            type: 'FeatureCollection',
            crs: {
                type: 'name',
                properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
            },
            features,
        }
    },
    /**
     * 在鼠标移入位置显示tooltip
     * @param layerId
     * @param nameFields
     */
    showThematicTooltip(layerId: string, nameFields: Array<string>) {
        window.glMap.on('mouseenter', layerId, (e: any) => {
            window.glMap.getCanvas().style.cursor = 'pointer'
            const prop = e.features[0].properties
            let description = ''
            nameFields.forEach((nameField) => {
                if (prop[nameField])
                    description = prop[nameField]
            })
            if (window.glTooltip) window.glTooltip.remove()
            window.glTooltip = new mapboxgl.Popup({
                className: 'mapbox-tooltip',
                closeOnClick: false,
                closeButton: false,
            })
                .setLngLat(e.lngLat)
                .setHTML(description)
                .addTo(window.glMap)
            window.glMap.triggerRepaint()
        })

        window.glMap.on('mouseleave', layerId, () => {
            window.glMap.getCanvas().style.cursor = ''
            window.glTooltip.remove()
        })
    },
}
export default MapUtil
