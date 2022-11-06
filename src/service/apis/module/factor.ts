/*
 * @Author: Tian
 * @Date: 2022-05-06 13:37:55
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-28 15:43:57
 * @Description: 8
 */
import { typeObj } from '@/service/baseServe'
import type { apiListTs } from '@/types/service'
const { string, number, object, array, any, boolean, strNum, isString, isNumber } = typeObj
const apiList: apiListTs = {
    // 地表水因子标准接口
    allSurfaceWaterStandardList: {
        path: '/api/v1.0/water/allSurfaceWaterStandardList',
        server: 'envStandardManagerServer',
        method: 'get',
    },
    // 获取对应因子限值
    surfaceWaterStandard: {
        path: '/api/v1.0/factor/surfaceWaterStandard',
        server: 'wgmsMonitorDataServer',
        method: 'get',
        params: {
            baseLevel: strNum,
            factorGroup: strNum,
            sectionType: string
        }
    }
}
export default apiList
