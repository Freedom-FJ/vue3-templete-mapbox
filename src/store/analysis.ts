/*
 * @Author: mjh
 * @Date: 2022-09-06 15:59:16
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-28 15:58:42
 * @Description:
 */
import { defineStore } from 'pinia'
import type { analysisDataTs } from '@/types/common'

export const useAnalysisStore = defineStore({
    // id: 必须的，在所有 Store 中唯一
    id: 'analysis',
    state: () => ({
        analysis: {
            type: '',
            distance: 0,
            dateTime: [] as number[],
            data: {} as Partial<analysisDataTs>
        },
        analysisRemember: null as null | {
            pop: {
                currentPop: string // 当前显示的面板
                popData: any
            }
            type?: strNum
            popPoint: any
        },
        traceability: {
            type: '',
            distance: 0,
            dateTime: [] as number[],
            data: {} as Partial<analysisDataTs>
        }
    }),
    // getters
    getters: {
        getAnalysisData: state => state.analysis,
        getAnalysisTypeData: state => state.analysis.type,
        getAnalysisValueData: state => state.analysis.data,
    },
    actions: {
        // 研判分析
        startAnalysis(analy: { type?: string; distance?: number; dateTime?: number[]; data?: any }) {
            const { type, distance, dateTime, data } = analy
            distance && (this.analysis.distance = distance)
            dateTime && (this.analysis.dateTime = dateTime)
            data && (this.analysis.data = data)
            type && (this.analysis.type = type)
        },
        resetInWaterQuality(distance: number) {
            this.analysis.distance = distance
            this.analysis.data = {
                ...this.analysis.data,
                pointData: '',
                overflowPortNum: 0,
                accessCodeList: '',
            }
        },
        setRemember(val: {
            pop: {
                currentPop: string // 当前显示的面板
                popData: any
            }
            type?: strNum
            popPoint: any
        }) {
            this.analysisRemember = val
        },
        clearRemenber() {
            this.analysisRemember = null
        },
        upDataDetail(data: record) {
            const detail = this.analysis.data
            this.analysis.data = { ...detail, ...data, }
        },
        endAnalysis() {
            this.analysis = {
                type: '',
                distance: 0,
                dateTime: [],
                data: {}
            }
        },
        // 分析溯源
        startTraceability(traceability: { type?: string; distance?: number; dateTime?: number[]; data?: any }) {
            const { type, distance, dateTime, data } = traceability
            distance && (this.traceability.distance = distance)
            dateTime && (this.traceability.dateTime = dateTime)
            data && (this.traceability.data = data)
            type && (this.traceability.type = type)
        },
        endTraceability() {
            this.traceability = {
                type: '',
                distance: 0,
                dateTime: [],
                data: {}
            }
        },
    },
    persist: {
        enabled: true, // 开启存储
        // storage:sessionStorage/localStorage,还可以自定义存入对应的如下
        // 不写以下也可以 默认是sessionStorage
        // strategies: [
        //     { storage: cookiesStorage, paths: ['info'] }
        //     //{ storage: localStorage, paths: ['info'] }
        //     //{ storage: sessionStorage, paths: ['info'] }
        // ],
    }
})
