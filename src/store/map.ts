/*
 * @Author: mjh
 * @Date: 2022-08-29 13:48:39
 * @LastEditors: mjh
 * @LastEditTime: 2022-11-20 23:33:02
 * @Description:
 */
import { defineStore } from 'pinia'
import { DataType } from '@/utils/tools'

import type { LayerCodeTs, LayerSelectDataTs } from '@/types/map'
export const useMapStore = defineStore({
    id: 'map',
    state: () => ({
        currMapPop: {
            id: '',
            coordinates: [] as number[]
        },
        mapLoaded: false, // 地图是否加载完成
        monitoringMethodsList: [], // 手工类型  0自动 1手工
        mapLayer: {} as LayerSelectDataTs,
        controlMapLayerHandle: '' as Arrayable<string> | Record<string, string[]>, // 手动修改地图图层变量
    }),
    getters: {
        getMapPop: (state) => {
            return state.currMapPop
        },
        getMapLayer: state => state.mapLayer,
        getMapPopId: state => state.currMapPop.id,
        getMapPopCoordinates: state => state.currMapPop.coordinates,
        getMapLoaded: state => state.mapLoaded,
    },
    actions: {
        setMapLayer(mapLayer: LayerSelectDataTs) {
            this.mapLayer = mapLayer
        },
        initAllCheckMapLayer() {
            for (const key in this.mapLayer) {
                this.mapLayer[key as LayerCodeTs].isCheckAll = false
                this.mapLayer[key as LayerCodeTs].checkedList = []
            }
        },
        setCheckMapLayer(nameOrList?: Arrayable<LayerCodeTs> | Record<LayerCodeTs, string[]>) {
            this.initAllCheckMapLayer()
            if (typeof nameOrList === 'string' || !nameOrList) {
                this.setLayerByName(nameOrList)
            }
            else if (DataType(nameOrList, 'array')) {
                (nameOrList as string[]).forEach((item: string) => {
                    this.setLayerByName(item as LayerCodeTs)
                })
            }
            else {
                Object.keys(nameOrList).forEach((item: string) => {
                    const currCheckCode = (nameOrList as Record<LayerCodeTs, string[]>)[item as LayerCodeTs]
                    const currMapLayerObj = this.mapLayer[item as LayerCodeTs]
                    this.mapLayer[item as LayerCodeTs].isCheckAll = currCheckCode.length === currMapLayerObj.children.length
                    this.mapLayer[item as LayerCodeTs].indeterminate = currCheckCode.length !== 0 && this.mapLayer[item as LayerCodeTs].isCheckAll
                    this.mapLayer[item as LayerCodeTs].checkedList = (nameOrList as Record<string, string[]>)[item]
                })
            }
        },
        setLayerByName(name: LayerCodeTs | undefined) {
            if (!name) return
            const currMapLayer = this.mapLayer[name]
            if (!currMapLayer) return
            currMapLayer.isCheckAll = true
            currMapLayer.checkedList = currMapLayer.children.map(item => item.stationCodes)
        },
        setMapPop(popData: { id: string; coordinates: number[] }) {
            this.currMapPop = popData
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
