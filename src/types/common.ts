/*
 * @Author: mjh
 * @Date: 2022-08-29 09:17:57
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-04 15:32:49
 * @Description:
 */
import type { stationCodeToTypeList } from '@/utils/commonMethods/factor'
export interface globalTs {
    dayjs: any
    echarts: any
    emitter: any
}

export interface HangZhouUserInfoTs {
    token: string
    authorization: string
}

export type changeHangZhouUserInfoTs = (val: { token: string; authorization: string }) => void

export type serviceTs = (
    url: string,
    params?: Record<string, any>,
    header?: Record<string, any>,
    type?: string
) => any
export interface tableColumnTs {
    prop: string
    label?: string
    width?: string
    isSlot?: boolean
    column?: Array<{
        prop: string
        label?: string
        width?: string
        isSlot?: boolean
        column?: Array<{
            prop: string
            label?: string
            width?: string
            isSlot?: boolean
        }>
    }>
}

export interface popTableOptionAllTs {
    label: string
    key: string
    flex: number
    type: 'tool' | 'select'
    list: selectPanelTs[]
    defaultSelect: number
    click: (item: record, optionItem: popTableOptionAllTs) => any
    headerStyle: record
    rowStyle: record
    toolList: { label: string; click: (item: record, itemOption: Partial<popTableOptionAllTs>) => any }[]
    render: (val: record, optionItem: Partial<popTableOptionTs>) => string | number
    renderStyle: (val: record, item: Partial<popTableOptionTs>) => record
}
export type popTableOptionTs = Partial<popTableOptionAllTs>
export interface selectPanelTs {
    value: string | number | boolean
    label: string
    selectLabel?: string
}

export interface queryAlarmTs {
    code: string
    name: string
}

export interface disposalTs {
        disposalStatusCode: number
        disposalStatusName: string
        disposalStatusColor: string
}

export interface factorGroupTs {
    'id': string
    'name': string
    'code': string
    'factors': {
        'id': string
        'factorIndex': string
        'unit': string
        'factorIndexName': string
        'factorIndexCode': string
        'unitName': string
        'unitCode': string
        'decimalPlace': number

    }[]
    'factorIndexs': null
}

export interface analysisDataTs {
    alarmTypeName: string
    alarmTypeCode: string
    dataTimeStr: string // 报警时间中文
    dataTime: number // 报警时间
    siteName: string
    siteCode: string
    factorName: string
    factorUnit: string
    factorCode: string
    factorValue: string
    latitude: string
    longitude: string
    timeType: string
    alarmTimeValue: string
    waterQuality: string
    sectionType: string
    pointData: string
    overflowPortNum: number
    accessCodeList: string
    time: strNum
    siteId: string
    isHandle: boolean
    analysisType: 1 // 分析溯源标识
    // 详情数据
    address: string
    alarmTimeStr: string
    detailList: any[]
    alarmLevelColor: string
    alarmLevelName: string
    id: strNum
    envTypeCode: string
}
export type pointLayerNmaeTs =
    'controlUnit'
    | 'deal'
    | 'drink'
    | 'drinkSource'
    | 'env'
    | 'facility'
    | 'keySources'
    | 'licence'
    | 'noKeySources'
    | 'ocean'
    | 'pool'
    | 'riverHead'
    | 'rmxFord'
    | 'waterDiversion'
    | 'waterRain'
    | 'waterWork'

export interface pointLayerDetail {
    'parentCode': null
    'code': string
    'name': string
    'count': number
    'url': string
}

export type mapPoinReturnTs = Record<pointLayerNmaeTs, pointLayerDetail[] >
export type mapPointInitTs = Record<pointLayerNmaeTs, string[]>
export interface mapPointNewLayerPartChildTs {
    attributes: {
        code: string
        value: string
    }[]
    checkAble: boolean
    checked: boolean
    iconName: string
    name: string
    selected: boolean
    stationCodes: string

}
export type mapPointNewLayerTs = mapPointNewLayerPartTs[]
export interface mapPointNewLayerPartTs {
    children?: mapPointNewLayerPartChildTs[]
    name: string
    stationCodes?: string
    value: string[]
}
export interface JSONDataTs {
    'type': string
    'name'?: string
    'crs'?: { 'type': string; 'properties': { 'name': string } }
    'features': {
        'type': string
        'properties'?: record
        'geometry': {
            'type': string
            'coordinates': number[] | number[][]
        }
    }[]
}

export type stationCodeToTypeListTs = keyof typeof stationCodeToTypeList

export interface UserInfoTs {
    'phone': null
    'name': '系统管理员'
    'userUuid': '2c938c123cf618a9013cf618b16a0007'
    'imei': ''
    'telephone': ''
    'idcardNo': ''
    'userName': 'root'
    'userId': '1040067191967318016'
    'email': ''
    'token': '55411bf6e13c4c4cafb4676b9a6461a4'
}
