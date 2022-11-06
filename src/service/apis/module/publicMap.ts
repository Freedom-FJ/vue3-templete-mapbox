/*
 * @Author: Tian
 * @Date: 2022-05-06 13:37:55
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-13 19:46:11
 * @Description: 8
 */
import { typeObj } from '@/service/baseServe'
import type { apiListTs } from '@/types/service'
const { string, number, object, array, any, boolean, strNum, isString, isNumber } = typeObj
const apiList: apiListTs = {
    // 测试请求
    getJsonTest: {
        path: 'https://gis-dev.fpi-inc.site/interpolation-file-server/api/v1/sys/download/interpolation/118/mlhy/2022/02/12/aqi_2022021210.png'
    },
    // 水系主网格数据
    getYhRiverGridMain: {
        path: 'https://gis-dev.oss-cn-hangzhou.aliyuncs.com/project/yhhang/yhRiverGridMain.json'
    },
    // 水系乡镇级网格数据
    getYhRiverGridTown: {
        path: 'https://gis-dev.oss-cn-hangzhou.aliyuncs.com/project/yhhang/yhRiverGridTown.json'
    },
    // 水系线数据
    getYhWaterLine: {
        path: 'https://gis-dev.oss-cn-hangzhou.aliyuncs.com/project/yhhang/yhWaterLine.json'
    },
    // 水系面数据
    getYhWaterPolygon: {
        path: 'https://gis-dev.oss-cn-hangzhou.aliyuncs.com/project/yhhang/yhWaterPolygon.json'
    },
    // 菜单接口
    getSystemMenus: {
        path: '/api/v1.0/permissions/systemMenus',
        server: 'wgmsBspService',
        method: 'post',
        params: {
            systemCode: string
        }
    },
    // 左侧树结构接口
    getTreeData: {
        path: '/api/v2.0/client/region/queryByCode',
        server: 'wgmsBasicInfoServer',
        params: {
            code: [null, undefined, string]
        }
    },
    // 级联选择器树形接口
    getCascaderareaData: {
        path: '/api/v1.0/client/region/queryByCode',
        server: 'wgmsBaseServer',
        params: {
            code: string
        }
    },
    getCascadervalleyData: {
        path: '/api/v1.0/client/watershed/queryByCodes',
        server: 'wgmsBaseServer',
        params: {
            codes: string
        }
    },
    // table测试接口
    realTimeViewLoad: {
        path: '/api/v1/real-time-view/load',
        server: 'wgmsAllWaterMonitorServer',
        method: 'get',
        params: {
            stationCodes: number,
            regionCodes: string,
            watershedCodes: string,
            factorGroupCode: string,
            online: number,
            runState: number,
            controlLevel: string,
            limit: number,
            offset: number
        }
    },
    // 动态列表请求damo
    singleStation: {
        path: '/api/v1.0/report/singleStation',
        server: 'wgmsMonitorDataServer',
        method: 'get',
        params: {
            beginTime: number,
            endTime: number,
            siteId: number,
            queryTimeType: string,
            factorGroupId: number
        }
    },
    // 获取全部因子组接口
    queryFactorGroupByCode: {
        path: '/api/v1.0/factor/functionPoint/queryFactorGroupByCode',
        server: 'wgmsBaseServer',
        method: 'get',
        params: {
            code: string
        }
    },
    // post 数组型请求
    jointListList: {
        method: 'post',
        path: '/solid-waste/joint-list',
        server: 'wgmsService',
        params: [number, string]
    },
    // 站点排名列表
    getSiteRanking: {
        method: 'get',
        path: '/api/v1.0/ranking/site',
        server: 'wgmsMonitorDataServer',
        params: {
            treeType: number,
            treeId: string,
            factorFlag: boolean,
            factor: strNum,
            beginTime: number,
            endTime: number,
            queryTimeType: string,
            controlLevel: isString,
            dataTimeType: number
        }
    },
    // 溯源点位
    getRecordList: {
        path: '/api/v1.0/factor/factorGroup/query',
        server: 'wgmsBaseServer',
        params: {
            offset: number,
            limit: number,
            queryStr: string
        }
    },
    // 地表水地图点位通用接口
    queryStationList: {
        path: '/api/v1.0/oneMap/queryStationList',
        server: 'wgmsMonitorDataServer',
        params: {
            treeType: number,
            treeId: string,
            stationCodes: string,
            factorFlag: boolean,
            exceptionFlag: boolean,
            factorGroupId: isString,
            monitoringMethods: isString,
            borderSituation: isString,
            controlLevel: isString,
            stationType: isString
        }
    },
    // 污染源地图点位通用接口
    queryMapList: {
        path: '/api/v3.0/poms/app/queryMapList',
        server: 'wgmsSewageDataServer',
        params: {
            treeType: number,
            treeId: string,
            stationCodes: string, // -1 :全部污染源  6：排水口  8:污水处理厂
            isIps: [string, number, undefined], // 是否污染源，默认填1（仅查污染源）
            isKey: [string, number, undefined], // 是否重点源，两者都有时，可不填
            enterpriseType: isString, // 08 企业类型编码，查污水处理厂和畜牧养殖时需要
            equipmentType: isString, // claxx01 污水设施类型，查污水处理厂时需要
            dischargeDirection: isString, // A,B,E 按排水口查时需要
            factorGroupId: isString
        }
    },
    // 污染源点位详情接口
    queryStationRealData2: {
        path: '/api/v1.0/oneMap/queryStationRealData2',
        server: 'wgmsSewageDataServer',
        params: {
            factorGroupId: strNum,
            stationId: string,
            stationCode: string,
        }
    },
    // 污染源弹框排口查询趋势图
    outletPollutant: {
        path: '/api/v1.0/analysis/poms/outletPollutant',
        server: 'wgmsSewageDataServer',
        params: {
            timeUnit: string,
            regionId: string,
            accessCodes: string,
            endTime: number,
            beginTime: number,
            factorIndex: string,
            dataType: number // 通过dataType---1  后台累加计算
        }
    },
    // 污染源弹框排口查询因子限值
    pomsAlarmLimit: {
        path: '/water/wgms/poms-alarm-limit',
        server: 'prjHangzhouWgmsScreenServer',
        params: {
            siteCode: string, // 排口id
        }
    },
    // 污染源点位查询非实时数据
    concentration2: {
        path: '/api/v1.0/survey/pollutant/concentration2',
        server: 'wgmsSewageDataServer',
        params: {
            factorGroupId: string,
            stationCode: string,
            backtracking: boolean,
            id: string,
            queryTimeType: string,
            beginTime: number,
            endTime: number,
            dataTimeType: number
        }
    }
}
export default apiList
