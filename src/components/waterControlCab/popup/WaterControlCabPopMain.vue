<!--
 * @Author: mjh
 * @Date: 2022-09-01 16:27:12
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-11 10:41:03
 * @Description:
-->
<template lang="pug">
PopupPanel( :title="title")
    popup-table.mgb16(ref="popTableDom" :option="option" :data="tableData" :height="tableHeight" @checkLine="checkLine" :canClick="true")
    el-pagination( v-show="isShowPage" :pager-count="5" layout="prev, pager, next" :total="pageTotal" :page-size="15" @current-change="currentChange" style="margin: -5px auto;width: fit-content;")
</template>

<script lang="ts" setup name="WaterControlCabPopMain">
import { cloneDeep } from 'lodash-es'
import MapUtil from '@/utils/map/mapUtils'
import treeUtil from '@/utils/treeDataUtils'
import { showMapPop } from '@/utils/map/mapInit'
import { usePopStore } from '@/store/popControl'
import type { popTableOptionTs } from '@/types/common'
import { useMapStore } from '@/store/map'
const mapStore = useMapStore()
const popStore = usePopStore()
const data = reactive({
    title: '积水点',
    option: [] as popTableOptionTs[],
    tableData: [] as record[],
    isShowPage: false,
    pageTotal: 0,
    currPage: 1,
    remenberPointData: [] as any[],
    tableHeight: undefined as undefined | number
})
const popTableDom = ref()
watch(() => mapStore.getMapPop, (val) => {
    if (!['MapPointWarningPop-panel', 'WaterCommonMainPop-panel'].includes(val.id)) popTableDom.value?.clearClick()
})
/**
 * @name: 面板弹框控制事件
 * @param {*} val 弹框数据
 */
const detailPopChange = (val: popTs) => {
    const { popData, currentPop } = val
    data.tableHeight = undefined
    data.isShowPage = false
    switch (currentPop) {
    case 'BadVRiverPopup': // left劣V类河道
        detailBadVRiver()
        break
    case 'FloodProtectionPopup': // left 雨量超警
        detailFlood()
        break
    case 'PondingPopup': // right 积水
        detailPonding()
        break
    case 'FloodPopup': // right 洪水 旱情
        detailFloodDrought()
        break
    case 'waterQualityPop': // 水质站
        detailWaterQuality()
        break
    default:
        break
    }
}

/**
 * @name: 处理劣V河道
 */
const detailBadVRiver = async () => {
    const levelToName = ['I类河道', 'II类河道', 'III类河道', 'IV类河道', 'V类河道', '劣V类河道']
    data.title = levelToName[popStore.popData.level - 1]
    data.tableData = []
    data.option = [
        {
            label: '序号',
            key: 'index',
            flex: 0.5,
        },
        {
            label: '河道名称',
            key: 'watershedStr',
        },
        {
            label: '主要污染物',
            key: 'mainPollutant',
            render: (val: record, optionItem: popTableOptionTs) => {
                const mainPollutant = val[optionItem.key || '']
                if (mainPollutant && mainPollutant.length)
                    return mainPollutant.map((item: { name: string }) => item.name).join(',')
                return '--'
            }
        }
    ]
    if (!popStore.popData.pointData) return
    const pointData = cloneDeep(popStore.popData.pointData)
    data.pageTotal = pointData.length
    data.isShowPage = true
    data.currPage = 1
    data.tableHeight = 650
    const currTableData = await Promise.all(pointData.slice(16 * (data.currPage - 1), 16 * (data.currPage - 1) + 15).map(async (item: any, index: number) => {
        const waterData = await treeUtil.getValleyCodeObj(item.watershedId)
        const watershedStr = waterData ? waterData.label : '--'
        return {
            ...item,
            isRiverCourse: true, // 是否是河道显示类型
            typeCode: '1',
            watershedStr,
            index: index + 1
        }
    }))
    data.tableData = currTableData
}

/**
 * @name: 处理雨量弹框
 */
