/*
 * @Author: mjh
 * @Date: 2022-09-20 10:14:10
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-27 20:16:11
 * @Description:
 */
export interface chartDataTs {
    times?: string[]
    time?: string[]
    dates?: {
        level: null | number
        value?: null | number
    }[]
}

export interface chartSwageDataTs {
    times?: string[]
    data?: (null | {
        value: number | null
        overProof?: boolean | null
    })[]
}
export interface sewageDetailApiReturnTs {
    'companyId': 'POMS1176'
    'companyName': '杭州余杭城西净水有限公司良渚污水处理厂'
    'regionId': '330110'
    regionText?: string
    'watershedId': '60601'
    'industryCategory': '8d0ea5eed4fa46ca9b3e254bb7774ab8'
    industryCategoryStr?: string
    'linkman': null
    'telephone': 'UORZtmAE5hg6p7U'
    'equipmentType': null
    'equipmentTypeId': null
    'outlets': outletTs[]
    'address': '杭州市余杭区良渚镇良渚村1组'
    'organizationCode': 'POMS1176'
    'longitude': '120.057608'
    'latitude': '30.378888'
    'mainPollutantsStr': '总氮（以N计）,氨氮(NH3-N),总磷(以 P 计）'
    'status': 1
    'datas': outletDataTs[]
}
export interface outletTs {
    'accessCode': 'POMS33330110000111'
    'id': 'POMS33330110000111'
    'portName': '标排口'
}

export interface outletDataTs {
    'mn': 'POMS33330110000111'
    'time': '2022-09-24 12:00:00'
    'factors': {
        'code': 'w01018_Cou'
        'value': 40.42
        'overProof': false
        'standard': null | {
            'pollutantLimit': '5'
            'pollutantCode': 'w21003'
            'portId': 'POMS33330110000111'
            'accessCode': 'POMS33330110000111'
        }
    }[]
    'status': 1
    'mainPollutants': []
}
export interface factorItemTs {
    decimalPlace: number
    factorIndex: string
    factorIndexCode: string
    factorIndexName: string
    id: string
    label: string
    value: string
    unit: string
    unitCode: string
    unitName: string
    downValue?: null | number
    standardValue?: null | number
    upValue?: null | number
}
export interface factorInfoTs {
    name: string
    unit: string
    code?: string
    isGroup: boolean
    downValue?: null | number
    upValue?: null | number
    standardValue?: null | number
}

export interface pomsAlarmLimitApiTs {
    'portId': string
    'accessCode': string
    'code': string
    'name': string
    'pollutantLimit': number
}
