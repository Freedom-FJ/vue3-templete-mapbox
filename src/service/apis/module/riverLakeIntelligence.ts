/*
 * @Author: Tian
 * @Date: 2022-05-06 13:37:55
 * @LastEditors: Tian
 * @LastEditTime: 2022-10-11 20:26:18
 * @Description: 8
 */
import { typeObj } from '@/service/baseServe'
import type { apiListTs } from '@/types/service'
const { string, number, object, array, any, boolean, strNum, isString, isNumber } = typeObj
const apiList: apiListTs = {
    // 河道水质排名-按水质点位超标次数
    configs: {
        path: '/configs?dataId=app&group=yuhang-screen-web',
        server: 'nav',
        method: 'get',
    },
    // 河道水质排名-年度I～III类比例
    mainArea: {
        path: '/api/v3.0/surfaceWater/app/main/area',
        server: 'wgmsMonitorDataServer',
        method: 'get',
        params: {
            treeType: number,
            treeId: string,
            queryTimeType: string,
            beginTime: number,
            endTime: number,
            factorFlag: boolean,
            factor: strNum,
            controlLevel: isString,
        }
    },
    siteCount: {
        path: '/api/v1/navigation/load',
        server: 'wgmsAllWaterMonitorServer'
    }
}
export default apiList
