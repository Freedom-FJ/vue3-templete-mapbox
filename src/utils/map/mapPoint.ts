import type { stationCodeToTypeListTs } from '@/utils/commonMethods/factor'
import { getFactorGroupList, getFactorListByStationCode } from '@/utils/commonMethods/factor'
import service from '@/service/api'
import MapUtil from '@/utils/map/mapUtils'
import { showMapPop } from '@/utils/map/mapInit'
import { getSetTreeCode } from '@/utils/treeDataUtils'
import type { mapPopName } from '@/types/map'
import type { mapPointNewLayerPartChildTs, mapPointNewLayerTs } from '@/types/common'

export type QueryTimeTypeEnum = 'hour' | 'day' | 'week' | 'month' | 'year'
export type StationCode = '1' | '2' | '3' | '5' | '6' | '8' | '10' | '12' | '38' | '40' | '50' | '51' | '52' | '53' | '54' | '56' | '57' | '58' | '59' | '108' | '1,40' | '-1' | 'lao'
export type DataTimeTypeEnum = 60 | 1440
export type TreeTypeEnum = 0 | 1
let pointTypeList: string[] = [] // 临时记录当前请求点位对于的类型
export interface pointMainTs {
    name: string
    symbolImgName?: string
    longitude: strNum
    latitude: strNum
}
export interface pointDrawMainTs extends pointMainTs {}
export type returnDataTs = {
    grade?: number
    accessCode: string
    id: string
    name: string
    longitude: strNum
    latitude: strNum
    overProof: boolean
    stationCode?: string
    monitoringMethods?: number
    address: string
    symbolImgName?: string
    controlLevel?: string
    property?: string
    level?: number
    regionId: string
    watershedId: string
    stationType: string
    time: string
    queryTimeType: QueryTimeTypeEnum
    online?: number // 排口数量
    status?: number
    runState: number | null
    waterType: string
    isRiverCourse?: true // 是否是河道显示类型
    waterQuality?: string
    rainLevel: number // 雨晴点位等级标识
    isMonitor: 0 | 1 // 污水处理 是否在线标识
    sectionType?: '001' | '002' // 河流站/ 湖库站
    dischargeDirection?: Arrayable<string> // 污染源点位类型
    borderSituation: string // 交接断面
    isShowBorder?: boolean // 对应是否显示交接断面图标
    typeCode?: StationCode // 对呀点位类型
    enterpriseType?: '108' // 畜牧养殖点位专属标识
    isAnalysis: boolean // 是否在研判分析页面
    pollutants?: string
    chiefName?: string
    watershedName?: string
    regionName?: string
    pictureUrls?: string
}[]
export type returnPointTypeDataTs = {
    code: strNum
    name: string
    data: any
}[]

export interface sewageReturnPointTypeDataTs {
    code: string
    success: boolean
    data: returnPointTypeDataTs
}
/**
 * 入口参数，历史数据、周边查询参数合并传入
 */
export interface MainParams {
    treeType: number
    treeId: string
    factorFlag: boolean
    exceptionFlag: boolean
    monitoringMethods: string
}

interface pointParams {
    borderSituation?: string
    controlLevel?: string
    factorGroupId: string
    stationCodes: string
    stationType?: string
    isKey?: string | 0 | 1
}
interface sendParams extends pointParams, MainParams { }

let waterSufaceIsCheck: {
    controlLevelList: string[]
    isCheckBorder: boolean
} = {
    controlLevelList: [],
    isCheckBorder: false
}
/**
 * 地图点位获取
 * @param mainParams 重要请求传参
 * @param layerPoint 图层选择情况
 */
