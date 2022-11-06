import SimpleDrag from './simpleDrag'
export default class Nearby {
    constructor(map, options) {
        this.map = map // 地图对象
        this.id = options.contaniereId // 控件的上级domId
        this.name = options.name || 'nearby-instance' // 实例的名称
        this.radius = options.radius || 5000 // 半径（单位：米）
        this.analyse = options.analyse // 重绘圆时的回调函数
        this.affirmClcik = options.affirmClcik // 点击确认
        this.onClose = options.onClose || null // 关闭时的回调函数
        this.confirmWhether = options.confirmWhether || false // 是否显示确认按钮
        this.radiusType = options.radiusType || 1
        this.type = options.type || 'nearby'
        this.circleColor = options.color || '#3296FA'
        this.allfillColor = options.fillColor || 'rgba(0, 221, 255, 0.2)'
        this.circleData = null // 圆的json数据
        this.init(options.lnglat)
    }

    // 初始化
    /**
     *
     * @param {Array} lnglat 中心点经纬度
     * @param {Boolean} needScale 是否需要重新缩放
     */
    init(lnglat) {
        // 移除控制器（比较保险的方式移除）
        const doms = document.getElementsByClassName('nearby-search-control')
        Array.from(doms).forEach(domItem => domItem.remove())

        // 同步中心点坐标
        this.lnglat = lnglat || this.lnglat || []
        // 实例状态
        this.active = true
        this.destroyed = false

        // 画中心marker
        this._addCenterMarker()

        // //画圆圈
        this._drawCircle()

        // 构建圆圈的控制器
        this._createControlDot()
        //绑定地图事件
        this._initMapEvent()

        // 初始化先分析一次
        this._analysis()
        this._upDataMapView()
    }
    //地图事件
    _initMapEvent() {
        window.glMap.on('movestart', this._movestart.bind(this))
        window.glMap.on('moveend', this._moveend.bind(this))
        window.glMap.on('zoomstart', this._zoomstart.bind(this))
        window.glMap.on('zoomend', this._zoomend.bind(this))
    }
    _movestart() {
        if (!this.active) return false
        this.control.style.display = 'none'
    }

    _moveend() {
        if (!this.active) return false
        this.control.style.display = 'block'
        this._updateRadiusNodePosition()
    }

    _zoomstart() {
        if (!this.active) return false
        this.control.style.display = 'none'
    }

    _zoomend() {
        if (!this.control || !this.active) return false
        this.control.style.display = 'block'
        this._updateRadiusNodePosition()
    }

    // 更新地图位置
    _upDataMapView() {
        const nowBbox = this.circleData.bbox
        const nowBounds = [
            [nowBbox[0], nowBbox[3]],
            [nowBbox[2], nowBbox[1]]
        ]
        window.glMap.fitBounds(nowBounds, {
            padding: { top: 150, bottom: 100, left: 15, right: 15 } // 根据页面头部菜单 底栏高度，调整合适的参数
        })
    }

    // 生成距离米
    _createControlDot() {
        this.control = document.createElement('div')
        this.inner = document.createElement('div')
        this.close = document.createElement('div')
        this.radiusText = document.createElement('span')
        this.affirm = document.createElement('div')
        this.inner.className = 'inner'
        this.radiusText.innerHTML = this.radius + '米'
        if(this.confirmWhether == true ) {
            this.affirm.className = 'affirm'
            this.affirm.innerHTML = '确认'
        }
        this.close.className = 'close'
        this.close.innerHTML = 'x'
        this.control.className = 'nearby-search-control iconfont iconrange'
        this.control.id = Math.random()
            .toString(36)
            .substr(2)
        document.getElementById(this.id).appendChild(this.control)
        this.control.appendChild(this.inner)
        this.inner.appendChild(this.radiusText)
        this.inner.appendChild(this.close)
        this.control.appendChild(this.affirm)
        this._updateRadiusNodePosition()
        new SimpleDrag(this.control.id, {
            LockY: true,
            onMove: (...pos) => {
                this._onControllerMoving(pos)
            },
            onStop: () => {
                this._analysis()
                let bounds = this.circleData.bbox
                let bbox = [[bounds[0],bounds[1]], [bounds[2],bounds[3]]];
                // window.glMap.fitBounds(bbox, {
                //     padding: {top: 140, bottom:60, left: 15, right: 15}  // 根据页面头部菜单 底栏高度
                // })
            },
        })
        //点击关闭按钮
        this.close.onmouseup = e => {
            this.destroy()
            e.stopPropagation()
            return false
        }
        // 点击确认按钮
        this.affirm.onmouseup = e => {
            this.affirmClcik(e)
            e.stopPropagation()
            return false
        }
        //fix-me
        this.close.onmousedown = e => {
            e.stopPropagation()
            return false
        }
    }

