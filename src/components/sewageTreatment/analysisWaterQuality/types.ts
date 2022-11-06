/*
 * @Author: mjh
 * @Date: 2022-09-14 16:03:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-12 11:09:50
 * @Description:
 */
export interface QualityRainfallWaterTs {
    'time': string
    'factorValue': string
    'hydrology': string
    'rain': string
    'quality': null | string
}

export interface kLineApiTs {
        'time': string
        'value': string
        'quality': number
        'maxValue': strNum
        'minValue': strNum
        'firstValue': strNum
        'lastValue': strNum
}

export interface correlationTs {
    'value': string
    'siteName': string
    'coefficient': null
    'alarmNum': string
    'rank': number
    'quality': null
    'coefficientDoubleValue': number
    'coefficientPre': string
}

export interface analysisResultTs {
    'rainResult': number
    'rainCode': string
    'hydrologyCode': string
    'keyPollutionNum': number
    'factoryNum': number
    'companyNum': number
    'breedNum': number
    'overFlowNum': number
    'totalDisposalNum': number
    'unDisposalNum': number
    'alarmNum': number
    'isRainOver': number
    'alarmResultDetail': string
    'rainResultDetail': string
    'pomsResultDetail': string
    'eventResultDetail': string
    'totalResult': string
}

export interface countEventStatusByTimePointTs {
    'totalCount': number
    'notDisposedCount': number
    'inDisposalCount': number
    'disposedCount': number
}

export interface pomsAlarmStatTs {
    'id': 'POMS254'
    'companyName': '杭州中天科技股份有限公司'
    'enterpriseType': '01'
    'siteName': '杭州中天科技股份有限公司'
    'corr': null
    'adjacent': ''
    'alarmNum': '5'
    'distance': '4841'
    'rank': 1
    'coefficientDoubleValue': 0
    'adjacentDoubleValue': 0
    'adjacentPre': ''
    'coefficientPre': ''
}

export interface UnShipStaticTs {
    dates: { value?: number; level: number }[]
    times: string[]
}

export interface overFlowOutletTs {
    data: {
        name: string
        jiancezhi: string
        intDistance: string
    }[]
    total: number
}

export interface queryEventDataByTimePointTs {
    'eventName': string
    'eventLevelCode': string
    'eventLevelName': string
    'startTime': number
    'startTimeStr': string
    'description': string
    'prevDisposalStatusCode': number
    disposalStatusName: string
    'prevDisposalStatusName': string
    'currentDisposalStatusCode': null
    'currentDisposalStatusName': string
    'missionId': number
    'eventId': number
    'alarmId': number
    'distance': number
}

export interface allQueryEventDataByTimePointTs {
    'requestId': null
    'success': true
    'code': 'success'
    'message': 'successful.'
    'data': queryEventDataByTimePointTs[]
    'count': 10
    'totalCount': 308
}

export interface pomsAlarmTs {
    'value': string
    'siteName': string
    'coefficient': null
    'alarmNum': strNum
    'rank': number
    'quality': null
    'coefficientDoubleValue': number
    'coefficientPre': string
}

export interface pomsAnalysisTs {
    companyName: string
    rank: string
    adjacentPre: string
}