export async function getAllPoint(layerPoint: mapPointNewLayerTs, mainParams?: MainParams): Promise<returnPointTypeDataTs> {
    pointTypeList = []
    const treeData = await getSetTreeCode()
    const limtParams = mainParams || {
        treeType: 1,
        treeId: treeData.slice(0, 6),
        factorFlag: true,
        exceptionFlag: false,
        monitoringMethods: ''
    }
    let promiseList: Promise<any>[] = []
    let currPromiseList: Promise<any>[] = []
    const sourceList: { code: mapPointNewLayerPartChildTs[]; isKey: 0 | 1 }[] = []
    MapUtil._showOrHideMapLayerById(['yh_ys', 'yh_ws'], 'hide')
    for (const item in layerPoint) {
        const currCodes = layerPoint[item]
        if (!currCodes.children) continue
        switch (currCodes.name) {
        case '水环境': // 地表水
            waterSufaceIsCheck = {
                controlLevelList: [],
                isCheckBorder: false
            }
            currPromiseList = await waterSurfaceLayer(currCodes.children, limtParams)
            promiseList = [...promiseList, ...currPromiseList]
            break
        case '饮用水': // 饮用水
        case '藻类监测': // 藻类监测
            promiseList.push(await waterDrinkLayer(currCodes.children, limtParams))
            break
        case '重点源': // 重点源
            sourceList.push({ code: currCodes.children, isKey: 1 })
            break
        case '非重点源': // 非重点源
            sourceList.push({ code: currCodes.children, isKey: 0 })
            break
        case '污水处理': // "污水处理"
            promiseList.push(await waterDrinkLayer(currCodes.children, limtParams, true))
            break
        case '河长制': // 监测点 告示牌
        case '水雨情': // 水文 雨晴 气象站
            currPromiseList = await waterRainLayer(currCodes.children, limtParams)
            promiseList = [...promiseList, ...currPromiseList]
            break
        case '海洋': // 入海排污口, 入海溪闸
            currPromiseList = await waterSeaLayer(currCodes.children, limtParams)
            promiseList = [...promiseList, ...currPromiseList]
            break
        case '山塘':
        case '水厂':
        case '设施':
            // eslint-disable-next-line no-case-declarations
            const currPromise = detailFacilities(currCodes.children, limtParams)
            currPromise && promiseList.push(currPromise)
            break
        case '饮用水源地':
        case '控制单元':
        case '引水工程':
        case '小微水体':
            break
        default:
            break
        }
    }
    if (sourceList.length) {
        const currWaterPromise = await keySourcesLayer(sourceList, limtParams)
        promiseList = [...promiseList, ...currWaterPromise]
    }
    const res: returnPointTypeDataTs[] | sewageReturnPointTypeDataTs[] = await Promise.all(promiseList)
    detailPointReturnPromise(res, pointTypeList)
    return (res as returnPointTypeDataTs[]).flat(1)
}

/**
 * @name: 处理请求返回点位数据
 * @param {returnPointTypeDataTs} res 请求返回
 * @param {string} pointType 对应每一项的code值
 * @return {*}
 */
export const detailPointReturnPromise = (res: returnPointTypeDataTs[] | sewageReturnPointTypeDataTs[], pointType: string[]) => {
    res.forEach((item, index) => {
        console.log(pointType, 'res')
        // 特殊处理污染源接口 因为污染源接口回传参数会包一层data
        if ((item as sewageReturnPointTypeDataTs).data) res[index] = (item as sewageReturnPointTypeDataTs).data
        const currItem = res[index] as returnPointTypeDataTs
        const currType = pointType[index]
        if (!['1,40', 'sheshi'].includes(currType)) currItem[0].code = currType
        // 处理交接断面图片
        // 当选择国 省 市 且选择交接断面时  交接断面内的国省市要显示控制级别图标 其他冲突的显示交
        // 不然则显示 交图标
        if (currType === 'border') {
            const currData = currItem[0]
            currData.name = '交接断面'
        }
        if (currType === 'oceanOutlet') {
            const currData = currItem[0]
            currData.name = '入海排污口'
        }
        if (currType === '1,40') {
            currItem.push({
                code: currType,
                name: '藻类检测',
                data: [
                    ...currItem[0].data.map((item) => {
                        return {
                            ...item,
                            typeCode: currItem[0].code.toString() as StationCode
                        }
                    }),
                    ...currItem[1].data.map((item) => {
                        return {
                            ...item,
                            typeCode: currItem[1].code.toString() as StationCode
                        }
                    })
                ]
            })
            currItem.splice(0, 2)
        }
    })
}
/**
 * 地表水预警请求处理
 * @param currCodes 当前地表水选择的类型
 * @param limtParams 基础传参
 */
