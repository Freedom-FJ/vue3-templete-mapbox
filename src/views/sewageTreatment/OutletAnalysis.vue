<!--
 * @Author: Tian
 * @Date: 2022-09-06 08:57:18
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-14 08:54:29
 * @Description:
-->

<template lang="pug">
.analysis-algae
    AnalysisPanel
    OutletAnalysisLeft
    OutletAnalysisRight
</template>

<script setup lang="ts">
import { getAssetsFile } from '@/utils/tools'
import Nearby from '@/utils/map/mapBox-circle'
import MapUtil from '@/utils/map/mapUtils'
const line1 = {
    type: 'FeatureCollection',
    name: 'line1',
    crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:EPSG::4490' } },
    features: [
        { type: 'Feature', properties: { Name: 'line1', description: null, timestamp: null, begin: null, end: null, altitudeMode: null, tessellate: 1, extrude: 0, visibility: -1, drawOrder: null, icon: null }, geometry: null },
        { type: 'Feature', properties: { Name: null, description: null, timestamp: null, begin: null, end: null, altitudeMode: null, tessellate: null, extrude: null, visibility: null, drawOrder: null, icon: null }, geometry: { type: 'LineString', coordinates: [[120.011399323810309, 30.279594457890909, 0.0], [120.011303435717195, 30.279905303907082, 0.0], [120.012170221930376, 30.28014281133774, 0.0], [120.012090982539149, 30.280390645178425, 0.0]] } }
    ]
}
const line2 = {
    type: 'FeatureCollection',
    name: 'line2',
    crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:EPSG::4490' } },
    features: [
        { type: 'Feature', properties: { id: 1 }, geometry: { type: 'MultiLineString', coordinates: [[[120.011401, 30.279596], [120.011305, 30.279905], [120.010776, 30.279849]]] } }
    ]
}
const line3 = {
    type: 'FeatureCollection',
    name: 'line3',
    crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
    features: [
        { type: 'Feature', properties: { id: 1 }, geometry: { type: 'MultiLineString', coordinates: [[[120.011403, 30.279596], [120.011258, 30.280053]]] } }
    ]
}
const line5 = {
    type: 'FeatureCollection',
    name: 'line5',
    crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:EPSG::4490' } },
    features: [
        { type: 'Feature', properties: { id: 1 }, geometry: { type: 'MultiLineString', coordinates: [[[120.011401, 30.279598], [120.011305, 30.279906], [120.011645, 30.279996], [120.0116, 30.280141]]] } }
    ]
}
const line4 = {
    type: 'FeatureCollection',
    name: 'line4',
    crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:EPSG::4490' } },
    features: [
        { type: 'Feature', properties: { id: 8 }, geometry: { type: 'MultiLineString', coordinates: [[[120.012090982539149, 30.280388959233946], [120.012205626764768, 30.280041654668086]]] } },
        { type: 'Feature', properties: { id: 1 }, geometry: { type: 'MultiLineString', coordinates: [[[120.010130801190982, 30.279783688859315], [120.011319063501574, 30.279907024341938], [120.012175983437089, 30.280143828034031], [120.012861519385524, 30.28031156363684]]] } },
        { type: 'Feature', properties: { id: 2 }, geometry: { type: 'MultiLineString', coordinates: [[[120.010427866768595, 30.280020492849037], [120.010530697160888, 30.27967022007839]]] } },
        { type: 'Feature', properties: { id: 3 }, geometry: { type: 'MultiLineString', coordinates: [[[120.012467336215181, 30.280597700179907], [120.012650145801416, 30.280020492849037]]] } },
        { type: 'Feature', properties: { id: 4 }, geometry: { type: 'MultiLineString', coordinates: [[[120.010115838351552, 30.279896892642054], [120.011291356423655, 30.280056807988377], [120.012786705188404, 30.280460804652776]]] } },
        { type: 'Feature', properties: { id: 5 }, geometry: { type: 'MultiLineString', coordinates: [[[120.010716222283364, 30.2800820577799], [120.01080319378751, 30.279736977295727]]] } },
        { type: 'Feature', properties: { id: 6 }, geometry: { type: 'MultiLineString', coordinates: [[[120.011541048806507, 30.280345777824717], [120.011664492231745, 30.27992775349836]]] } },
        { type: 'Feature', properties: { id: 7 }, geometry: { type: 'MultiLineString', coordinates: [[[120.011214291402027, 30.280198447506063], [120.011330621572142, 30.279814052161328]]] } }
    ]
}
const data = reactive({
    circleObject: {} as any,
    animationIdMap: {} as Record<string, any>,
    indexMap: {} as Record<string, any>,
    lineData: {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: []
            }
        }]
    }
})
/**
 * 绘制圆圈
 * @param lnglat 经纬度
 * @param radius 半径 米
 */
