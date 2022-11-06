<!--
 * @Author: mjh
 * @Date: 2022-09-01 16:27:12
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-11 09:33:44
 * @Description:
-->
<template lang="pug">
PopupPanel( :title="title")
    popup-table(:option="option" ref="popupTableDom"  :data="tableData" :height="tableHeight" @checkLine="checkLine" :canClick="true")
        template( v-slot:value="{props}")
            .table-solt
                .num-14.green {{props.item.green}}
                .num-mid.mg-2 /
                .num-14.yellow   {{props.item.yellow}}
                .num-mid.mg-2 /
                .num-14.orange {{props.item.orange}}
                .num-mid.mg-2 /
                .num-14.red {{props.item.red}}
    el-pagination( layout="prev, pager, next" :pager-count="5" :total="pageTotal" :page-size="20" @current-change="currentChange" style="margin: -5px auto;width: fit-content;")
</template>

<script lang="ts" setup name="EarlyWarningEventPop">
import dayjs from 'dayjs'
import type { warningApiTsBody, warningDataTs } from './types'
import { getSetTreeCode } from '@/utils/treeDataUtils'
import { useMapStore } from '@/store/map'
import MapUtil from '@/utils/map/mapUtils'
import type { popTableOptionTs } from '@/types/common'
import { showMapPop } from '@/utils/map/mapInit'
import service from '@/service/api'

const mapStore = useMapStore()
const data = reactive({
    title: '预警事件',
    option: [] as popTableOptionTs[],
    tableData: [] as warningDataTs[],
    tableHeight: 670,
    popupTableDom: ref(),
    pageTotal: 0,
    currPage: 1
})
watch(() => mapStore.getMapPop, (val) => {
    if (val.id !== 'MapPointWarningPop-panel') data.popupTableDom?.clearClick()
})
onMounted(() => {
    data.option = [
        {
            label: '事件点位',
            key: 'siteName',
            rowStyle: {
                textAlign: 'left',
                paddingLeft: '10px'
            },
            headerStyle: {
                textAlign: 'left',
                paddingLeft: '10px'
            }
        },
        {
            label: '绿色/黄色/橙色/红色预警',
            key: 'value',
            flex: 1.5
        }
    ]
    getData()
})

/**
 * @name: 获取点位数据
 */
const getData = async () => {
    const treeData = await getSetTreeCode()

    const params = {
        startTime: dayjs().startOf('year').valueOf(),
        endTime: dayjs().valueOf(),
        page: data.currPage,
        limit: 20,
        regionCodeList: [treeData],
        eventLevelCodeList: [
            'yellow',
            'orange',
            'red',
            'green',
        ],
        envTypeCodeList: []
        // siteCodeList: ['QDH2001']
        // envTypeCodeList: ['001', '002', '003', '004', '005']
    }
    const res = await service<warningApiTsBody, true>('waterQuality/countEachEventLevelAlarmNumber', params)

    if (res.data) {
        data.pageTotal = res.totalCount
        data.tableData = res.data.map((item) => {
            const detail = item.detailMap
            const currData: warningDataTs = {
                ...item,
                green: detail.绿色事件?.currentTotalNum ?? '--',
                yellow: detail.绿色事件?.currentTotalNum ?? '--',
                orange: detail.橙色事件?.currentTotalNum ?? '--',
                red: detail.红色事件?.currentTotalNum ?? '--'
            }
            return currData
        })
    }
}
/**
 * @name: 页码切换
 */
const currentChange = (page: number) => {
    data.currPage = page
    getData()
}
/**
 * @name: 地图弹框事件
 * @param {*} item
 * @param {*} index
 */
const checkLine = (item: warningDataTs, index: number) => {
    if (index === -1) {
        MapUtil._removeMapboxPopup()
        return
    }
    showMapPop('MapPointWarningPop', item, [+item.longitude, +item.latitude], 'MapPointWarningPop-panel')
}

const { pageTotal, option, tableData, title, tableHeight, popupTableDom } = toRefs(data)
</script>

<style scoped lang="scss">
.table-solt {
    display: flex;
    flex: 1;
    justify-content: center;
}

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
    }
}
</style>