async function waterSurfaceLayer(currCodes: mapPointNewLayerPartChildTs[], limtParams: MainParams) {
    const returnPromise: Promise<any>[] = []
    const stationCodes = currCodes[0].stationCodes
    const sendObj = {} as Record<keyof pointParams, Arrayable<string>>
    let isHaveBorder = false
    currCodes.forEach((item) => {
        item.attributes.forEach((item) => {
            if (item.code === 'borderSituation') isHaveBorder = true
            if (sendObj[item.code as keyof pointParams]) (sendObj[item.code as keyof pointParams] as string[]).push(item.value)
            else sendObj[item.code as keyof pointParams] = [item.value]
        })
    })
    sendObj.controlLevel && (waterSufaceIsCheck.controlLevelList = [...sendObj.controlLevel])
    waterSufaceIsCheck.isCheckBorder = isHaveBorder
    for (const key in sendObj)
        sendObj[key as keyof pointParams] = (sendObj[key as keyof pointParams] as string[]).join(',')
    sendObj.stationCodes = stationCodes
    const factorObj = await getFactorGroupList('surfaceSection')
    const factorGroupId = factorObj?.id ?? ''
    sendObj.factorGroupId = factorGroupId
    if (sendObj.controlLevel) {
        returnPromise.push(getQuerySurrounding({
            ...sendObj as pointParams,
            borderSituation: '',
            ...limtParams
        }))
        pointTypeList.push('1')
    }

    // 交接断面
    if (isHaveBorder) {
        returnPromise.push(getQuerySurrounding({
            ...limtParams,
            ...sendObj as pointParams,
            controlLevel: '',
        }))
        pointTypeList.push('border')
    }
    return returnPromise
}
/**
 * 饮用水预警请求处理
 * @param currCodes 当前水选择的类型
 * @param limtParams 基础传参
 */
async function waterDrinkLayer(currCodes: mapPointNewLayerPartChildTs[], limtParams: MainParams, isSewage?: boolean) {
    const stationCodes = currCodes[0].stationCodes as StationCode
    const sendObj = {} as Record<keyof pointParams, Arrayable<string>>
    currCodes.forEach((item) => {
        item.attributes.forEach((item) => {
            if (sendObj[item.code as keyof pointParams]) (sendObj[item.code as keyof pointParams] as string[]).push(item.value)
            else sendObj[item.code as keyof pointParams] = [item.value]
        })
    })
    for (const key in sendObj)
        sendObj[key as keyof pointParams] = (sendObj[key as keyof pointParams] as string[]).join(',')
    const factorObj = await getFactorListByStationCode(stationCodes as stationCodeToTypeListTs)
    const factorGroupId = factorObj?.id ?? ''
    sendObj.factorGroupId = factorGroupId
    sendObj.stationCodes = stationCodes
    pointTypeList.push(stationCodes)
    return getQuerySurrounding({
        ...sendObj as pointParams,
        ...limtParams
    }, isSewage)
}
/**
 * 水文 雨晴预警请求处理
 * @param currCodes 当前水选择的类型
 * @param limtParams 基础传参
 */
async function waterRainLayer(currCodes: mapPointNewLayerPartChildTs[], limtParams: MainParams) {
    const returnPromise: Promise<any>[] = []
    await Promise.all(currCodes.map(async (item) => {
        const factorObj = await getFactorListByStationCode(item.stationCodes as stationCodeToTypeListTs)
        const factorGroupId = factorObj?.id ?? ''
        const stationCodes = item.stationCodes
        pointTypeList.push(stationCodes)
        returnPromise.push(getQuerySurrounding({
            ...{
                stationCodes,
                factorGroupId
            },
            ...limtParams
        }))
    }))

    return returnPromise
}
/**
 * 海洋图层 预警请求处理
 * @param currCodes 当前水选择的类型
 * @param limtParams 基础传参
 */
async function waterSeaLayer(currCodes: mapPointNewLayerPartChildTs[], limtParams: MainParams) {
    const returnPromise: Promise<any>[] = []
    await Promise.all(currCodes.map(async (item) => {
        const factorObj = await getFactorListByStationCode(item.stationCodes as stationCodeToTypeListTs)
        const factorGroupId = factorObj?.id ?? ''
        const stationCodes = item.stationCodes
        if (stationCodes === '-1') { // 入海排污
            pointTypeList.push('oceanOutlet')
            const sendObj = {} as Record<keyof pointParams, string>
            item.attributes.forEach((item) => {
                sendObj[item.code as keyof pointParams] = item.value
            })
            returnPromise.push(getQuerySurrounding({
                ...sendObj,
                stationCodes,
                factorGroupId,
                ...limtParams
            }, true))
        }
        else { // 入海溪闸
            pointTypeList.push(stationCodes)
            returnPromise.push(getQuerySurrounding({
                ...{
                    stationCodes,
                    factorGroupId
                },
                ...limtParams
            }))
        }
    }))

    return returnPromise
}

