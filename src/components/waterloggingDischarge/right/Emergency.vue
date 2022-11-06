<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-09 18:42:13
 * @Description:
-->
<template lang="pug">
commonPanel(title="应急事件"  panelBg='panel-big' :height='200' :bigBgTop="14")
    template(#mainContent)
        .main-box
            .table-box
                PopupTable(:option="colunms" :data="tableData" :height="80" :lineStyle="{ height: '20px' }")
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
            label: '告警类型',
            flex: 3,
            headerStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
            }
        },
        {
            key: 'time',
            label: '创建时间',
            flex: 5,
            headerStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
            }
        },
        {
            key: 'level',
            label: '事件状态',
            flex: 2,
            headerStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
            },
            render: (item: record, optionItem: popTableOptionTs) => {
                return '待指派'
            },
            renderStyle: (item: record, optionItem: popTableOptionTs) => {
                return {
                    color: '#FF9902'
                }
            }
        },

    ] as popTableOptionTs[],
    tableData: [
        { name: '内涝积水', index: '1', level: '1', time: '2022-06-19 11:08:09' },
        { name: '内涝积水', index: '2', level: '1', time: '2022-06-19 11:08:09' },
        { name: '内涝积水', index: '3', level: '1', time: '2022-06-19 11:08:09' },
        { name: '内涝积水', index: '4', level: '1', time: '2022-06-19 11:08:09' },
        { name: '内涝积水', index: '5', level: '1', time: '2022-06-19 11:08:09' },
        { name: '内涝积水', index: '5', level: '1', time: '2022-06-19 11:08:09' },
        { name: '内涝积水', index: '5', level: '1', time: '2022-06-19 11:08:09' },
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
    margin: 12px auto 0;
}
</style>
