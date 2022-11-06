/*
 * @Author: mjh
 * @Date: 2022-09-30 15:55:23
 * @LastEditors: Tian
 * @LastEditTime: 2022-10-11 15:55:02
 * @Description:
 */

export interface goalAttainmentApiTs {
    '001': {
        'target': number
        'measure': number
        'value': null
    }
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

export interface countSiteTypeAndRateApiTs {
    'inDisposeCount': 2
    'notDisposedCount': 3
    'disposedCount': 1484
    'totalCount': 1489
    'disposalRate': '0.9966'
    'siteTypeCode': '001'
    'siteTypeName': '国控'
}

export interface WarningListApiTs {
    data: WarningListItem[]
}
export interface WarningListItem {
    disposalRate: string
    disposedCount: number
    inDisposeCount: number
    notDisposedCount: number
    siteTypeCode: string
    siteTypeName: string
    totalCount: number
}