/**
 * @name 污染源请求处理
 * @dec 废水包含 入河和畜牧    入河和畜牧有交集
 * @param currCodes 当前水选择的类型
 * @param limtParams 基础传参
 * @param isKey 0 非重点源 1重点源
 */
async function keySourcesLayer(currCodes: { code: mapPointNewLayerPartChildTs[]; isKey: 0 | 1 }[], limtParams: MainParams) {
    const returnPromise: Promise<any>[] = []
    type attrCode = 'isKey' | 'isIps' | 'dischargeDirection' | 'enterpriseType' | 'stationCodes'
    const isEkey: number[] = [] // '' 0 1
    const factorObj = await getFactorGroupList('companyPollutionSource')
    const factorGroupId = factorObj?.id ?? ''
    let currType: string[] = []
    currCodes.forEach((item) => {
        const currTypeItem: string[] = []
        item.code.forEach((codeItem) => {
            if (codeItem.name === '废水排污口') currTypeItem.push('E')
            if (codeItem.name === '入河排污口') currTypeItem.push('B')
            if (codeItem.name === '畜禽养殖') currTypeItem.push('108')
        })
        if (!currTypeItem.includes('E')) return
        currType = [...currTypeItem, ...currType]
        item.code = []
        isEkey.push(item.isKey)
    })
    // 废水有的话请求
    if (isEkey.length) {
        pointTypeList.push([...new Set(currType)].sort((a, b) => {
            if (a === 'E') return -1 // -1 a，b 不交互
            if (a === '108') return 1 // 1  a,b 交换
            return 0
        }).join(','))
        returnPromise.push(getQuerySurrounding({
            ...{
                stationCodes: '-1', // -1 :全部污染源  6：排水口  8:污水处理厂
                isIps: 1, // 是否污染源，默认填1（仅查污染源）
                isKey: isEkey.join(','), // 是否重点源，两者都有时，可不填
                factorGroupId,
            },
            ...limtParams
        }, true))
    }
    const allCode = currCodes.map(item => item.code).flat(1)
    const ParamsB = {} as Record<attrCode, Arrayable<string>>
    const Params108 = {} as Record<attrCode, Arrayable<string>>
    allCode.forEach((item) => {
        if (item.name === '入河排污口') {
            ParamsB.stationCodes = '-1'
            item.attributes.forEach((attr) => {
                if (attr.code === 'isKey') {
                    ParamsB[attr.code] && (ParamsB[attr.code] as string[]).push(attr.value)
                    !ParamsB[attr.code] && (ParamsB[attr.code] = [attr.value])
                }
                else { ParamsB[attr.code as attrCode] = attr.value }
            })
        }
        else {
            Params108.stationCodes = '-1'
            item.attributes.forEach((attr) => {
                if (attr.code === 'isKey') {
                    Params108[attr.code] && (Params108[attr.code] as string[]).push(attr.value)
                    !Params108[attr.code] && (Params108[attr.code] = [attr.value])
                }
                else { Params108[attr.code as attrCode] = attr.value }
            })
        }
    })
    // 入河
    if (Object.keys(ParamsB).length) {
        pointTypeList.push('B')
        returnPromise.push(getQuerySurrounding({
            ...ParamsB as Record<attrCode, string>,
            isKey: (ParamsB.isKey as string[]).join(','),
            factorGroupId,
            ...limtParams
        }, true))
    }
    // 禽类
    if (Object.keys(Params108).length) {
        pointTypeList.push('108')
        returnPromise.push(getQuerySurrounding({
            ...Params108 as Record<attrCode, string>,
            isKey: (Params108.isKey as string[]).join(','),
            factorGroupId,
            ...limtParams
        }, true))
    }
    return returnPromise
}
/**
 * 点位请求
 * @param querySurroundingParams 请求参数
 * @param isPollution 是否使用污染源接口
 */
async function getQuerySurrounding(querySurroundingParams: sendParams, isPollution?: boolean) {
    try {
        const res: any = await service(!isPollution ? 'publicMap/queryStationList' : 'publicMap/queryMapList', querySurroundingParams, undefined, 'intercept')
        return res
    }
    catch (e) {
        console.error(e)
        return null
    }
}

/**
 * @name: 处理设施图层
 * @param {mapPointNewLayerPartChildTs} currCodes
 * @param {MainParams} limtParams
 */
