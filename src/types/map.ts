/*
 * @Author: mjh
 * @Date: 2022-09-27 13:44:10
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-20 23:11:01
 * @Description:
 */
import type { popList } from '@/utils/map/mapInit'
export type mapPopName = keyof typeof popList

export interface LayerStaticDataTs {
    name: string
    checkAble: boolean
    stationCodes: string
    children: LayerStaticDataChildTs[]
}
export interface LayerStaticDataChildTs {
    name: string
    code: string
    checkAble: boolean
    stationCodes: string
}

export type LayerSelectDataTs = Record<LayerCodeTs, LayerSelectItemTs>

export interface LayerSelectItemTs extends LayerStaticDataTs {
    checkAble: boolean
    isCheckAll: boolean
    checkedList: string[]
    isShowChild: boolean
    indeterminate: boolean
    children: LayerSelectDataChildTs[]
}
export interface LayerSelectDataChildTs {
    name: string
    code: string
    checkAble: boolean
    stationCodes: string
}

export type LayerCodeTs = '1' | '38' | '40'

export type PointTs = Partial<{
    code: string
    address: string
    stationType: string
    latitude: string
    watershedId: string
    regionId: string
    borderSituation: string
    controlLevel: string
    monitoringMethods: number
    accessCode: string
    name: string
    waterQuality: string
    id: string
    sectionType: string
    longitude: string
    runState: number
    time: string
    level: number
    typeCode: string
    symbolImgName: string
}>
