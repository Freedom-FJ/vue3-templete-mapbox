/*
 * @Author: mjh
 * @Date: 2022-08-29 13:48:39
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-04 15:42:46
 * @Description:
 */
import { defineStore } from 'pinia'
import type { PlayVideoParams } from '@/components/map/rightTools/comp/types'
import type { mapPoinReturnTs, mapPointInitTs, mapPointNewLayerTs } from '@/types/common'
export const useMapStore = defineStore({
    id: 'map',
    state: () => ({
        currMapPop: {
            id: '',
            coordinates: [] as number[]
        },
        mapLoaded: false, // 地图是否加载完成
        monitoringMethodsList: [], // 手工类型  0自动 1手工
        controlMapLayerHandle: '' as Arrayable<string> | Record<string, string[]>, // 手动修改地图图层变量
        mapLayerList: [] as Record<string, any>[],
        mapLayerSelectedSites: [] as mapPointNewLayerTs,
        mapVideoParams: {} as PlayVideoParams
    }),
    getters: {
        getMapPop: (state) => {
            return state.currMapPop
        },
        getMapPopId: state => state.currMapPop.id,
        getMapPopCoordinates: state => state.currMapPop.coordinates,
        getMapLoaded: state => state.mapLoaded,
        getMapLayerSelectedSites: state => state.mapLayerSelectedSites,
        getVideoParams: state => state.mapVideoParams
    },
    actions: {
        setMapPop(popData: { id: string; coordinates: number[] }) {
            this.currMapPop = popData
        },
        setMapLayerList(mapLayerList: Record<string, any>[]) {
            this.mapLayerList = mapLayerList
        },
        setMapLayerSelectedSites(mapLayerSelectedSites: mapPointNewLayerTs) {
            this.mapLayerSelectedSites = mapLayerSelectedSites
        },
        setMapVideoParams(params: PlayVideoParams) {
            this.mapVideoParams = params
        },
        closeMapPop() {
            this.currMapPop = {
                id: '',
                coordinates: []
            }
        },
        setMapLoaded(data: boolean) {
            this.mapLoaded = data
        }
    }
})
