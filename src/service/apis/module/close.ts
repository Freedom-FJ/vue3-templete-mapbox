/*
 * @Author: mjh
 * @Date: 2022-09-13 20:20:06
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-04 15:06:29
 * @Description:
 */
import { typeObj } from '@/service/baseServe'
import type { apiListTs } from '@/types/service'
const { string, number, object, array, any, boolean, isString, isNumber, strNum } = typeObj
const apiList: apiListTs = {
    // 市级主动发现 督查在线
    enforceGetData: {
        pathExpr: 'https://stzw.epb.hangzhou.gov.cn/out/xinxiang/enforce/works/enforce/issue/getData?jkbh={{jkbh}}&areaCode={{areaCode}}', // https://stzw.epb.hangzhou.gov.cn
        server: 'none',
        method: 'post'
    },
    // 获取xinxiang的登陆信息
    getAuth: {
        path: 'https://stzw.epb.hangzhou.gov.cn/out/xinxiang/envir-issue-extra/system/login/token/juguang?token=3337d8e6f7854d6290be5dcee62cb5c0', // https://stzw.epb.hangzhou.gov.cn
        server: 'none',
        method: 'get',
        params: {
            token: string,
        },
    },
    // 登陆杭州
    loginHZ: {
        path: '/public/zlb/user/login?pwd=9987156207cb5a8a70729c20539520f2&serverUrl=https://stzw.epb.hangzhou.gov.cn/simple-user-center-server&user=root',
        server: 'prjHangzhouWgmsScreenServer'
    }

}
export default apiList

