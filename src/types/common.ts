/*
 * @Author: mjh
 * @Date: 2022-08-29 09:17:57
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-20 22:53:15
 * @Description:
 */
import type { stationCodeToTypeList } from '@/utils/commonMethods/factor'
export interface globalTs {
    dayjs: any
    echarts: any
    emitter: any
}

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
