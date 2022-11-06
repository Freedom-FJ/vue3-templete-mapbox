/*
 * @Author: Tian
 * @Date: 2022-05-06 13:37:55
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-08 15:29:46
 * @Description: 8
 */
import { typeObj } from '@/service/baseServe'
import type { apiListTs } from '@/types/service'
const { string, number, object, array, any, boolean, strNum, isNumber, isString } = typeObj
const apiList: apiListTs = {
    // 获取水质研判点位-screen
    queryAlarmIdsAggregated: {
        path: '/api/v1/alarm/statistics/queryAlarmIdsAggregatedBySiteCodeCoordinates',
        server: 'bmpAlarmCenterServer',
        method: 'post',
        params: {
            endTime: number,
            startTime: number,
            envTypeCodeList: array,
            siteTypeCodeList: array,
            regionCode: string
        }
    },
    // 获取水质研判点位-PC
    queryAlarmIdsAggregatedPC: {
        path: '/api/v1/eventStatistic/eventControl/queryEventIdListAggregatedBySites',
        server: 'bmpEventCenterServer',
        method: 'post',
        params: {
            endTime: number,
            startTime: number,
            envTypeCodeList: array,
            siteTypeCodeList: array,
            regionCode: string
        }
    },
    // 点位预警列表
    queryPage: {
        path: '/api/v1/alarmRecord/pc/queryPage',
        server: 'bmpAlarmCenterServer',
        method: 'post',
        params: {
            envTypeCodeList: array,
            alarmTypeCodes: [string, undefined],
            startHour: number,
            endHour: number,
            isQueryDetail: boolean, // 默认true
            limit: number,
            page: number,
            alarmTimeEnd: number,
            alarmTimeStart: number,
            siteCodeList: array,
            alarmTypeCodeList: array,
            alarmLevelCode: string,
            disposalStatus: strNum,
            factorCodes: string
        }
    },
    // 获取水研判分析code
    querySiteListByAccessCode: {
        path: '/wgms-base-server/api/v1.0/client/querySiteListByAccessCode',
        server: 'wgmsBaseServer',
        method: 'get',
        params: {
            stationCode: number,
            accessCode: string,
        }
    },
    // 点位详情获取相关预警列表
    getEventInfoByEventIds: {
        path: '/api/v1/eventStatistic/eventControl/getEventInfoByEventIds',
        server: 'bmpEventCenterServer',
        method: 'post',
        params: {
            eventIds: array,
            limit: number,
            page: number
        }
    },
    // 点位详情获取预警统计
    countByAlarmLevel: {
        path: '/api/v1/alarm/statistics/countByAlarmLevel',
        server: 'bmpAlarmCenterServer',
        method: 'post',
        params: {
            startTime: number,
            endTime: number,
            isAccessPermission: boolean,
            envTypeCodeList: array,
            siteCodeList: array,
            alarmTypeCodeList: array, // 报警类型筛选
            disposalStatusList: array // 处置类型筛选
        }
    },
    // 水位趋势对比图
    rainHydrologyAnalyse: {
        path: '/water/alarm/analyse/quality-rain-hydrology-analyse',
        server: 'prjHangzhouWgmsScreenServer',
        params: {
            startTime: number,
            endTime: number,
            factorCode: string,
            siteCode: string,
            timeType: string
        }
    },
    // k线
    getKLine: {
        path: '/water/alarm/analyse/k-line',
        server: 'prjHangzhouWgmsScreenServer',
        params: {
            startTime: number,
            endTime: number,
            factorCode: string,
            siteCode: string,
            timeType: string
        }
    },
    // 沿程分析
    pathAnalysisNew: {
        path: '/water/alarm/analyse/path-analysis-new',
        server: 'prjHangzhouWgmsScreenServer',
        params: {
            time: number,
            factorCode: string, // 因子编码
            siteCode: string, // 站点编码
            sourceIds: string, // 关联的站点id
            timeType: string // 报警类型映射
        }
    },
    /**
     * 研判分析(查询周边水质站)
     */
    wgmsQueryAround: {
        path: '/api/v1.0/env-elements/query-surrounding-list',
        server: 'wgmsSurroundingTraceServer',
        params: {
            surroundingStationCodes: string,
            longitude: string,
            latitude: string,
            radius: number
        }
    },
    /**
     * 根据树id查询监测点列表(地表水)
     */
    wgmsQuerySitesByTreeId: {
        path: '/api/v1.0/ranking/site',
        server: 'wgmsMonitorDataServer',
        params: {
            treeId: number,
            treeType: number,
            beginTime: number,
            endTime: number,
            dataTimeType: number,
            queryTimeType: string,
            factor: number,
            factorFlag: boolean
        }
    },
    /**
     * 根据树id查询监测点列表(地表水)
     */
    // wgmsFilterSitesNew: {
    //     path: '/water/expand/alarm/map-site-distance',
    //     server: 'prjHangzhouWgmsScreenServer',
    //     params: {
    //         factorGroupId: number,
    //         startTime: number,
    //         endTime: number,
    //         distance: number,
    //         stationCode: number,
    //         timeType: string,
    //         longitude: any,
    //         latitude: any,
    //         isKey: number
    //     }
    // },
    // 相关性分析
    correlationAnalysis: {
        path: '/water/alarm/analyse/correlation-analysis',
        server: 'prjHangzhouWgmsScreenServer',
        params: {
            startTime: number,
            endTime: number,
            factorCode: string,
            siteCode: string,
            sourceIds: string,
            timeType: string
        }
    },
    // 研判结论
    analysisResult: {
        path: '/water/alarm/analyse/analyse-result',
        server: 'prjHangzhouWgmsScreenServer',
        params: {
            distance: number,
            startTime: number,
            endTime: number,
            factorCode: string,
            siteCode: string,
            timeType: string,
        }
    },
    // 获取某一时间点之后的状态数量统计
    countEventStatusByTimePoint: {
        path: '/api/v1/event/statistic/countEventStatusByTimePoint',
        server: 'bmpEventCenterServer',
        method: 'post',
        params: {
            envTypeCodeList: array,
            siteCodeList: any,
            timeStamp: number,
            centerLatitude: string,
            centerLongitude: string,
        }
    },
    // 重点源
    pomsAlarmStat: {
        path: '/water/alarm/analyse/poms-alarm-stat',
        server: 'prjHangzhouWgmsScreenServer',
        params: {
            startTime: number,
            endTime: number,
            factorCode: string,
            siteCode: string,
            distance: number,
            timeType: string,
        }
    },
    // 溢流口
    overFlowOutlet: {
        path: '/water/alarm/analyse/over-flow-outlet',
        server: 'prjHangzhouWgmsScreenServer',
        params: {
            distance: number,
            latitude: string,
            longitude: string,
            timeType: string,
        }
    },
    // 事件
    queryEventDataByTimePoint: {
        path: '/api/v1/event/statistic/queryEventDataByTimePoint',
        server: 'bmpEventCenterServer',
        method: 'post',
        params: {
            envTypeCodeList: array,
            siteCodeList: array,
            timeStamp: number,
            centerLatitude: string,
            centerLongitude: string,
            page: number,
            limit: number,
        }
    },
    // 重点源预警
    pomsAlarm: {
        path: '/water/alarm/analyse/poms-alarm',
        server: 'prjHangzhouWgmsScreenServer',
        params: {
            startTime: number,
            endTime: number,
            distance: number,
            siteCode: string,
            factorCodes: string,
            timeType: string,
        }
    },
    // 重点波动率
    pomsAnalysis: {
        path: '/water/alarm/analyse/poms-analysis',
        server: 'prjHangzhouWgmsScreenServer',
        params: {
            startTime: number,
            endTime: number,
            factorCode: string,
            siteCode: string,
            distance: number,
            timeType: string,
        }
    },
    /**
     * 研判分析(查询周边水质站)-产品 废水
     */
    queryHistoryDataSewage: {
        path: '/api/v3.0/oneMap/queryHistoryData',
        server: 'wgmsSewageDataServer',
        method: 'post',
        params: any
    },
    /**
     * 研判分析(查询周边水质站)-产品
     */
    queryHistoryData: {
        path: '/api/v3.0/oneMap/queryHistoryData',
        server: 'wgmsMonitorDataServer',
        method: 'post',
        params: any
    },
    /**
     * 研判分析点位接口
     */
    mapSiteDistance: {
        path: '/water/expand/alarm/map-site-distance',
        server: 'prjHangzhouWgmsScreenServer',
        method: 'get',
        params: {
            borderSituation: [string, undefined],
            controlLevel: [string, undefined],
            distance: number,
            factorGroupId: string,
            isKey: [number, undefined],
            latitude: number,
            longitude: number,
            monitoringMethods: [number, undefined],
            property: [undefined, string],
            startTime: number,
            stationCode: string,
            timeType: string,
            regionCode: [undefined, string]
        }
    },
    // 报警处置流程
    alarmFlow: {
        pathExpr: '/api/v1/alarmRecord/app/detailMissionAndCommit/{{id}}',
        server: 'bmpAlarmCenterServer',
    },
    // 余杭五水共治预警事件统计接口
    countEachEventLevelAlarmNumber: {
        path: '/api/v1/event/backend/statistic/countEachEventLevelAlarmNumber',
        method: 'post',
        server: 'bmpEventCenterServer',
        params: {
            startTime: number,
            endTime: number,
            page: number,
            limit: number,
            eventLevelCodeList: array,
            regionCodeList: array,
            envTypeCodeList: array
        }
    },
    // 布点现状
    situation: {
        path: '/water/yh/monitor/situation',
        server: 'prjHangzhouWgmsScreenServer',
        params: {
            monitoringMethods: strNum,
            regionCode: string,
        }
    },
    // 地表水-重点月份
    month: {
        path: '/api/v3.0/surfaceWater/app/main/month',
        server: 'wgmsMonitorDataServer',
        params: {
            treeId: string,
            treeType: number,
            beginTime: number,
            endTime: number,
            queryTimeType: string,
            factor: [string, undefined],
            factorFlag: [undefined, boolean],
            controlLevel: string
        }
    },
    // 地表水-重点因子
    factor: {
        path: '/api/v3.0/surfaceWater/app/main/factor',
        server: 'wgmsMonitorDataServer',
        params: {
            treeId: string,
            treeType: number,
            beginTime: number,
            endTime: number,
            queryTimeType: string,
            factor: [string, undefined],
            factorFlag: [undefined, boolean],
            controlLevel: string
        }
    }
}
export default apiList