const detailFacilities = (currCodes: mapPointNewLayerPartChildTs[], limtParams: MainParams) => {
    const stationCodeList: string[] = []
    currCodes.forEach((item) => {
        !isNaN(Number(item.stationCodes)) && stationCodeList.push(item.stationCodes)
        // 判断雨水管网、污水管网，添加管网
        item.name === '雨水管网' && MapUtil._showOrHideMapLayerById('yh_ys', 'show')

        item.name === '污水管网' && MapUtil._showOrHideMapLayerById('yh_ws', 'show')
    })
    if (!stationCodeList.length) return
    pointTypeList.push('sheshi')
    return getQuerySurrounding({
        stationCodes: stationCodeList.join(','),
        factorGroupId: '',
        ...limtParams
    })
}
/**
 * @name: 绘制点位总控制方法
 * @param {returnPointTypeDataTs} mapData 地图数据
 * @param {string} layer 图层名称
 * @param {string} popName 弹框名称
 * @param {boolean} idBase 是否使用基座
 * @return {*}
 */
export const drawCommonPoint = async (mapData: returnPointTypeDataTs, layer: string, popName?: mapPopName, idBase?: boolean) => {
    console.log(mapData[0].data.slice(0, 15), 'mapData')
    const currPointAllList: returnDataTs = []
    for (const pointList of mapData) {
        for (const item of pointList.data) {
            if (!idBase) item.isAnalysis = true // 设置当前为研判分析页面绘制点位
            const { type, level } = await getPointImg(item, pointList.code.toString())
            detailTypeCodeName(item, pointList.code.toString())
            if (!type) console.log('图片状态异常点位：', type, level, item)
            if (['E', 'B', '108', 'E,B', 'E,B,108', 'E,108'].includes(pointList.code.toString())) {
                const inHZ = MapUtil._booleanPointInPolygon([+item.longitude, +item.latitude])
                if (!inHZ) continue
            }
            currPointAllList.push(item)
            if (idBase) item.symbolImgName = `base${level || 0}-${type}`
            else item.symbolImgName = `${type}-${level || 0}`
        }
    }
    setMapPointDomToImage(currPointAllList, layer, popName)
}
/**
 * @name: 获取点位图层名称
 * @param {returnDataTs} item 点位数据
 * @param {string} currType 当前点位类型
 */
const detailTypeCodeName = async (item: returnDataTs[0], currType: string) => {
    switch (currType) {
    case '1': // 地表水
    case 'border': // 交接断面
        item.typeCode = '1'
        break
    case '1,40': // 藻类检测
        // item.typeCode = currType
        break
    case 'E': // 废水排口
    case 'B': // 入河排口
    case 'oceanOutlet': // 入海排口
    case 'E,B':
    case 'E,B,108':
    case 'E,108':
    case '108': // 禽类
        item.typeCode = '12'
        break
    case '3':
    case '5':
    case '10':
    case '54': // 泵站
    case '58': // 河长-监测点
    case '8': // 污水处理
    case '40': // 饮用水
        item.typeCode = currType
        break
    }
}
/**
 * @name: 获取点位图层名称
 * @param {returnDataTs} item 点位数据
 * @param {string} currType 当前点位类型
 */
