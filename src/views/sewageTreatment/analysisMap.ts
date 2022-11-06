import { getFactorGroupList, getFactorListByStationCode } from '@/utils/commonMethods/factor'
import { detailPointReturnPromise } from '@/utils/map/mapPoint'
import type { StationCode, returnPointTypeDataTs, sewageReturnPointTypeDataTs } from '@/utils/map/mapPoint'
import { getSetTreeCode } from '@/utils/treeDataUtils'
import type { mapPointNewLayerPartChildTs, mapPointNewLayerTs } from '@/types/common'
import type { stationCodeToTypeListTs } from '@/utils/commonMethods/factor'
import service from '@/service/api'
export type QueryTimeTypeEnum = 'hour' | 'day' | 'week' | 'month' | 'year'
export type DataTimeTypeEnum = 60 | 1440
export type TreeTypeEnum = 0 | 1

let pointTypeList: string[] = [] // 临时记录当前请求点位对于的类型

export const staticMapLayer = {
    env: ['001', '002', '003', '004', '005', '008'],
    drink: ['012', '013'],
    ground: [],
    riverHead: [],
    deal: [],
    keySources: ['keySources-E', 'keySources-B', '108'],
    noKeySources: ['keySources-E', 'keySources-B', '108'],
    ocean: [],
    waterRain: [],
    drinkSource: [],
    facility: [],
    controlUnit: [],
    rmxFord: [],
    pool: [],
    waterWork: [],
    waterDiversion: [],
    outlet: []
}

// 用于处理地表水 图标叠加显示问题
let waterSufaceIsCheck: {
    controlLevelList: string[]
    isCheckBorder: boolean
} = {
    controlLevelList: [],
    isCheckBorder: false
}

/**
 * 入口参数，历史数据、周边查询参数合并传入
 */
interface MainParams {
    longitude: number
    latitude: number
    alarmTime: number
    queryTimeType: string // hour
    distance: number // 10
    treeType: number // 1
    treeId: string
}

interface pointParams {
    borderSituation?: string
    controlLevel?: string
    factor: string
    stationCodes: string
    factorFlag?: boolean
    stationType?: string
    // 污染源相关
    exceptionFlag?: boolean
    isKey?: string
    isIps?: string
    enterpriseType?: string
    equipmentType?: string
    dischargeDirection?: string
}
interface sendParams extends pointParams, MainParams {}
/**
 * 报警周边点位查询接口
 * @param mainParams 重要请求传参
 * @param layerPoint 图层选择情况
 */
export async function getAllWarningPoint(layerPoint: mapPointNewLayerTs, mainParams: Omit<MainParams, 'treeType' | 'treeId'>): Promise<returnPointTypeDataTs> {
    pointTypeList = []
    console.log(layerPoint, 'layerPoint')
    const treeData = await getSetTreeCode()
    const { longitude, latitude, distance, queryTimeType, alarmTime } = mainParams
    const limtParams = {
        longitude,
        latitude,
        alarmTime,
        queryTimeType,
        distance,
        treeType: 1,
        factorFlag: true,
        treeId: treeData.slice(0, 6)
    }
    let promiseList: Promise<any>[] = []
    let currPromiseList: Promise<any>[] = []
    const sourceList: { code: mapPointNewLayerPartChildTs[]; isKey: 0 | 1 }[] = []
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
 * 地表水预警请求处理
 * @param currCodes 当前地表水选择的类型
 * @param limtParams 基础传参
 */
async function waterSurfaceLayer(currCodes: mapPointNewLayerPartChildTs[], limtParams: MainParams) {
    const returnPromise: Promise<any>[] = []
    const stationCodes = currCodes[0].stationCodes
    const sendObj = {} as Record<keyof pointParams, any>
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
    sendObj.factor = factorGroupId
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
    const sendObj = {} as Record<keyof pointParams, any>
    currCodes.forEach((item) => {
        item.attributes.forEach((item) => {
            if (sendObj[item.code as keyof pointParams]) (sendObj[item.code as keyof pointParams] as string[]).push(item.value)
            else sendObj[item.code as keyof pointParams] = [item.value]
        })
    })
    for (const key in sendObj)
        sendObj[key as keyof pointParams] = (sendObj[key as keyof pointParams] as string[]).join(',')
    const factorObj = await getFactorListByStationCode(stationCodes as stationCodeToTypeListTs)
    const factor = factorObj?.id ?? ''
    sendObj.factor = factor
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
        const factor = factorObj?.id ?? ''
        const stationCodes = item.stationCodes
        pointTypeList.push(stationCodes)
        returnPromise.push(getQuerySurrounding({
            ...{
                stationCodes,
                factor
            },
            ...limtParams
        }))
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
    const factor = factorObj?.id ?? ''
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
                isIps: '1', // 是否污染源，默认填1（仅查污染源）
                isKey: isEkey.join(','), // 是否重点源，两者都有时，可不填
                factor,
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
            factor,
            ...limtParams
        }, true))
    }
    // 禽类
    if (Object.keys(Params108).length) {
        pointTypeList.push('108')
        returnPromise.push(getQuerySurrounding({
            ...Params108 as Record<attrCode, string>,
            isKey: (Params108.isKey as string[]).join(','),
            factor,
            ...limtParams
        }, true))
    }
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
        const factor = factorObj?.id ?? ''
        const stationCodes = item.stationCodes
        if (stationCodes === '-1') { // 入海排污
            pointTypeList.push('oceanOutlet')
            const sendObj = {} as Record<keyof pointParams, any>
            item.attributes.forEach((item) => {
                sendObj[item.code as keyof pointParams] = item.value
            })
            returnPromise.push(getQuerySurrounding({
                ...sendObj,
                stationCodes,
                factor,
                ...limtParams
            }, true))
        }
        else { // 入海溪闸
            pointTypeList.push(stationCodes)
            returnPromise.push(getQuerySurrounding({
                ...{
                    stationCodes,
                    factor
                },
                ...limtParams
            }))
        }
    }))

    return returnPromise
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
    })
    if (!stationCodeList.length) return
    pointTypeList.push('sheshi')
    return getQuerySurrounding({
        stationCodes: stationCodeList.join(','),
        factor: '',
        ...limtParams
    })
}
/**
 * 查询周边设施
 * @param querySurroundingParams
 */
async function getQuerySurrounding(querySurroundingParams: sendParams, isSwage?: boolean) {
    try {
        const url = isSwage ? 'analysis/queryHistoryData2' : 'analysis/queryHistoryData'
        querySurroundingParams.distance = querySurroundingParams.distance / 1000
        const res: any = await service(url, querySurroundingParams, undefined, 'intercept')
        return res
    }
    catch (e) {
        console.error(e)
        return null
    }
}
