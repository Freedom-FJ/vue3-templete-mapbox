/*
 * @Author: mjh
 * @Date: 2022-09-13 20:20:06
 * @LastEditors: Tian
 * @LastEditTime: 2022-10-11 16:13:35
 * @Description:
 */
import { typeObj } from '@/service/baseServe'
import type { apiListTs } from '@/types/service'
// import { getSetTreeCode } from '@/utils/treeDataUtils'
const { string, number, object, array, any, boolean, strNum } = typeObj
// const treeData = await getSetTreeCode()

const apiList: apiListTs = {
    // 报警类型筛选数据
    queryAlarmTypeByRole: {
        path: '/api/v1/coordinated/control/common/alarmSiteTree/queryAlarmTypeByRole',
        server: 'bmpCoordinatedControlCommonServer',
        method: 'post',
        params: {
            envTypeCodeList: array, // 默认值[water]
            isQueryRole: boolean // 默认值 false
        }
    },
    // 报警级别列表
    alarmLevelAll: {
        path: '/api/v1/alarmLevel/all',
        server: 'bmpAlarmCenterServer',
    },
    // 获取报警因子列表
    queryFactorCodeListByAlarmType: {
        path: '/api/v1/alarmRecord/pc/queryFactorCodeListByAlarmType',
        server: 'bmpAlarmCenterServer',
        method: 'post',
        params: {
            envTypeCodeList: array,
            alarmTypeCodeList: array
        }
    },
    // 获取处置列表
    getDisposalStatus: {
        path: '/api/v1/alarm/getDisposalStatus',
        server: 'bmpAlarmCenterServer',
    },
    // 获取waterQuality和sectionType
    getSurfaceWaterSection: {
        pathExpr: '/api/v1.0/section/surfaceWaterSection/{{id}}',
        server: 'wgmsBaseServer',
    },
    // 获取waterQuality和sectionType 根据accessCode查询
    querySiteListByAccessCode: {
        path: '/api/v1.0/client/querySiteListByAccessCode',
        server: 'wgmsBaseServer',
        params: {
            stationCode: number,
            accessCode: string,
            configTime: number
        }
    },
    /**
     * 获取水基础信息全部因子数据
     */
    wgmsGetAllFactorList: {
        path: '/api/v1.0/factor/factorGroup/queryFactorIndex',
        server: 'wgmsBaseServer',
    },
    /**
     * 获取因子组信息
     */
    queryFactorGroup: {
        path: '/api/v1.0/factor/functionPoint/queryFactorGroupByCode',
        server: 'wgmsBaseServer',
        params: {
            code: string
        }
    },
    /**
     * 获取视频树
     */
    getVideoTree: {
        path: '/api/v1/video/list/tree-v2',
        server: 'hzsVideoDataSyncServer',
        method: 'get',
        params: {
            type: string,
            areaCode: string
        }
    },
    /**
     * 获取视频点位
     */
    getVideoList: {
        path: '/api/v1/video/cameraListV2',
        server: 'hzsVideoDataSyncServer',
        method: 'post',
        params: {
            cameraType: string,
            type: string,
            areaCode: string
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    },
    /**
     * 获取视频流
     */
    getVideoUrl: {
        path: '/api/v1/video/flvUrl',
        server: 'hzsVideoDataSyncServer',
        method: 'get',
        params: {
            serial: string,
            code: string,
            videoAddress: string
        }
    },
    /**
     * 获取图层信息
     */
    mapPoint: {
        path: '/water/expand/map-point?userId=1',
        server: 'prjHangzhouWgmsScreenServer',
        headers: {
            regioncode: 330110000000
        }
    },
    /**
     * 获取图层信息
     */
    mapSite: {
        path: '/water/wgms/map-site',
        server: 'prjHangzhouWgmsScreenServer',
        headers: {
            regioncode: 330110000000
        },
        params: {
            borderSituation: [string, undefined],
            controlLevel: [string, undefined],
            factorGroupId: string,
            isKey: [number, undefined],
            monitoringMethods: [number, string, undefined],
            property: [undefined, string],
            stationCode: string,
            startTime: [undefined, number],
            regionCode: [undefined, string]
        }
    },
    // 获取站点类型
    getStationCode: {
        path: '/api/v1.0/commonCode/query',
        server: 'wgmsBaseServer',
        params: {
            offset: number,
            limit: number,
            categoryId: strNum,
            queryStr: string
        }
    },
    // 获取图层数据
    getMapLayer: {
        path: '/api/v1.0/config/menuConfig/user',
        server: 'wgmsBaseServer'
    },
    // 获取站点数量
    getMapLayerCount: {
        path: '/api/v3.0/surfaceWater/app/queryStationCount',
        server: 'wgmsMonitorDataServer',
        params: {
            treeType: number,
            treeId: string,
            stationCodes: string
        }
    },
    // 获取污染源站点数量
    getMapLayerPomsCount: {
        path: '/api/v3.0/poms/app/queryStationCount',
        server: 'wgmsSewageDataServer',
        params: {
            treeType: number,
            treeId: string,
            stationCodes: string
        }
    },
    // 区域
    regionQuery: {
        path: '/api/v2.0/region/query',
        server: 'basicInformationManagerServer',
        params: {
            offset: number,
            limit: number,
            id: number
        }
    },
    // 流域
    watershedQuery: {
        path: '/api/v2.0/watershed/query',
        server: 'basicInformationManagerServer',
        params: {
            offset: number,
            limit: number,
            id: number
        }
    },
    // 获取区域code
    query: {
        path: '/api/v2.0/region/query',
        server: 'basicInformationManagerServer',
        params: {
            offset: number,
            limit: number,
            id: number,
            queryStr: string
        }
    },
    // 获取站点目标值
    surfaceWaterStandard: {
        path: '/api/v1.0/factor/surfaceWaterStandard',
        server: 'wgmsMonitorDataServer',
        params: {
            baseLevel: [string, number],
            factorGroup: string,
            sectionType: string
        }
    },
    // 水检测点趋势变化(地表水)
    wgmsStationDataChange1: {
        path: '/api/v1.0/analyse/singleSiteQuality',
        server: 'wgmsMonitorDataServer',
        params: any
    },
    // 水检测点趋势变化(饮用水水)
    wgmsStationDataChange40: {
        path: '/api/v1.0/drinkWater/waterQuality/singleSiteQuality',
        server: 'wgmsMonitorDataServer',
        params: any
    },
    // 获取流域树
    getValleyTree: {
        path: '/api/v1.0/client/watershed/queryByCodes',
        server: 'wgmsBaseServer',
        params: {
            codes: 'string' // watershed
        }
    },
    // 获取区域树
    getAreaTree: {
        path: '/api/v1.0/client/region/queryByCode',
        server: 'wgmsBaseServer',
        params: {
            code: 'string' // region
        }
    },
    /**
     * 查询摄像头点位
     */
    cameraList: {
        path: '/api/v1/video/cameraList',
        server: 'hzsVideoDataSyncServer',
        params: {
            unionId: 'string' // region
        }
    },
    /**
     * 水雨情时序分析
     */
    wgmsRainWaterSingleSiteQuality: {
        path: '/api/v1.0/rainWater/analyse/singleSiteQuality',
        server: 'wgmsMonitorDataServer',
        params: {
            accessCode: string,
            factor: string,
            factorFlag: boolean,
            beginTime: strNum,
            endTime: strNum,
            dataTimeType: number,
            queryTimeType: string,
            siteId: string
        }
    },
    /**
     * 水雨情时序分析
     */
    wgmsHydrometricSingleSiteQuality: {
        path: '/api/v1.0/hydrometric/analyse/singleSiteQuality',
        server: 'wgmsMonitorDataServer',
        params: {
            accessCode: string,
            factor: string,
            factorFlag: boolean,
            beginTime: strNum,
            endTime: strNum,
            dataTimeType: number,
            queryTimeType: string,
            siteId: string
        }
    },
    /**
     * 获取ppt名称
     */
    getPPtName: {
        path: '/v1/cs/configs',
        server: 'nacosServer',
        params: {
            dataId: string,
            group: string
        }
    },
    /**
     * 获取不同站点类型预警数量
     */
    monitorWarnData: {
        path: '/api/v1/alarm/statistics/countSiteTypeAndRate',
        server: 'bmpAlarmCenterServer',
        method: 'post',
        params: {
            startTime: number,
            endTime: number,
            envTypeCodeList: array,
            regionCodeList: array
        }
    }
}
export default apiList

