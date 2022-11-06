/*
 * @Author: mjh
 * @Date: 2022-08-29 13:48:39
 * @Description:
 */
import { defineStore } from 'pinia'
import type { factorGroupTs } from '@/types/common'

export const useCommonStore = defineStore({
    id: 'common',
    state: () => ({
        currentMapStyle: 'default' as string | number | boolean, // 地图模式，default：默认，img：卫星影像
        windowHeight: 0, // 当前窗口高度
        allFactor: {} as recordt<factorGroupTs>
    }),
    getters: {
        getMapStyle: state => state.currentMapStyle,
        getWindowHeight: state => state.windowHeight || document.documentElement.clientHeight,
        getHeight: state => (dom: HTMLElement | null) => {
            const clientHeight = state.windowHeight || document.documentElement.clientHeight
            const topHeight = dom?.offsetTop || 0
            if (dom) return `${clientHeight - topHeight - 100}px`
            return ''
        }
    },
    actions: {
        setFactor(factorCode: string, data: factorGroupTs) {
            this.allFactor[factorCode] = data
        },
        getFactor(factorCode: string) {
            return this.allFactor[factorCode]
        },
        setWindowHeight(data: number) {
            this.windowHeight = data
        },
        changeMapStyle(style: string | number | boolean) {
            this.currentMapStyle = style
        }
    }
})
