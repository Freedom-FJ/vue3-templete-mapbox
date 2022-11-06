/*
 * @Author: mjh
 * @Date: 2022-09-26 19:25:01
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-13 19:46:14
 * @Description:
 */
import dayjs from 'dayjs'
import MapUtil from '@/utils/map/mapUtils'
import type { JSONDataTs } from '@/types/common'
import { getSetTreeCode } from '@/utils/treeDataUtils'
import service from '@/service/api'
import { layerDictionaries } from '@/utils/map/layerSource'
let yhWaterLine: JSONDataTs | null = null
let yhRiverGridMain: JSONDataTs | null = null
let yhRiverGridTown: JSONDataTs | null = null
let siteData: any = []
let echartslayer: any = null

// 设置颜色梯度
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

/**
 * @name: 控制水流向暴露方法
 * @param {boolean} isShow true 显示隐藏
 * @return {*}
 */
export const controlWaterFlow = (isShow: boolean) => {
    if (isShow)
        addWaterFlowLayer()
    else
        removeWaterFlowLayer()
}
/**
 * @name: 控制水插值暴露方法
 * @param {boolean} isShow true 显示隐藏
 * @return {*}
 */
export const controlWaterInterpolation = (isShow: boolean) => {
    if (isShow) {
        if (!yhRiverGridMain) loadGeomData(isShow)
        else
            addInterpolationLayer(isShow)
    }

    else { MapUtil._showOrHideMapLayer([layerDictionaries.INTERPOLATION_LAYER1, layerDictionaries.INTERPOLATION_LAYER2], 'hide') }
}
/**
 * 加载水系网格数据
 */
export const loadGeomData = async (showInterpolation: boolean) => {
    const treeData = await getSetTreeCode()
    const params = {
        treeType: 1,
        treeId: treeData.slice(0, 6),
        stationCodes: '1',
        factorFlag: true,
        exceptionFlag: false,
        factorGroupId: '8',
        controlLevel: '001,002,003,004,005,006,007,009',
        monitoringMethods: ''
    }
    Promise.all([service<JSONDataTs, true>('publicMap/getYhRiverGridMain'), service<JSONDataTs, true>('publicMap/getYhRiverGridTown'), service('publicMap/queryStationList', params)]).then((res) => {
        yhRiverGridMain = res[0]
        yhRiverGridTown = res[1]
        siteData = res[2] // 加载监测站点数据
        addInterpolationLayer(showInterpolation)
    })
}

/**
 * 创建水流向图层
 */
const addWaterFlowLayer = async () => {
    // 组织数据
    const riverData: any = []
    if (!yhWaterLine)
        yhWaterLine = await import('@static/json/yhWaterLine.json')
    if (!yhWaterLine) return
    yhWaterLine.features.forEach((featureItem: any) => {
        if (featureItem.geometry.type === 'LineString') {
            const dataItem = {
                coords: featureItem.geometry.coordinates,
                lineStyle: {
                    normal: {
                        color: 'rgba(90,161,223,0.1)',
                    },
                },
            }
            riverData.push(dataItem)
        }
    })
    // 图表参数
    const option = {
        animation: false,
        GLMap: {
            roam: true,
        },
        coordinateSystem: 'GLMap',
        geo: {
            map: 'GLMap',
        },
        series: [
            {
                type: 'lines',
                polyline: true,
                data: riverData,
                silent: true,
                lineStyle: {
                    normal: {
                        opacity: 0.2,
                        width: 1,
                    },
                },
                progressiveThreshold: 500,
                progressive: 100,
            },
            {
                type: 'lines',
                coordinateSystem: 'GLMap',
                polyline: true,
                data: riverData,
                lineStyle: {
                    normal: {
                        width: 0.8,
                    },
                },
                effect: {
                    constantSpeed: 15, // 动态圆点的速度
                    show: true,
                    trailLength: 0.4, // 动态圆点的尾巴长度
                    symbolSize: 3, // 动态圆点的大小
                    color: 'rgba(8,169,244,1)',
                },
            },
        ],
    }
    // 加载echarts流向图层
    echartslayer = new EchartsLayer(window.glMap)
    echartslayer && echartslayer.chart.setOption(option)
}

/**
 * 销毁水流向图层
 */
const removeWaterFlowLayer = () => {
    echartslayer && echartslayer.remove()
}

/**
 * 添加插值图层
 */
