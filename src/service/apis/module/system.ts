/*
 * @Author: Tian
 * @Date: 2022-05-06 13:37:55
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-15 12:05:43
 * @Description: 8
 */
import { typeObj } from '@/service/baseServe'
import type { apiListTs } from '@/types/service'
const { string, number, object, array, any, boolean } = typeObj
const apiList: apiListTs = {
    // 危废联单列表
    systemMenus: {
        path: '/api/v1.0/permissions/systemMenus',
        server: 'bspPermissionServer',
        method: 'post',
        params: {
            systemCode: string
        },
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'token': window.localStorage.getItem('token') || ''
        }
    },

}
export default apiList
