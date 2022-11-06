/*
 * @Author: mjh
 * @Date: 2022-09-06 15:59:16
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-19 16:40:38
 * @Description:
 */
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
const router = useRouter()
export const useRouterControlStore = defineStore({
    // id: 必须的，在所有 Store 中唯一
    id: 'router',
    state: () => ({
        routerData: {
            path: '',
            data: {} as any
        }
    }),
    // getters
    getters: {
        getRouter: state => state.routerData,
        getPathData: state => state.routerData.path,
        getRouterData: state => state.routerData.data
    },
    actions: {
        push(data: { path: string; data?: any }) {
            console.log(router, data, 'data')
            // 可以做异步
            this.routerData = {
                path: data.path,
                data: data.data || {}
            }
        }
    }
})
