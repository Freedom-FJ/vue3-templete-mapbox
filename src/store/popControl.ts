/*
 * @Author: mjh
 * @Date: 2022-08-29 13:48:39
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-02 17:01:13
 * @Description:
 */
import { defineStore } from 'pinia'

export const usePopStore = defineStore({
    id: 'pop',
    state: () => ({
        currentPop: '', // 当前显示的面板
        popData: '' as any
    }),
    getters: {
        getPop: (state) => {
            return { popData: state.popData, currentPop: state.currentPop }
        },
        getCurrentPop: state => state.currentPop,
        getPopData: state => state.popData,
    },
    actions: {
        async upDatePopup(data: { currentPop: string; popData?: any }) {
            if (this.currentPop === data.currentPop && this.popData === data.popData) {
                this.currentPop = ''
                this.popData = ''
                return
            }
            this.currentPop = data.currentPop
            this.popData = data.popData
        },
        initPop() {
            this.currentPop = ''
            this.popData = ''
        }
    }
})
