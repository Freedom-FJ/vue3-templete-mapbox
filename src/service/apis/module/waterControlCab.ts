/*
 * @Author: Tian
 * @Date: 2022-05-06 13:37:55
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-10 20:09:07
 * @Description: 8
 */
import { typeObj } from '@/service/baseServe'
import type { apiListTs } from '@/types/service'
const { string, number, object, array, any, boolean, isString, isNumber, strNum } = typeObj
const apiList: apiListTs = {
    // 下级排名
    lowerLevel: {
        path: '/api/v1.0/ranking/lowerLevel',
        server: 'wgmsMonitorDataServer',
        method: 'get',
        params: {
            treeType: number,
            treeId: string,
            factor: string,
            factorFlag: boolean,
            beginTime: number,
            endTime: number,
            dataTimeType: number,
            queryTimeType: string,
            // waterType:
        },
    },
    // 获取水质整体达标率
    goalAttainment: {
        path: '/api/v1.0/waterQuality/goalAttainment',
        server: 'wgmsMonitorDataServer',
        method: 'get',
        params: {
            treeType: number,
            treeId: string,
            factorGroupId: string,
            beginTime: number,
            endTime: number,
            dataTimeType: number,
            queryTimeType: string,
            parentId: number
        },
    },
    // 获取水质控制级别达标率
    situation: {
        path: '/api/v1.0/waterQuality/situation',
        server: 'wgmsMonitorDataServer',
        method: 'get',
        params: {
            treeType: number,
            treeId: string,
            factorGroupId: string,
            beginTime: number,
            endTime: number,
            dataTimeType: number,
            queryTimeType: string,
            controlLevel: string,
            factorFlag: [undefined, boolean],
        },
    },
    // 预警处置统计
    countSiteTypeAndRate: {
        path: '/api/v1/alarm/statistics/countSiteTypeAndRate',
        server: 'bmpAlarmCenterServer',
        method: 'post',
        params: {
            startTime: number,
            endTime: number,
            envTypeCodeList: array,
            regionCode: isString,
            regionCodeList: array,
        },
    }

}
export default apiList
