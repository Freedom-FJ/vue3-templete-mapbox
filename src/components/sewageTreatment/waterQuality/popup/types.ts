/*
 * @Author: mjh
 * @Date: 2022-09-23 10:52:04
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-23 11:04:57
 * @Description:
 */
export interface warningApiTs {
    'longitude': string
    'latitude': string
    'siteCode': string
    'siteName': string
    'totalNum': number
    'detailMap': Partial<Record<EventTypeTs, {
        'eventLevelCode': string
        'eventLevelName': string
        'currentTotalNum': number
        'currentUndoneNum': number
        'currentDoingNum': number
        'currentDoneNum': number
    } >>
}
export interface warningApiTsBody {
    code: string
    count: number
    data: warningApiTs[] | null
    message: string
    success: boolean
    totalCount: number
}
export type EventTypeTs = '绿色事件' | '黄色事件' | '橙色事件' | '红色事件'

export interface warningDataTs extends warningApiTs {
    red: strNum
    green: strNum
    orange: strNum
    yellow: strNum
}
