import { defineStore } from 'pinia'

export const useAxiosStore = defineStore({
    // id: 必须的，在所有 Store 中唯一
    id: 'axios',
    state: () => ({
        countIntercept: 0,
        interceptArrary: [] as any[]
    }),
    // getters
    getters: {
        countInterceptData: state => state.countIntercept,
        interceptArraryData: state => state.interceptArrary
    },
    actions: {
        async addIntercept(api: any) {
            // 可以做异步
            this.countIntercept++
            this.interceptArrary.push(api)
        },
        async clearIntercept(num?: number) {
            this.interceptArrary.forEach((ele: any) => {
                ele.cancel('取消了请求') // 在失败函数中返回这里自定义的错误信息
            })
            this.countIntercept = 0
            this.interceptArrary = []
        }
    }
})
