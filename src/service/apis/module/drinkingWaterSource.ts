import { typeObj } from '@/service/baseServe'
import type { apiListTs } from '@/types/service'
const { string, number, object, array, any, boolean } = typeObj
const apiList: apiListTs = {
    // 藻类监控面板接口
    // 自动
    algaeOverStat: {
        path: '/api/v1/yayun/algae-over-stat',
        server: 'prjYuhang',
        method: 'get',
        params: {
            begin: number,
            end: number,
            timeType: string
        }
    },
    // 手动
    algaeOverStatHandle: {
        path: '/api/v2/algae/algae-over-stat',
        server: 'prjYuhang',
        method: 'get',
        params: {
            begin: number,
            end: number,
            timeType: string
        }
    },
    // 饮用水-水源地达标率统计
    reachRateScale: {
        path: '/api/v3.0/drinkWater/reachRate/scale',
        server: 'wgmsMonitorDataServer',
        params: {
            treeType: string,
            treeId: string,
            queryTimeType: string,
            beginTime: number,
            endTime: number,
            factorFlag: boolean,
            factor: [string, number],
        },
    },
    // 藻类监测弹框接口
    // 自动
    algaeSiteOverStat: {
        path: '/api/v1/yayun/algae-site-over-stat',
        server: 'prjYuhang',
        method: 'get',
        params: {
            begin: number,
            end: number,
            timeType: string
        }
    },
    // 手工
    algaeSiteOverStatHandle: {
        path: '/api/v2/algae/algae-site-over-stat',
        server: 'prjYuhang',
        method: 'get',
        params: {
            begin: number,
            end: number,
            timeType: string
        }
    },
    algaeRealStatHandle: {
        path: '/api/v2/algae/algae-real-data',
        server: 'prjYuhang',
        method: 'get',
        params: {
            begin: number,
            end: number
        }
    },
    // 藻类预警地图点位接口
    algaeRealStat: {
        path: '/api/v1/yayun/algae-real-data',
        server: 'prjYuhang',
        method: 'get',
    },

    // 站点弹框详情接口
    // 自动
    algaeSiteOverList: {
        path: '/api/v1/yayun/algae-site-over-list',
        server: 'prjYuhang',
        method: 'get',
        params: {
            begin: number,
            end: number,
            accessCode: string,
            timeType: string
        }
    },
    // 手工
    algaeSiteOverListHandle: {
        path: '/api/v2/algae/algae-site-over-list',
        server: 'prjYuhang',
        method: 'get',
        params: {
            begin: number,
            end: number,
            accessCode: string,
            timeType: string
        }
    },
    // 叶绿素a变化率
    // 自动
    changeRate: {
        path: '/water/alarm/analyse/algae-analyse-factor/change-rate',
        server: 'prjYuhang',
        method: 'get',
        params: {
            time: number,
            siteCode: string,
            factorCode: string,
            timeType: string
        }
    },
    // 手工
    changeRateHandle: {
        path: '/api/v2/algae/algae-analyse-factor/change-rate',
        server: 'prjYuhang',
        method: 'get',
        params: {
            time: number,
            siteCode: string,
            factorCode: string,
            timeType: string
        }
    },
    // 排名前三关联因子
    // 自动
    algaeAnalyseFactor: {
        path: '/water/alarm/analyse/algae-analyse-factor',
        server: 'prjYuhang',
        method: 'get',
        params: {
            startTime: number,
            endTime: number,
            siteCode: string,
            factorCode: string,
            timeType: string
        }
    },
    // 手工
    algaeAnalyseHandleFactor: {
        path: '/api/v2/algae/algae-analyse-factor',
        server: 'prjYuhang',
        method: 'get',
        params: {
            startTime: number,
            endTime: number,
            siteCode: string,
            factorCode: string,
            timeType: string
        }
    },
    // 要素趋势分析
    wgmsStationDataChange1: {
        path: '/api/v1.0/analyse/singleSiteQuality',
        server: 'wgmsMonitorDataServer',
        method: 'get',
        params: {
            beginTime: number,
            endTime: number,
            factorFlag: boolean,
            siteId: string,
            dataTimeType: number,
            queryTimeType: string,
            factor: string
        }
    },
    // 氮磷比趋势变化
    // 自动
    algaeAnalyseNPCompare: {
        path: '/water/alarm/analyse/algae-analyse-np-compare',
        server: 'prjYuhang',
        method: 'get',
        params: {
            startTime: number,
            endTime: number,
            siteCode: string,
            timeType: string
        }
    },
    // 手工
    algaeAnalyseNPCHandleompare: {
        path: '/api/v2/algae/algae-analyse-np-compare',
        server: 'prjYuhang',
        method: 'get',
        params: {
            startTime: number,
            endTime: number,
            siteCode: string,
            timeType: string
        }
    },
    // 沿程变化
    pathAnalysisNew: {
        path: '/water/alarm/analyse/path-analysis-new',
        server: 'prjYuhang',
        method: 'get',
        params: {
            time: number,
            factorCode: string,
            siteCode: string,
            timeType: string
        }
    },
    // 入河排污口
    portToRiver: {
        path: '/api/v1/yayun/control/list/around/port-to-river/alarm-stat',
        server: 'prjYuhang',
        method: 'get',
        params: {
            startTime: number,
            endTime: number,
            distance: number,
            longitude: number,
            latitude: number
        }
    },
    // 重点源超标统计
    // 自动
    pomsFactorAlarm: {
        path: '/water/alarm/analyse/poms-factor-alarm',
        server: 'prjYuhang',
        method: 'get',
        params: {
            startTime: number,
            endTime: number,
            distance: number,
            siteCode: string,
            timeType: string
        }
    },
    // 手工
    pomsFactorAlarmHandle: {
        path: '/api/v2/algae/poms-factor-alarm',
        server: 'prjYuhang',
        method: 'get',
        params: {
            startTime: number,
            endTime: number,
            distance: number,
            siteCode: string,
            timeType: string
        }
    },
    // 上游断面最近报警统计
    // 自动
    algaeCorrelationAnalysis: {
        path: '/water/alarm/analyse/algae-correlation-analysis',
        server: 'prjYuhang',
        method: 'get',
        params: {
            startTime: number,
            endTime: number,
            siteCode: string,
            factorCode: string,
            timeType: string
        }
    },
    // 手工
    upstreamOverStatHandle: {
        path: '/api/v2/algae/upstream-over-stat',
        server: 'prjYuhang',
        method: 'get',
        params: {
            startTime: number,
            endTime: number,
            siteCode: string,
            factorCode: string,
            timeType: string
        }
    },
    // 重点源超标前三
    pomsAlarm: {
        path: '/water/alarm/analyse/poms-alarm',
        server: 'prjYuhang',
        method: 'get',
        params: {
            startTime: number,
            endTime: number,
            distance: number,
            siteCode: string,
            factorCodes: string
        }
    }
}
export default apiList
