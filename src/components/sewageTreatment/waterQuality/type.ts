/*
 * @Author: mjh
 * @Date: 2022-09-23 17:53:32
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-11 19:28:22
 * @Description:
 */
export interface distributionStatusApiTs {
        'name': string
        'count': number
}
export interface situationApiTs {
    reachStandard: number
    total: number
    validSiteNum: number
    levelNumMap: {
        1: number
        2: number
        3: number
        4: number
        5: number
        6: number
    }
}

export interface mainMonthApiTs {
    'id': null
    'name': '8月'
    'code': '8'
    'centerPosition': null
    'total': 0
    'validNum': 1
    'reachNum': 0
    'rate': 0
    'rank': '9'
}

export interface countSiteTypeAndRateApiTs {
    'inDisposeCount': 2
    'notDisposedCount': 3
    'disposedCount': 1484
    'totalCount': 1489
    'disposalRate': '0.9966'
    'siteTypeCode': '001'
    'siteTypeName': '国控'
}
