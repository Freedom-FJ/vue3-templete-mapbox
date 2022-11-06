/*
 * @Author: mjh
 * @Date: 2022-09-12 20:49:43
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-01 17:05:41
 * @Description:
 */
export default class Base {
    /* 水模块 */
    static wgmsService = 'prj-hy-wgms-screen-server'
    static prjHangzhouWgmsScreenServer = 'prj-hangzhou-wgms-screen-server'
    static bmpEventCenterServer = 'bmp-event-center-server'
    static bmpCoordinatedControlCommonServer = 'bmp-coordinated-control-common-server'
    static bmpAlarmCenterServer = 'bmp-alarm-center-server'
    static wgmsBspService = 'bsp-permission-server'
    static wgmsAllWaterMonitorServer = 'wgms-all-water-monitor-server'
    static wgmsMonitorDataServer = 'wgms-monitor-data-server'
    static wgmsBaseServer = 'wgms-base-server'
    static wgmsSewageDataServer = 'wgms-sewage-data-server'
    static basicInformationManagerServer = 'basic-information-manager-server'
    static bspPermissionServer = 'bsp-permission-server'
    static wgmsSurroundingTraceServer = 'wgms-surrounding-trace-server'
    static wgmsBasicInfoServer = 'basic-information-manager-server'
    static prjYuhang = 'prj-hangzhou-wgms-screen-server'
    static configServer = 'config-server'
    static hzsVideoDataSyncServer = 'hzs-video-data-sync-server'
    static videoServe = 'hzs-video-data-sync-server'
    static nacosServer = 'nacos'
    static nav = 'nacos/v1/cs'
    static simpleUserCenterServer = 'simple-user-center-server'
    static envStandardManagerServer = 'env-standard-manager-server'
    static none = ''
}

export const typeObj = {
    string: 'string',
    number: 'number',
    object: 'object',
    array: 'array',
    boolean: 'boolean',
    strNum: ['string', 'number'],
    any: 'any',
    isString: ['string', 'undefined'],
    isNumber: ['number', 'undefined']
}
