/*
 * @Author: mjh
 * @Date: 2022-09-13 10:39:27
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-08 14:29:49
 * @Description:
 */
export interface waterQualityPointTs {
    'longitude': strNum
    'latitude': strNum
    'eventIdList': string
    'notDisposedCount': number
    'inDisposalCount': number
    'disposalCount': number
    'totalCount': number
    'siteCode': string
    'siteName': string
    'siteTypeCode': string
    'siteTypeName': string
    'eventSourceCode': string
    'eventSourceName': string
    symbolImgName?: string
    disposeType?: number
    borderSituation?: string
    name: string
}

export interface wgmsQueryAroundTs {
    'code': string
    'latitudeY': string
    'latitude': string
    'watershedId': number
    'calculateFlag': number
    'regionId': number
    'borderSituation': string
    'phone': string
    'controlLevel': string
    'monitoringMethods': number
    'contact': string
    'accessCode': string
    'name': string
    'longitudeX': string
    'waterQuality': string
    'id': number
    'sectionType': string
    'longitude': string
    'base': number
}

export interface lowerLevelApiTs {
    mainPollutants: null
    name: string
    overProofSectionNum: number
    parentId: number
    reachSectionNum: number
    total: number
    validSiteNum: number
    centerPosition: string
    compositeIndex: number
    goodSectionNum: number
    goodPercent?: number | null
    grade: number
    id: number
}