    // 中心处的marker
    _addCenterMarker() {
        if (window.centerMarker) window.centerMarker.remove()
        const coordinates = this.lnglat
        const el = document.createElement('div')
        el.className = 'location-marker'
        el.innerHTML = '<div class="location-marker-img" style="width: 14px; height: 14px;border: 2px solid #FFFFFF;background: #3296FA;border-radius: 50%;"></div>'
        window.centerMarker = new mapboxgl.Marker(el).setLngLat(coordinates).addTo(window.glMap)
    }

    // 画圈
    _drawCircle() {
        // marker ?
        this.circleData = this.createCircle(this.lnglat, this.radius, 64)
        if (!window.glMap.getSource('nearby-circle')) {
            window.glMap.addSource('nearby-circle', { type: 'geojson', data: this.circleData })
            window.glMap.addLayer({
                id: 'tool-nearby-circle',
                type: 'fill',
                source: 'nearby-circle',
                paint: { 'fill-color': this.allfillColor, 'fill-outline-color': this.circleColor },
            })
        }
        else {
            window.glMap.getSource('nearby-circle').setData(this.circleData)
            if (window.glMap.getLayer('tool-nearby-circle')) {
                window.glMap.setLayoutProperty('tool-nearby-circle', 'visibility', 'visible')
            }
            else {
                window.glMap.addLayer({
                    id: 'tool-nearby-circle',
                    type: 'fill',
                    source: 'nearby-circle',
                    paint: { 'fill-color': this.allfillColor, 'fill-outline-color': this.circleColor },
                })
            }
        }
    }

    createCircle(center, radius, points) {
        if (!points) points = 64

        const coords = {
            longitude: center[0],
            latitude: center[1],
        }

        const km = radius / 1000.0

        const ret = []
        const distanceX = km / (111.32 * Math.cos((coords.latitude * Math.PI) / 180))
        const distanceY = km / 110.574

        let theta, x, y
        for (let i = 0; i < points; i++) {
            theta = (i / points) * (2 * Math.PI)
            x = distanceX * Math.cos(theta)
            y = distanceY * Math.sin(theta)

            ret.push([coords.longitude + x, coords.latitude + y])
        }
        ret.push(ret[0])

        return {
            type: 'FeatureCollection',
            bbox: [coords.longitude - distanceX, coords.latitude - distanceY, coords.longitude + distanceX, coords.latitude + distanceY],
            features: [
                {
                    type: 'Feature',
                    geometry: {
                        type: 'Polygon',
                        coordinates: [ret],
                    },
                },
            ],
        }
    }
    // 设置控制器的位置
    _updateRadiusNodePosition() {
        // let bounds = this.circleData.getBounds()
        let bounds = this.circleData.bbox

        let target = [bounds[2], (bounds[3] + bounds[1]) / 2]

        let point = window.glMap.project(target)

        let left = point.x
        let top = point.y
        if (left > 3762) {
            left = 3762
        }
        this.control.style.left = left - 12 + 'px'
        this.control.style.top = top - 12 + 'px'
    }

    // 控制器移动
    _onControllerMoving(leftTop) {
        // console.log("控制器移动")
        let x = leftTop[0]
        let y = leftTop[1]
        let lnglatObj = window.glMap.unproject([x + 12, y + 12])
        let from = [lnglatObj.lng,lnglatObj.lat]
        let to = this.lnglat
        let options = {units: 'miles'};
        let radius = parseInt(turf.distance(turf.point(from), turf.point(to), options) * 1609.344);

        // 拖动半径时 溯源范围切换到自定义
        let radiusType = 'auto'
        this._update(radius, radiusType)

    }