const addInterpolationLayer = async (showInterpolation: boolean) => {
    if (window.glMap.getLayer(layerDictionaries.INTERPOLATION_LAYER1) === undefined || window.glMap.getLayer(layerDictionaries.INTERPOLATION_LAYER2) === undefined) {
        // 构造插值数据
        const t = [] as any
        const x = [] as any
        const y = [] as any
        setValueRange(t, x, y)
        siteData[0].data.forEach((d: Record<string, any>) => {
            // 经纬度去重
            const index = x.indexOf(d.longitude)
            if (index > 0) {
                if (y[index] === d.latitude)
                    return
            }
            if (d.level != null && checkCoordinate(d)) {
                t.push(d.level)
                x.push(parseFloat(d.longitude))
                y.push(parseFloat(d.latitude))
            }
        })
        if (t.length === 0)
            return
        // 训练数据集
        let fitModel = await kriging.train(t, x, y, 'exponential', 0, 226)
        // 遍历网格中心点计算插值
        yhRiverGridMain && yhRiverGridMain.features.forEach((feature: any) => {
            const point = turf.center(feature)
            const grade = kriging.predict(point.geometry.coordinates[0], point.geometry.coordinates[1], fitModel)
            const color = getColor(fitModel, grade)
            feature.properties.color = color
        })
        yhRiverGridTown && yhRiverGridTown.features.forEach((feature: any) => {
            const point = turf.center(feature)
            const grade = kriging.predict(point.geometry.coordinates[0], point.geometry.coordinates[1], fitModel)
            const color = getColor(fitModel, grade)
            feature.properties.color = color
        })
        fitModel = null
        // 添加图层
        window.glMap.addSource('wq-kriging-source-1', {
            type: 'geojson',
            data: yhRiverGridMain
        })
        window.glMap.addSource('wq-kriging-source-2', {
            type: 'geojson',
            data: yhRiverGridTown
        })
        window.glMap.addLayer({
            id: layerDictionaries.INTERPOLATION_LAYER1,
            type: 'fill',
            source: 'wq-kriging-source-1',
            layout: {
                visibility: showInterpolation ? 'visible' : 'none'
            },
            paint: {
                'fill-color': ['get', 'color']
            }
        })
        window.glMap.addLayer({
            id: layerDictionaries.INTERPOLATION_LAYER2,
            type: 'fill',
            source: 'wq-kriging-source-2',
            layout: {
                visibility: showInterpolation ? 'visible' : 'none'
            },
            paint: {
                'fill-color': ['get', 'color']
            },
            minzoom: 12
        })
        // 将点位图层放在 插值图层之上
        if (window.glMap.getLayer(layerDictionaries.INTERPOLATION_LAYER2) && window.glMap.getLayer(layerDictionaries.INTERPOLATION_LAYER1)) {
            if (window.glMap.getLayer(layerDictionaries.MAP_COMMON_POINT)) {
                window.glMap.moveLayer(layerDictionaries.INTERPOLATION_LAYER2, layerDictionaries.MAP_COMMON_POINT)
                window.glMap.moveLayer(layerDictionaries.INTERPOLATION_LAYER1, layerDictionaries.MAP_COMMON_POINT)
            }
            if (window.glMap.getLayer(layerDictionaries.ANALYSIS_DISTANCE_POINT)) {
                window.glMap.moveLayer(layerDictionaries.INTERPOLATION_LAYER2, layerDictionaries.ANALYSIS_DISTANCE_POINT)
                window.glMap.moveLayer(layerDictionaries.INTERPOLATION_LAYER1, layerDictionaries.ANALYSIS_DISTANCE_POINT)
            }
        }
    }
    else {
        MapUtil._showOrHideMapLayer(layerDictionaries.INTERPOLATION_LAYER1, 'show')
        MapUtil._showOrHideMapLayer(layerDictionaries.INTERPOLATION_LAYER2, 'show')
    }
}

/**
 * 设置插值范围
 * @param t
 * @param x
 * @param y
 */
const setValueRange = (t: Array<number>, x: Array<number>, y: Array<number>) => {
    // min
    t.push(1)
    x.push(116.35)
    y.push(39.96)
    // max
    t.push(6)
    x.push(116.36)
    y.push(39.97)
}
/**
 * 获取插值颜色
 * @param variogram 插值模型
 * @param value 数值
 */
const getColor = (variogram: any, value: number) => {
    const range = variogram.t.max() - variogram.t.min()
    let z = (value - variogram.t.min()) / range
    if (z < 0.0) z = 0.0
    if (z > 1.0) z = 1.0
    if (isNaN(z)) z = 0.0
    return colors[Math.floor((colors.length - 1) * z)]
}

/**
 * 检查坐标值是否正常
 * @param data
 */
const checkCoordinate = (coordinate: any) => {
    // 判断是否是数字
    if (isNaN(parseFloat(coordinate.longitude)) || isNaN(parseFloat(coordinate.latitude)))
        return false

    // 判断是否在中国范围内
    if (coordinate.longitude < 73.2 || coordinate.longitude > 135.0)
        return false

    if (coordinate.latitude < 15.7 || coordinate.latitude > 53.9)
        return false

    return true
}
