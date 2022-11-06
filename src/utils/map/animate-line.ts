/**
 * AnimateRoute 动态点轨迹
 * options {
 *     layerId: 动态点图层的id（保证唯一性）
 *     routeGeoJson: 单线GeoJson数据
 *     imgPath: 图片路径
 *     imgName: 图片名称
 * }
 */
import { getAssetsFile } from '../tools'
export default class AnimateRoute {
    layerId: number | string
    routeGeoJson: any
    imgPath: string
    imgName: string
    isPlay: boolean
    counter: number
    steps: number
    aLength: number
    animatePointGeoJson: any
    newRouteGeoJson: any
    constructor(options: { layerId: number | string
        routeGeoJson: any
        imgPath: string
        imgName: string
    }) {
        this.layerId = options.layerId
        this.routeGeoJson = options.routeGeoJson // 单线数据
        this.imgPath = options.imgPath || 'map/water/arrow/' // 图片路径
        this.imgName = options.imgName || 'car.png' // 图片名称
        this.isPlay = false
        this.counter = 0
        this.steps = 0
        this.aLength = 0
        this.init()
    }

    // 初始化
    init() {
        // 动态点的位置
        this.animatePointGeoJson = {
            type: 'FeatureCollection',
            features: [
                {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'Point',
                        coordinates: [],
                    },
                },
            ],
        }
        this.animatePointGeoJson.features[0].geometry.coordinates = this.routeGeoJson.geometry.coordinates[0]
        this.aLength = this.routeGeoJson.geometry.coordinates.length
        this.newRouteGeoJson = this._resetRoute(this.routeGeoJson, 1000, 'kilometers')
        this.steps = this.newRouteGeoJson.geometry.coordinates.length
        this._addImageSourceToMap(this.imgPath, this.imgName)
    }

    // 添加图片资源

    _addImageSourceToMap(imgPath: string, imageName: string) {
        const imageLoadPromise = []

        const imgSource = imageName
        if (!window.glMap.hasImage(imgSource)) {
            const image_data = getAssetsFile(`${imgPath}${imageName}`)
            const img = new Image()
            img.src = image_data
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
        // 判断是否有图标资源需要加载
        if (imageLoadPromise.length !== 0) {
            Promise.all(imageLoadPromise).then(() => {
                this._addAnimatePointSource(imageName)
            })
        }
        else {
            this._addAnimatePointSource(imageName)
        }
    }

    // 添加动态点图层
    _addAnimatePointSource(imageName?: string) {
        window.glMap.addLayer({
            id: this.layerId,
            type: 'line',
            // minzoom: 10,
            source: {
                type: 'geojson',
                data: this.animatePointGeoJson,
            },
            layout: {
                'line-miter-limit': 2,
                'line-join': 'miter'
            },
            paint: {
                'line-color': '#00E87E',
                'line-width': 6
            }
            // layout: {
            //     'icon-image': imageName,
            //     // 'icon-image': 'water-country-1',
            //     'icon-size': 1,
            //     'icon-rotate': ['get', 'bearing'],
            //     'icon-rotation-alignment': 'map',
            //     'icon-allow-overlap': true,
            //     'icon-ignore-placement': true,
            // },
        })

        this._animate()
        this._start()
    }

    //
    _resetRoute(route: { geometry: { coordinates: any } }, nstep: any, units: any) {
        const newRoute: {
            type: string
            geometry: {
                type: string
                coordinates: number[]
        } } = {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: [],
            },
        }
        // 控制节点数
        const nDistance = 0.026 // bigger = faster
        for (let i = 0; i < this.aLength - 1; i++) {
            const from = turf.point(route.geometry.coordinates[i])
            const to = turf.point(route.geometry.coordinates[i + 1])
            const lDistance = turf.distance(from, to, { units })
            if (i === 0)
                newRoute.geometry.coordinates.push(route.geometry.coordinates[0])

            if (lDistance > nDistance) {
                const rings = this._lineMore(from, to, lDistance, nDistance, units)
                newRoute.geometry.coordinates = newRoute.geometry.coordinates.concat(rings)
            }
            else {
                newRoute.geometry.coordinates.push(route.geometry.coordinates[i + 1])
            }
        }
        return newRoute
    }

    //
    _animate() {
        if (this.counter >= this.steps)
            this.counter = 0

        let startPnt, endPnt
        if (this.counter === 0) {
            startPnt = this.newRouteGeoJson.geometry.coordinates[this.counter]
            endPnt = this.newRouteGeoJson.geometry.coordinates[this.counter + 1]
        }
        else if (this.counter !== 0) {
            startPnt = this.newRouteGeoJson.geometry.coordinates[this.counter - 1]
            endPnt = this.newRouteGeoJson.geometry.coordinates[this.counter]
        }

        this.animatePointGeoJson.features[0].properties.bearing = turf.bearing(turf.point(startPnt), turf.point(endPnt))
        // console.log('this.animatePointGeoJson.features[0].properties.bearing:',this.animatePointGeoJson.features[0].properties.bearing);
        this.animatePointGeoJson.features[0].geometry.coordinates = this.newRouteGeoJson.geometry.coordinates[this.counter]

        if (window.glMap.getSource(this.layerId)) window.glMap.getSource(this.layerId).setData(this.animatePointGeoJson)

        this.counter = this.counter + 5
        if (this.isPlay)
            requestAnimationFrame(this._animate.bind(this))
    }

    //
    _lineMore(from: any, to: any, distance: number, splitLength: number, units: any) {
        const step = parseInt((distance / splitLength).toString())
        const leftLength = distance - step * splitLength
        const rings = []
        const route = turf.lineString([from.geometry.coordinates, to.geometry.coordinates])
        for (let i = 1; i <= step; i++) {
            const nlength = i * splitLength
            const pnt = turf.along(route, nlength, { units })
            rings.push(pnt.geometry.coordinates)
        }
        if (leftLength > 0)
            rings.push(to.geometry.coordinates)

        return rings
    }

    // 开始动画
    _start() {
        if (!this.isPlay)
            this.isPlay = true

        this._animate()
    }

    // 结束动画
    _remove() {
        this.isPlay = false
        this.counter = 0
        // this._animate()
        // 移除图层
        if (window.glMap.getLayer(this.layerId)) window.glMap.removeLayer(this.layerId)
        if (window.glMap.getSource(this.layerId)) window.glMap.removeSource(this.layerId)
    }
}