    // 更新缓冲区
    _update(radius, radiusType) {
        // console.log("更新缓冲区")
        this.radiusType = radiusType
        this.radius = radius
        if(this.confirmWhether == true ) {
            this.affirm.className = 'affirm'
            this.affirm.innerHTML = '确认'
        }
        this.radiusText.innerHTML = this.radius + '米'
        this._drawCircle()
        // this.refresh()
    }
    // 触发分析的回调
    _analysis() {
        const bounds = this.circleData.bbox
        const extent = {
            xmax: bounds[2],
            xmin: bounds[0],
            ymax: bounds[3],
            ymin: bounds[1],
        }
        this.analyse(this, extent)
    }

    /**
     *
     * @param {Array} pos 点位的横纵坐标
     * @param {Function} cb 点在缓冲区域的回调
     */
    // 测量两地理坐标间距离
    checkPoint(pos, cb) {
        const pt = new mapboxgl.LngLat(pos[1], pos[0])
        const center = new mapboxgl.LngLat(this.lnglat[0], this.lnglat[1])
        const distance = center.distanceTo(pt).toFixed(0)
        const inCircle = Number(distance) <= Number(this.radius)
        cb && inCircle && cb()
        return inCircle
    }

    /**
     * 重新分析
     * @param {Array} lnglat 重置经纬度进行再次分析，可选参数
     */
    reset(lnglat) {
        this.hide()
        this.init(lnglat)
    }

    destroy() {
        if (this.destroyed) return false
        this.destroyed = true
        this.hide()
        if (window.centerMarker) window.centerMarker.remove()
        window.miterDom && window.miterDom.remove()

    }

    restore() {
        if (!this.destroyed) return false
        this.init()
    }

    // 展示
    show() {
        if (this.destroyed) return false
        this.init(null, false)
    }

    // 隐藏
    hide() {
        if (!this.active) return false
        this.active = false
        // 移除控制器（比较保险的方式移除）
        const doms = document.getElementsByClassName('nearby-search-control')
        Array.from(doms).forEach(domItem => domItem.remove())

        if (this.centerMarker) this.centerMarker.remove()

        // 关闭监听
        window.glMap._listeners.movestart && window.glMap._listeners.movestart.forEach((func) => {
            if (func.name.includes('_movestart')) window.glMap.off('movestart', func)
        })
        window.glMap._listeners.moveend && window.glMap._listeners.moveend.forEach((func) => {
            if (func.name.includes('_moveend')) window.glMap.off('moveend', func)
        })
        window.glMap._listeners.zoomstart && window.glMap._listeners.zoomstart.forEach((func) => {
            if (func.name.includes('_zoomstart')) window.glMap.off('zoomstart', func)
        })
        window.glMap._listeners.zoomend && window.glMap._listeners.zoomend.forEach((func) => {
            if (func.name.includes('_zoomend')) window.glMap.off('zoomend', func)
        })

        // 隐藏圆
        if (window.glMap.getLayer('tool-nearby-circle'))
            window.glMap.setLayoutProperty('tool-nearby-circle', 'visibility', 'none')
        // 移除中心点位
        window.centerMarker.remove()
    }

    // 经纬度转网络墨卡托
    lnglat2WebMercator(lat, lng) {
        const earthRad = 6378137.0
        const x = ((lng * Math.PI) / 180) * earthRad
        const a = (lat * Math.PI) / 180
        const y = (earthRad / 2) * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)))
        return [y, x]
    }

    // 网络墨卡托转经纬度
    webMercator2LngLat(y, x) {
        const lng = (x / 20037508.34) * 180
        let lat = (y / 20037508.34) * 180
        lat = (180 / Math.PI) * (2 * Math.atan(Math.exp((lat * Math.PI) / 180)) - Math.PI / 2)
        return [lat, lng]
    }
}
