/*
 * @Author: mjh
 * @Date: 2022-09-13 20:20:06
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-27 19:52:16
 * @Description:
 */
import { typeObj } from '@/service/baseServe'
import type { apiListTs } from '@/types/service'
const { string, number, object, array, any, boolean, isString, isNumber, strNum } = typeObj
const apiList: apiListTs = {
    // 获取研判分析地表水点位接口
    queryHistoryData: {
        path: '/api/v3.0/oneMap/queryHistoryData',
        server: 'wgmsMonitorDataServer',
        params: {
            longitude: number,
            latitude: number,
            alarmTime: number,
            queryTimeType: string, // hour
            distance: number, // 米
            treeType: number,
            treeId: string,
            borderSituation: isString,
            controlLevel: isString,
            factor: string,
            stationCodes: string,
            factorFlag: boolean,
            stationType: isString
        }
    },
    // 获取研判分析污染源点位接口
    queryHistoryData2: {
        path: '/api/v3.0/oneMap/queryHistoryData2',
        server: 'wgmsSewageDataServer',
        params: {
            treeType: number,
            treeId: string,
            exceptionFlag: [boolean, undefined],
            stationCodes: string,
            longitude: number,
            latitude: number,
            distance: number, // km
            queryTimeType: string, // hour
            alarmTime: number,
            isKey: isString,
            isIps: isString,
            enterpriseType: isString,
            equipmentType: isString,
            dischargeDirection: isString
        }
    },

}
export default apiList