const getPointImg = async (item: returnDataTs[0], currType: string) => {
    let type: strNum = ''; let level: strNum = ''; let currControlLevel = ''
    switch (currType) {
    case '1': // 地表水
        level = item.grade || item.level || 0
        currControlLevel = item.controlLevel || ''
        if (item.borderSituation && waterSufaceIsCheck.isCheckBorder && item.borderSituation !== '001') // borderSituation为001不是交接断面
            type = ['001', '002', '003'].includes(currControlLevel) ? currControlLevel : '008'
        else
            type = currControlLevel
        break
    case 'border': // 交接断面
        currControlLevel = item.controlLevel || ''
        level = item.grade || item.level || 0
        type = (waterSufaceIsCheck.controlLevelList.includes(currControlLevel) && ['001', '002', '003'].includes(currControlLevel)) ? currControlLevel : '008'
        break
    case '1,40': // 藻类特殊处理
        level = item.grade || item.level || 0
        type = currType
        break
    case '3': // 雨晴
        if (!item.online) level = 0
        else level = item.online || 1
        type = currType
        break
    case '5': // 水文
        level = 3
        type = currType
        break
    case '58': // 河长-监测点
        level = item.level || 0
        type = currType
        break
    case '2': // 气象
    case '40': // 饮用水
    case '50': // 入海溪闸
    case '59': // 山塘水库
    case 'lao': // 洪涝点位
        level = item.level || item.status || item.runState || 0
        type = currType
        break
    case '51': // 水闸
    case '52': // 水厂
    case '53': // 溢流口
    case '56': // 船闸
    case '57': // 港口码头
    case '54': // 泵站
        level = Number(item.runState || item.status || 0)
        if (!item.isMonitor) level = 'None'
        if (level) level = `Sewage${level}`
        type = currType
        break
    case '10': // 河长-公示牌
        level = 1
        type = currType
        break
    case '8': // 污水处理
        level = Number(item.runState || item.status || 0)
        if (!item.isMonitor) level = 'None'
        if (level) level = `Sewage${level}`
        type = currType
        break
    case 'E': // 单独点击 废水排口
    case 'B': // 单独点击 入河排口
    case '108': // 单独点击 禽类
        level = Number(item.runState || item.status || 0)
        if (!item.online) level = 'None'
        if (level) level = `Sewage${level}`
        type = currType
        break
    case 'oceanOutlet': // 入海排口
    case 'E,B':
        level = Number(item.runState || item.status || 0)
        if (!item.online) level = 'None'
        if (level) level = `Sewage${level}`
        if (item.dischargeDirection?.includes('B') && item.dischargeDirection?.length === 1)
            type = 'B'
        else
            type = 'E'
        break
    case 'E,108':
        level = Number(item.runState || item.status || 0)
        if (!item.online) level = 'None'
        if (level) level = `Sewage${level}`
        if (item.enterpriseType === '108')
            type = '108'
        else
            type = 'E'
        break
    case 'E,B,108':
        level = Number(item.runState || item.status || 0)
        if (!item.online) level = 'None' // 无排口则显示无状态
        if (level) level = `Sewage${level}`
        if (item.enterpriseType === '108')
            type = '108'
        else if (item.dischargeDirection?.includes('B') && item.dischargeDirection?.length === 1)
            type = 'B'
        else
            type = 'E'
        break
    }
    return { type, level }
}
/**
 * @name: 通过绘制dom节点转化成图片加载
 * @desc: 可以节省大量的图片
 * @param {Record} data 点位数据
 * @param {string} layerId 图层名称
 * @param {string} popName 弹框名称
 * @param {number} size 图标大小
 */
export const setMapPointDomToImage = async (data: pointDrawMainTs[], layerId: string, popName?: mapPopName, size?: number) => {
    // 构造GeoJson数据
    const dataJson = MapUtil._getCommonGeoJson()
    for (const point of data) {
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
        // 图标（symbol）资源加载
        point.symbolImgName && await MapUtil.handleDomConversionImage(point.symbolImgName)
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
                    'icon-size': size || 0.65,
                    'icon-ignore-placement': true, // 忽略碰撞检测
                },
            },
            ''
        )
        MapUtil._addHoverEventToLayer(layerId, 'name')
        registerMapboxClickEvent(layerId, popName || 'WaterCommonMainPop')
    }
}
/**
 * @name: 注册图层要素点击事件弹出地图弹窗
 * @param {string} layername 图层名称
 * @param {any} popName 弹框名称
 */
export const registerMapboxClickEvent = (layername: string, popName: mapPopName | Function) => {
    window.glMap.on('click', layername, (e: any) => {
        const coordinates = e.features[0].geometry.coordinates.slice() // 图片的经纬度
        console.log(layername, popName, 'dddddd')
        // 在点击处增加动态效果
        // MapUtil._addPointClickedMarker(e.features[0].properties.symbolImgName, coordinates, layerType)
        if (typeof popName === 'string')
            showMapPop(popName, e.features[0].properties, coordinates)
        else
            popName(e)
    })
}
/**
 * @name: 提前初始化图片资源 base基座
 */
export const preloadImage = () => {
    const allImageType = ['001', '002', '003', '004', '005', '006', '008', '009', '40']
    const allImageLevel = ['base0', 'base1', 'base2', 'base3', 'base4', 'base5']
    allImageType.forEach((type) => {
        allImageLevel.forEach((level) => {
            MapUtil.handleDomConversionImage(`${level}-${type}`)
        })
    })
}
/**
 * @name: 提前初始化图片资源 圆形
 */
export const preloadImageAnalysis = () => {
    const allImageType = ['001', '002', '003', '004', '005', '006', '008', '009', '40']
    const allImageLevel = ['0', '1', '2', '3', '4', '5']
    allImageType.forEach((type) => {
        allImageLevel.forEach((level) => {
            MapUtil.handleDomConversionImage(`${type}-${level}`)
        })
    })
}
