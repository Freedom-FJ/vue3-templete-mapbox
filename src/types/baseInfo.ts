/*
 * @Author: mjh
 * @Date: 2022-09-19 17:00:26
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-24 14:14:05
 * @Description:
 */
import type { dictionariesWaterQualityToName } from '@/utils/waterUtils'
// 权限配置
export interface globalConfigTs {
    '008': Record<string, number>
    '010': Record<string, number>
    functionMenuConfig: Record<string, number>
}
// 区域树类型
export interface areaTree {
    children: Array<areaTree>
    code: string
    id: number
    label: string
    parentId: number
}
export interface baseInfoTs {
    'city': string
    'city_code': string
    'region': string
    'watershed': string
}
// 流域树类型
export interface valleyTree {
    children: Array<valleyTree>
    code: string
    id: number
    label: string
    parentId: number
    waterType?: string
}
// 系统菜单类型
export interface systemMenusTs {
    childType: null
    childTypeCode: null
    childTypeName: null
    code: string
    hidden: false
    id: string
    key: string
    label: string
    leaf: null
    lvl: null
    name: null
    operableSign: number
    operableTypes: []
    parentId: string
    pos: number
    positionCode: string
    readableSign: number
    selectedPictureId: string
    subs: []
    type: number
    typeName: string
    unselectedPictureId: string
    url: string
}
// 区域 流域树名称标识
export type nameType = 'area' | 'valley'
// 当前选中的树类型
export interface currTreeNodeTs {
    id: number
    label: string
    parentId: number
    code: string
    type: nameType
    typeNum: 0 | 1
}
export interface dictionariesToNameTs {
    'allowDelete': number
    'code': string
    'name': string
    'comment': string
    'id': string
    'categoryName': string
}
export interface WaterQualityDictionariesTs {
    'bmpId': null
    'id': string
    'createTimestamp': string
    'lastChangeTimestamp': string
    'name': string
    'code': string
    'level': number
    'qualityState': string
    'color': string
    'description': string
    value?: number
}

export type WaterQualityDictionariesKeyTs = keyof typeof dictionariesWaterQualityToName

export interface industryCategoryTreeTs {
    code: string
    id: string
    label: string
    parentId: string
    posCode: string
    children?: industryCategoryTreeTs[]
}
