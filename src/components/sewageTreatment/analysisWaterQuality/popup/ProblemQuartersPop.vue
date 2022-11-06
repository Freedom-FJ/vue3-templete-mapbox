<!--
 * @Author: mjh
 * @Date: 2022-09-01 16:27:12
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-16 13:48:50
 * @Description:
-->
<template lang="pug">
PopupPanel( :title="title" type="right" :height="280")
    popup-table(:option="option" ref="popupTableDom"  :data="tableData" :height="tableHeight" )
        template( v-slot:value="{props}")
            .table-solt
                .num-14.green {{props.item.green}}
                .num-mid.mg-2 /
                .num-14.yellow   {{props.item.yellow}}
                .num-mid.mg-2 /
                .num-14.orange {{props.item.oragin}}
</template>

<script lang="ts" setup name="ProblemQuartersPop">
import { useMapStore } from '@/store/map'
import { usePopStore } from '@/store/popControl'
import MapUtil from '@/utils/map/mapUtils'
import type { popTableOptionTs } from '@/types/common'
import { showMapPop } from '@/utils/map/mapInit'
const popStore = usePopStore()
const mapStore = useMapStore()
const data = reactive({
    title: '问题小区',
    option: [] as popTableOptionTs[],
    tableData: [] as record[],
    tableHeight: 760,
    popupTableDom: ref()
})
watch(() => mapStore.getMapPop, (val) => {
    if (val.id !== 'MapPointWarningPop-panel') data.popupTableDom?.clearClick()
})
watch(() => popStore.getPopData, (val) => {
    if (popStore.getCurrentPop !== 'ProblemQuartersPop') return
    if (val === 0) data.title = '异常入河排污口'
    if (val === 1) data.title = '问题小区'
    if (val === 2) data.title = '问题园区'
}, { immediate: true })
onMounted(() => {
    detailBadVRiver()
})

/**
     * @name: 处理劣V河道
     */
const detailBadVRiver = () => {
    data.option = [
        {
            label: '序号',
            key: 'index',
            flex: 0.5
        },
        {
            label: '小区名称',
            key: 'name',
            flex: 2
        },
        {
            label: '操作',
            type: 'tool',
            toolList: [
                {
                    label: '详情',
                    click: () => {
                        console.log('object')
                    }
                }
            ]
        }
    ]
    data.tableData = [
        { index: 1, name: '西房余杭公馆', green: '140', yellow: '42', oragin: 2 },
        { index: 2, name: '融创·河滨之城', green: '140', yellow: '42', oragin: 2 },
        { index: 3, name: '余杭区南苑小区', green: '140', yellow: '42', oragin: 2 },
        { index: 3, name: '马鞍山雅苑', green: '140', yellow: '42', oragin: 2 },
        { index: 3, name: '向塘小区', green: '140', yellow: '42', oragin: 2 },
    ]
}

/**
     * @name: 地图弹框事件
     * @param {*} item
     * @param {*} index
     */
const checkLine = (item: record, index: number) => {
    if (index === -1) {
        MapUtil._removeMapboxPopup()
        return
    }
    showMapPop('MapPointWarningPop', item, [119.969159547273492, 30.260760948238307], 'MapPointWarningPop-panel')
}

const { option, tableData, title, tableHeight, popupTableDom } = toRefs(data)
</script>

<style scoped lang="scss">
.table-solt {
    display: flex;
    flex: 1;
    justify-content: center;
}
</style>

