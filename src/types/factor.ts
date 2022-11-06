/*
 * @Author: mjh
 * @Date: 2022-09-27 20:18:12
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-09 15:10:16
 * @Description:
 */
export interface allSurfaceWaterStandardListTs {
    'pollutantCode': string
    'pollutantName': string
    'limitType': number
    'gradeLevel': number
    'value': number
    'upValue': null
    'downValue': null
    'riverOrLake': number
}

export interface surfaceWaterStandardApiTs {
    [key: string]: null | surfaceWaterStandardValueTs
}

export interface surfaceWaterStandardValueTs {
    'pollutantCode': string
    'pollutantName': string
    'limitType': number
    'gradeLevel': number
    'value': number
    'upValue': number | null
    'downValue': number | null
    'riverOrLake': 0 | 1
    standardValue?: number
}