const drawCircle = (lnglat: number[], radius: number) => {
    const pollutantNearby = new Nearby('', {
        name: 'pollutantNearby',
        contaniereId: 'app',
        lnglat,
        analyse: (val: Record<string, any>) => {
            console.log(val, 'vvv')
        },
        radius
    })
    return pollutantNearby
}
onMounted(() => {
    data.circleObject = drawCircle([120.010130801190982, 30.279783688859315], 400)
    drawMapLines()
})

/**
 * 绘制动画轨迹
 * @param id 图层id
 * @param geomData 几何数据
 */
const drawDynamicLine = (id: strNum, geomData: Record<string, any>) => {
    const lineData = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: []
            }
        }]
    }

    let count = 0.0
    geomData.features.forEach((feature: Record<string, any>) => {
        count += (1.0 / geomData.features.length)
        feature.properties.value = count
        // line2、line3、line5 显示绿色，不计算渐变
        if (['line2', 'line3', 'line5'].includes(id as string))
            feature.properties.value = 0
    })

    window.glMap.addSource(`line-source-${id}`, {
        type: 'geojson',
        data: null,
        lineMetrics: true
    })

    window.glMap.addLayer({
        id: `line-layer-${id}`,
        type: 'line',
        source: `line-source-${id}`,
        paint: {
            'line-color': [
                'interpolate',
                ['linear'],
                ['get', 'value'],
                0, '#0bef2a',
                0.1, '#76de0d',
                0.2, '#a6ef1e',
                0.3, '#eff60d',
                0.4, '#e5db1b',
                0.5, '#ec9514',
                0.6, '#e75614',
                0.7, '#fc4214',
                0.8, '#e82311',
                0.9, '#ee1d1d',
                1.0, '#e7001a'
            ],
            'line-width': 8
        },
        layout: {
            'line-cap': 'round',
            'line-join': 'round'
        }
    })

    data.animationIdMap[id] = setInterval(animateLine, 200, id, geomData)
}
/**
 * 动画回调，更新线条数据
 * @param id 图层id
 * @param geomData 几何数据
 */
const animateLine = (id: strNum, geomData: Record<string, any>) => {
    if (!data.indexMap[id])
        data.indexMap[id] = 0

    data.indexMap[id] = data.indexMap[id] + 1
    if (data.indexMap[id] >= geomData.features.length) {
        clearInterval(data.animationIdMap[id])
        return
    }
    data.lineData.features = geomData.features.slice(0, data.indexMap[id])
    window.glMap.getSource(`line-source-${id}`).setData(data.lineData)
}
/**
 *添加管网线
 */
const addLine = () => {
    window.glMap.addSource('pipe-source', {
        type: 'geojson',
        data: line4
    })
    window.glMap.addLayer({
        id: 'pipe-layer',
        type: 'line',
        source: 'pipe-source',
        paint: {
            'line-color': '#00DDFF',
            'line-width': 8
        },
        layout: {
            'line-cap': 'round',
            'line-join': 'round'
        }
    })
}
/**
 * 绘制点位
 */