const detailFlood = () => {
    data.title = '雨量超警（5）'
    data.option = [
        {
            label: '序号',
            key: 'index',
        },
        {
            label: '雨情站',
            key: 'name',
            flex: 2
        },
        {
            label: '雨量 (mm)',
            key: 'mainPulsions',
            flex: 1,
        }
    ]
    data.tableData = [
        { index: 1, name: '吴介洋港', mainPulsions: '75' },
        { index: 2, name: '朱家塘港', mainPulsions: '70' },
        { index: 3, name: '张家桥港', mainPulsions: '65' },
        { index: 3, name: '张家桥港', mainPulsions: '64' },
        { index: 3, name: '五常港（沿山河口）', mainPulsions: '60' },
    ]
}
/**
 * @name: 处理积水弹框
 */
const detailPonding = () => {
    data.title = '积水点'
    data.tableHeight = 760
    data.option = [
        {
            label: '序号',
            key: 'index',
        },
        {
            label: '积水点',
            key: 'name',
            flex: 2.4
        },
        {
            label: '状态',
            key: 'mainPulsions',
            render(item: record, optionItem: popTableOptionTs) {
                if (!optionItem.key) return ''
                if (item[optionItem.key] === 1) return '正常'
                else return '预警'
            },
            renderStyle(item: record, optionItem: popTableOptionTs) {
                if (!optionItem.key) return {}
                if (item[optionItem.key] === 1) {
                    return {
                        color: '#36F097'
                    }
                }
                else {
                    return {
                        color: '#F84439'
                    }
                }
            }
        }
    ]
    data.tableData = [
        { index: 1, name: '吴介洋港', mainPulsions: 1 },
        { index: 2, name: '朱家塘港', mainPulsions: 2 },
        { index: 3, name: '张家桥港', mainPulsions: 2 },
        { index: 3, name: '张家桥港', mainPulsions: 2 },
        { index: 3, name: '五常港（沿山河口）', mainPulsions: 2 },
        { index: 3, name: '五常港（沿山河口）', mainPulsions: 2 },
        { index: 3, name: '五常港（沿山河口）', mainPulsions: 2 },
        { index: 3, name: '五常港（沿山河口）', mainPulsions: 2 },
        { index: 3, name: '五常港（沿山河口）', mainPulsions: 2 },
        { index: 3, name: '五常港（沿山河口）', mainPulsions: 2 },
        { index: 3, name: '五常港（沿山河口）', mainPulsions: 2 },
        { index: 3, name: '五常港（沿山河口）', mainPulsions: 2 },
        { index: 3, name: '五常港（沿山河口）', mainPulsions: 2 },
        { index: 3, name: '五常港（沿山河口）', mainPulsions: 2 },
        { index: 3, name: '五常港（沿山河口）', mainPulsions: 2 },
        { index: 3, name: '五常港（沿山河口）', mainPulsions: 2 },
        { index: 3, name: '五常港（沿山河口）', mainPulsions: 2 },
        { index: 3, name: '五常港（沿山河口）', mainPulsions: 2 },
        { index: 3, name: '五常港（沿山河口）', mainPulsions: 2 },
        { index: 3, name: '五常港（沿山河口）', mainPulsions: 2 },
    ]
}

/**
 * @name: 处理旱情
 */
const detailFloodDrought = () => {
    data.title = '旱情预警'
    data.tableHeight = 760
    data.option = [
        {
            label: '序号',
            key: 'index',
        },
        {
            label: '积水点',
            key: 'name',
            flex: 2.4
        },
        {
            label: '状态',
            key: 'mainPulsions',
            render(item: record, optionItem: popTableOptionTs) {
                if (!optionItem.key) return ''
                if (item[optionItem.key] === 0) return '未处置'
                else if (item[optionItem.key] === 1) return '处置中'
                else return '已处置'
            },
            renderStyle(item: record, optionItem: popTableOptionTs) {
                if (!optionItem.key) return {}
                if (item[optionItem.key] === 2) {
                    return {
                        color: '#36F097'
                    }
                }
                else if (item[optionItem.key] === 1) {
                    return {
                        color: '#F7C706'
                    }
                }
                else {
                    return {
                        color: '#F84439'
                    }
                }
            }
        }
    ]
    data.tableData = [
        { index: 1, name: '吴介洋港', mainPulsions: 0 },
        { index: 2, name: '朱家塘港', mainPulsions: 0 },
        { index: 3, name: '张家桥港', mainPulsions: 0 },
        { index: 3, name: '张家桥港', mainPulsions: 0 },
        { index: 3, name: '五常港（沿山河口）', mainPulsions: 1 },
        { index: 3, name: '五常港（沿山河口）', mainPulsions: 1 },
        { index: 3, name: '五常港（沿山河口）', mainPulsions: 1 },
        { index: 3, name: '五常港（沿山河口）', mainPulsions: 1 },
        { index: 3, name: '五常港（沿山河口）', mainPulsions: 1 },
        { index: 3, name: '五常港（沿山河口）', mainPulsions: 1 },
        { index: 3, name: '五常港（沿山河口）', mainPulsions: 1 },
        { index: 3, name: '五常港（沿山河口）', mainPulsions: 1 },
        { index: 3, name: '五常港（沿山河口）', mainPulsions: 1 },
        { index: 3, name: '五常港（沿山河口）', mainPulsions: 2 },
        { index: 3, name: '五常港（沿山河口）', mainPulsions: 2 },
        { index: 3, name: '五常港（沿山河口）', mainPulsions: 2 },
        { index: 3, name: '五常港（沿山河口）', mainPulsions: 2 },
        { index: 3, name: '五常港（沿山河口）', mainPulsions: 2 },
        { index: 3, name: '五常港（沿山河口）', mainPulsions: 2 },
        { index: 3, name: '五常港（沿山河口）', mainPulsions: 2 },
    ]
}

