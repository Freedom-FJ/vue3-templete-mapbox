<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-09 14:59:42
 * @Description:
-->
<template lang="pug">
commonPanel(title="风险预警"  panelBg='panel-big' :height='316' :bigBgTop="14")
    template(#mainContent)
        .main-box
            .table-box
                PopupTable(:option="colunms" :data="tableData" :height="200")
</template>

<script setup lang="ts">
import type { popTableOptionTs } from '@/types/common'
import { globalKey } from '@/symbols'
const global = inject(globalKey)
const data = reactive({
    timeList: ['实时', '历史'],
    colunms: [
        {
            key: 'index',
            label: '序号',
            flex: 1,
            headerStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
            }
        },
        {
            key: 'name',
            label: '名称',
            flex: 4,
            headerStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
            }
        },
        {
            key: 'time',
            label: '预警时间',
            flex: 3,
            headerStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
            }
        },
        {
            key: 'level',
            label: '预警级别',
            flex: 2,
            headerStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
            },
            render: (item: record, optionItem: popTableOptionTs) => {
                return '红色预警'
            },
            renderStyle: (item: record, optionItem: popTableOptionTs) => {
                return {
                    color: 'rgba(248, 68, 57, 1)'
                }
            }
        },

    ] as popTableOptionTs[],
    tableData: [
        { name: '梦创街-灵源村', index: '1', level: '1', time: '2022-07-25' },
        { name: '梦创街-灵源村', index: '2', level: '1', time: '2022-07-25' },
        { name: '梦创街-灵源村', index: '3', level: '1', time: '2022-07-25' },
        { name: '梦创街-灵源村', index: '4', level: '1', time: '2022-07-25' },
        { name: '梦创街-灵源村', index: '5', level: '1', time: '2022-07-25' },
        { name: '梦创街-灵源村', index: '5', level: '1', time: '2022-07-25' },
        { name: '梦创街-灵源村', index: '5', level: '1', time: '2022-07-25' },
    ],
    activeIndex: 0,
    countObj: {
        red: 34,
        orange: 8,
        yellow: 6,
        common: 22
    }
})

onMounted(() => {
    //
})
const checkRainType = (index: number) => {
    data.activeIndex = index
}

const { timeList, countObj, activeIndex, tableData, colunms } = toRefs(data)
</script>

<style lang="scss" scoped>
.main-box {
    width: 94%;
    margin: 20px auto 0;
}
</style>
