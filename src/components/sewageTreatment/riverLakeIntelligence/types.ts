/*
 * @Author: mjh
 * @Date: 2022-09-29 19:49:08
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-11 14:30:51
 * @Description:
 */
export interface videoChildItem {
    label: string
    url?: string
    deviceId?: string
}

export interface videoMidItem extends videoChildItem {
    children: videoChildItem
}
export interface videoItemTs {
    label: string
    showChild: boolean
    children: {
        label: string
        showChild: boolean
        children: videoChildItem[]
    } []
}

export interface configsApiTs {
    area_over_stat: {
        name: string
        over: number
    }[]
}

export interface year1To3ApiTs {
        'id': 659195
        'name': '中泰街道'
        'code': null
        'centerPosition': null
        'total': 11
        'validNum': 11
        'reachNum': 11
        'levelMap': {}
        'rate': 100
        'rank': '1'
}