/**
 * @name: 水质站
 */
const detailWaterQuality = () => {
    data.title = '水质预警'
    data.tableHeight = 760
    data.option = [
        {
            label: '序号',
            key: 'index',
        },
        {
            label: '站点名称',
            key: 'name',
            flex: 2.4
        },
        {
            label: '状态',
            key: 'disposeType',
            render(item: record, optionItem: popTableOptionTs) {
                if (!optionItem.key) return ''
                if (item[optionItem.key] === 0) return '未处置'
                else if (item[optionItem.key] === 1) return '处置中'
                else return '已处置'
            },
            renderStyle(item: record, optionItem: popTableOptionTs) {
                if (!optionItem.key) return {}
                if (item[optionItem.key] === 2) {
                    return {
                        color: '#36F097'
                    }
                }
                else if (item[optionItem.key] === 1) {
                    return {
                        color: '#F7C706'
                    }
                }
                else {
                    return {
                        color: '#F84439'
                    }
                }
            }
        }
    ]
    watchEffect(() => {
        if (popStore.getPopData && popStore.getPopData.pointList) {
            const tableData = cloneDeep(popStore.getPopData.pointList)
            tableData
            && tableData.forEach((item: any, index: number) => {
                item.index = index + 1
            })
            data.tableData = tableData
        }
    })
}
/**
 * @name: 页码切换
 */
const currentChange = async (page: number) => {
    data.currPage = page
    const sliceData = cloneDeep(popStore.popData.pointData.slice(15 * (data.currPage - 1), 15 * (data.currPage - 1) + 15))
    data.tableData = await Promise.all(sliceData.map(async (item: any, index: number) => {
        const waterData = await treeUtil.getValleyCodeObj(item.watershedId)
        const watershedStr = waterData ? waterData.label : '--'
        return {
            ...item,
            typeCode: '1',
            isRiverCourse: true, // 是否是河道显示类型
            watershedStr,
            index: index + 1
        }
    }))
}
/**
 * @desc: 监听面板点击事件
 */
watch(() => popStore.getPop, (val) => {
    detailPopChange(val)
}, { deep: true, immediate: true })
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
    popStore.getCurrentPop === 'waterQualityPop' && showMapPop('MapPointWarningPop', item, [item.longitude, item.latitude], 'MapPointWarningPop-panel')
    popStore.getCurrentPop === 'BadVRiverPopup' && showMapPop('WaterCommonMainPop', item, [item.longitude, item.latitude], 'WaterCommonMainPop-panel')
}

const { option, tableData, title, tableHeight, isShowPage, pageTotal } = toRefs(data)
</script>

<style scoped lang="scss">
::v-deep() .el-pagination {
    .btn-next,
    .btn-prev {
        color: white;
        background-color: transparent;
    }
}

::v-deep() .el-pager {
    li {
        color: white;
        background-color: transparent;
        border: 0 !important;
    }

    .is-active {
        color: #409eff;
        border: 0;
    }
}
</style>
