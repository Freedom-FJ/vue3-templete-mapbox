<!--
 * @Author: mjh
 * @Date: 2022-09-06 09:38:02
 * @LastEditors: mjh
 * @LastEditTime: 2022-10-09 16:36:23
 * @Description:
-->
<template lang="pug">
commonPanel(title="积水点监测"  panelBg='panel-big' :height='200' :bigBgTop="14")
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
            key: 'rank',
            label: '排名',
            flex: 1,
            headerStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
            },
            // rowStyle: {
            //     height: '20px'
            // }
        },
        {
            key: 'name',
            label: '积水点名称',
            flex: 4,
            headerStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px'
            }
        },
        {
            key: 'num',
            label: '雨量',
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
                const labelList = ['', '高级', '中级', '初级']
                return labelList[item[optionItem.key || '']]
            },
            renderStyle: (item: record, optionItem: popTableOptionTs) => {
                const colorList = ['', 'rgba(248, 68, 57, 1)', 'rgba(255, 153, 2, 1)', 'rgba(54, 240, 151, 1)']
                return {
                    color: colorList[item[optionItem.key || '']]
                }
            }
        },

    ] as popTableOptionTs[],
    tableData: [
        { name: '梦创街-灵源村', rank: '1', level: 1, num: '324' },
        { name: '梦创街-灵源村', rank: '2', level: 2, num: '324' },
        { name: '梦创街-灵源村', rank: '3', level: 3, num: '324' },
        { name: '梦创街-灵源村', rank: '4', level: 1, num: '324' },
        { name: '梦创街-灵源村', rank: '5', level: 2, num: '324' },
        { name: '梦创街-灵源村', rank: '5', level: 1, num: '324' },
        { name: '梦创街-灵源村', rank: '5', level: 1, num: '324' },
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
    margin: 10px auto 0;
}
</style>
