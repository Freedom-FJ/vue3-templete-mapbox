/*
 * @Author: mjh
 * @Date: 2022-08-29 09:17:57
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-08 11:21:46
 * @Description: 
 */
declare module '*.yml' {
    const datas: any
    export default datas
}
declare module 'lodash-es'
declare module '@/utils/map/mapBox-circle'
declare module '@element-plus/icons-vue'
declare module 'echarts/lib/echarts'
declare module 'echarts/lib/echarts.js'
declare module '@static/json/yhWaterLine.json'
declare module '@static/json/yh-boundary.json'
declare module '@static/json/data.json'
declare module '@static/json/line.json'
declare module '@static/json/jsonStyle.json'
declare module '@static/json/imgStyle.json'

declare const mapboxgl: any

declare const turf: any

declare const EchartsLayer: any

declare const kriging: any

declare interface Window {
    glMap: any
    glPopup: any
    glTooltip: any
    inspectPopup: any
    _imgSourcePath: any
    _mapLayerIdArr: any
    locationMarkerWithCircle: any
    clickPointMarker: any
    _mapMarkerObjArr: any
    echartslayer: any // 危废运输迁徙图
    countryMarker: any
    checkMarker: any // 未处置点位样式
}
declare const mapboxWind: any

declare interface echarts {
    glMap: any
}

// 海康视频
declare const JSEncrypt: any
declare const WebControl: any
declare const showCBInfo: (str: string) => void

interface popTs { currentPop:string, popData?:any }

type record = Record<string, any>
type recordt<T> = Record<string, T>
type Arrayable<T> = T | T[]
type strNum  = string | number


