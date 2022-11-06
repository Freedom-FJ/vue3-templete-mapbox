/*
 * @Author: mjh
 * @Date: 2022-09-13 20:20:06
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-24 14:05:34
 * @Description:
 */
import { typeObj } from '@/service/baseServe'
import type { apiListTs } from '@/types/service'
const { string, number, object, array, any, boolean } = typeObj
const apiList: apiListTs = {
    // 基础区域和流域配置
    baseInformation: {
        path: '/config/server/basic-information-manager-server-app.json',
        server: 'configServer',
        params: {}
    },
    // 获取网格子树
    getGridTree: {
        path: '/api/v1.0/grid/queryGridAreaTree',
        server: 'wgmsBaseServer',
        params: {}
    },
    // 获取流域树
    getValleyTree: {
        path: '/api/v1.0/client/watershed/queryByCodes',
        server: 'wgmsBaseServer',
        params: {
            codes: string
        }
    },
    // 获取区域树
    getAreaTree: {
        path: '/api/v1.0/client/region/queryByCode',
        server: 'wgmsBaseServer',
        params: {
            code: string
        }
    },
    // 用户方案菜单配置
    getUserSystemScheme: {
        path: '/api/v1.0/config/menuConfig/user',
        server: 'wgmsBaseServer',
        params: {}
    },
    // 地表水断面水质等级
    listAll: {
        path: '/api/v1.0/water/qualityGrade/listAll',
        server: 'envStandardManagerServer',
    },
    // 地下水断面水质等级
    query: {
        path: '/api/v1.0/water/groundWaterQualityCategory/query',
        server: 'envStandardManagerServer',
    },
    // 海水水质等级
    seaWaterQualityCategory: {
        path: '/api/v1.0/water/seaWaterQualityCategory/query',
        server: 'envStandardManagerServer',
    },
    // 黑臭水体水质分级
    blackSmellyWaterGrade: {
        path: '/api/v1.0/water/blackSmellyWaterGrade/query',
        server: 'envStandardManagerServer',
    },
    // 获取行业类别树
    getIndustryCategory: {
        path: '/api/v1.0/industryCategory/tree',
        server: 'envStandardManagerServer',
    }

}
export default apiList

