<!--
 * @Author: mjh
 * @Date: 2022-09-01 16:27:12
 * @LastEditors: mjh
 * @LastEditTime: 2022-09-06 16:15:50
 * @Description:
-->
<template lang="pug">
PopupPanel( :title="title")
    popup-table(:option="option" ref="popupTableDom"  :data="tableData" :height="tableHeight" @checkLine="checkLine" :canClick="true")
        template( v-slot:value="{props}")
            .table-solt
                .num-14.red {{props.item.status}}
</template>

<script lang="ts" setup name="ReminderTodayPop">
import dayjs from 'dayjs'
import { useMapStore } from '@/store/map'
import MapUtil from '@/utils/map/mapUtils'
import type { popTableOptionTs } from '@/types/common'
import { showMapPop } from '@/utils/map/mapInit'
import service from '@/service/api'
const propsData = defineProps({
    propsData: {
        type: [Object],
        default: () => {
            return {}
        }
    }
})
const mapStore = useMapStore()
const data = reactive({
    title: '今日提醒',
    option: [
        {
            label: '序号',
            key: 'index',
            flex: 0.5,
        },
        {
            label: '监测点',
            key: 'name',
        },
        {
            label: '状态',
            key: 'value',

        }
    ] as popTableOptionTs[],
    tableData: [] as record[],
    tableHeight: 100,
    popupTableDom: ref()
})
watch(() => mapStore.getMapPop, (val) => {
    console.log(val, 'map val')
    if (val.id !== 'AlgaeWarningPointPop-panel') data.popupTableDom?.clearClick()
})
onMounted(() => {
    detailBadVRiver()
})

/**
 * @name: 获取今日提醒列表
 */
const detailBadVRiver = async () => {
    const res = await service(propsData.propsData.popData ? 'drinkingWaterSource/algaeSiteOverStatHandle' : 'drinkingWaterSource/algaeSiteOverStat', {
        begin: dayjs().startOf('year').valueOf(),
        end: dayjs().add(1, 'days').startOf('day').valueOf(),
        timeType: propsData.propsData.popData ? 'day' : ''
    })
    const resiltList: any = res?.data || []
    data.tableHeight = 40 * resiltList.length + 70
    resiltList.forEach((item: Record<string, any>, index: number) => {
        item.index = index + 1
        item.status = '预警'
        item.name = item.siteInfo.name
        item.latitude = item.siteInfo.latitude
        item.longitude = item.siteInfo.longitude
        item.accessCode = item.siteInfo.accessCode
    })
    data.tableData = resiltList
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
    showMapPop('AlgaeWarningPointPop', item, [parseFloat(item.longitude), parseFloat(item.latitude)], 'AlgaeWarningPointPop-panel')
}

const { option, tableData, title, tableHeight, popupTableDom } = toRefs(data)
</script>

<style scoped lang="scss">
.table-solt {
    flex: 1;
    display: flex;
    justify-content: center;

}
</style>