const addPoint = () => {
    window.glMap.loadImage(getAssetsFile('video/point-3.png'), (error: any, image: any) => {
        console.log(error)
        window.glMap.addImage('img1', image)
    })
    window.glMap.loadImage(getAssetsFile('video/point-2.png'), (error: any, image: any) => {
        console.log(error)
        window.glMap.addImage('img2', image)
    })
    window.glMap.addLayer({
        id: 'outlet-points',
        type: 'symbol',
        source: {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [
                    {
                        type: 'Feature',
                        properties: {
                            image: 'img1'
                        },
                        geometry: {
                            type: 'Point',
                            coordinates: [120.0112144060597, 30.28019653245216]
                        }
                    },
                    {
                        type: 'Feature',
                        properties: {
                            image: 'img2'
                        },
                        geometry: {
                            type: 'Point',
                            coordinates: [120.0120907971015, 30.28039328134556]
                        }
                    },
                    {
                        type: 'Feature',
                        properties: {
                            image: 'img1'
                        },
                        geometry: {
                            type: 'Point',
                            coordinates: [120.011397814924, 30.27959637716098]
                        }
                    },
                    // {
                    //     type: 'Feature',
                    //     properties: {
                    //         image: 'img2'
                    //     },
                    //     geometry: {
                    //         type: 'Point',
                    //         coordinates: [120.0122484601919, 30.27987069101885]
                    //     }
                    // }
                ]
            }
        },
        layout: {
            'icon-image': ['get', 'image'],
            'icon-size': 0.75,
            'icon-offset': [0, -20]
        }
    })
}
const drawMapLines = () => {
    // 数据分段
    const chunk1 = turf.lineChunk(line1, 0.003, { units: 'kilometers' })
    const chunk2 = turf.lineChunk(line2, 0.003, { units: 'kilometers' })
    const chunk3 = turf.lineChunk(line3, 0.003, { units: 'kilometers' })
    const chunk5 = turf.lineChunk(line5, 0.003, { units: 'kilometers' })
    // 绘制管网线
    addLine()
    // 绘制动画轨迹
    drawDynamicLine('line1', chunk1)
    drawDynamicLine('line2', chunk2)
    drawDynamicLine('line3', chunk3)
    drawDynamicLine('line5', chunk5)
    // 绘制图标点
    addPoint()
}

// 组件销毁
onUnmounted(() => {
    // 移除圆圈
    data.circleObject && data.circleObject.hide()
    Object.keys(data.animationIdMap).forEach((item) => {
        const curr = data.animationIdMap[item]
        curr && clearInterval(curr)
    })
    // 清除管网以及点位
    MapUtil._showOrHideMapLayerById(['outlet-points', 'pipe-layer', 'line-layer-line1', 'line-layer-line2', 'line-layer-line3', 'line-layer-line5'], 'hide')
    // 返回主视图
    MapUtil._initHomeView()
})
</script>

<style lang="scss" scoped>
.inspect {
    position: absolute;
    top: 140px;
    left: 50%;
    z-index: 999;
    width: 1280px;
    margin-left: -640px;
}
</style>

<style lang="scss">
.nearby-search-control {
    position: absolute;
    z-index: 990;
    width: 24px;
    height: 20px;
    font-size: 12px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    cursor: move;
    background: #000;
    border-radius: 10px;

    &::before {
        position: absolute;
        top: 4px;
        left: 0;
        width: 12px;
        height: 12px;
        content: "";
        background-image: url("@/assets/images/left2.svg");
        background-repeat: no-repeat;
        background-size: 12px 12px;
    }

    &::after {
        position: absolute;
        top: 4px;
        right: 0;
        width: 12px;
        height: 12px;
        content: "";
        background-image: url("@/assets/images/right2.svg");
        background-repeat: no-repeat;
        background-size: 12px 12px;
    }

    .inner {
        position: absolute;
        top: 50%;
        left: 25px;
        height: 24px;
        padding: 0 6px;
        overflow: hidden;
        line-height: 24px;
        text-align: center;
        white-space: nowrap;
        background: #000;
        border: 0;
        border-radius: 100px;
        /* stylelint-disable-next-line color-function-notation */
        box-shadow: 0 0 4px 0 rgb(0 0 0 / 0.2);
        transform: translateY(-50%);
    }

    .inner-new {
        position: relative;
        width: 76px;
        height: 24px;
        overflow: visible;
        cursor: pointer;
        background-color: #000;
        border-radius: 12px;

        .el-dropdown {
            position: relative;
            width: 76px;
            cursor: pointer;
        }
    }
}
</style>

