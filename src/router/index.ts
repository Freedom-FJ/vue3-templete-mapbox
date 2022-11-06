/*
 * @Author: wangtian
 * @Date: 2021-07-31 17:58:36
 * @LastEditors: wangtian
 * @LastEditTime: 2021-09-26 11:03:56
 * @Description: 路由注册
 */
import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import { vueRouters } from './getRouters'
import Config from '@/config'
const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: Config.defaultRouteName
    },
    ...vueRouters()
]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})
// router.beforeEach((to, from, next) => {
//     if (from.path === '/') {
//         window.axiosCancel = []
//         return next()
//     } else {
//         const cancelArr = window.axiosCancel
//         cancelArr.forEach((ele: any) => {
//             ele.cancel('取消了请求') // 在失败函数中返回这里自定义的错误信息
//         })
//         window.axiosCancel = []
//         return next()
//     }
// })
export default router
